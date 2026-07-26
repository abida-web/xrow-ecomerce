import { db } from "@/drizzle/db";
import {
  address,
  cart,
  cartItem,
  order,
  orderAddress,
  orderItem,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
interface CartItemWithVariant {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    price: number;
    stock: number;
    product: {
      id: string;
      name: string;
      organizationId: string;
    };
  };
}

export async function POST(req: Request) {
  const { address: addressData } = await req.json();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }

  const userCart = await db.query.cart.findFirst({
    where: eq(cart.userId, session.user.id),
  });

  if (!userCart) {
    return NextResponse.json({ error: "Cart not exist" }, { status: 404 });
  }

  const userCartItems: any = await db.query.cartItem.findMany({
    where: eq(cartItem.cartId, userCart.id),
    with: {
      variant: {
        with: {
          product: true,
        },
      },
    },
  });

  // Calculate totals
  const subTotal = userCartItems.reduce((total: number, item: any) => {
    return total + item.quantity * item.variant?.price;
  }, 0);
  const shipping = subTotal > 300 ? 0 : 10;
  const tax = subTotal > 1000 ? 10 : 0;
  const total = subTotal + shipping + tax;

  // Stock validation
  for (const item of userCartItems) {
    if (!item.variantId) continue;

    const variantData: any = await db.query.variants.findFirst({
      where: eq(variants.id, item.variantId),
    });

    if (!variantData) {
      return NextResponse.json({ error: "Cart not exist" }, { status: 404 });
    }

    if (variantData && variantData.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for variant ${item.variantId}` },
        { status: 400 },
      );
    }
  }

  const groupedOrders = new Map();
  for (const item of userCartItems) {
    const orgId = item.variant.product.organizationId;
    if (!groupedOrders.has(orgId)) {
      groupedOrders.set(orgId, []);
    }
    const arrayItems = groupedOrders.get(orgId);
    arrayItems.push(item);
  }

  for (const [orgId, items] of groupedOrders) {
    // Calculate subtotal for this organization
    const orgSubtotal = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.variant.price;
    }, 0);

    // Create ONE order for this organization
    const [newOrder] = await db
      .insert(order)
      .values({
        userId: session.user.id,
        organizationId: orgId,
        status: "pending",
        subtotal: orgSubtotal.toString(),
        total: orgSubtotal.toString(), // Add shipping/tax per org if needed
      })
      .returning();

    // Insert ALL items for this organization into the SAME order
    for (const item of items) {
      await db.insert(orderItem).values({
        orderId: newOrder.id,
        variantId: item.variantId,
        quantity: item.quantity.toString(),
        priceAtPurchase: item.variant?.price.toString(),
      });

      // Update stock for each item
      await db
        .update(variants)
        .set({ stock: sql`${variants.stock} - ${item.quantity}` })
        .where(eq(variants.id, item.variantId));
    }

    // Create address for this order (once per order)
    await db.insert(address).values({
      userId: session.user.id,
      fullName: addressData.fullName,
      phone: addressData.phone,
      email: addressData.email,
      country: addressData.country,
      province: addressData.province,
      city: addressData.city,
      streetAddress: addressData.streetAddress,
      postalCode: addressData.postalCode,
      isDefault: addressData.isDefault,
    });

    await db.insert(orderAddress).values({
      orderId: newOrder.id,
      fullName: addressData.fullName,
      phone: addressData.phone,
      email: addressData.email,
      country: addressData.country,
      province: addressData.province,
      city: addressData.city,
      streetAddress: addressData.streetAddress,
      postalCode: addressData.postalCode,
    });
  }

  // Clear cart after all orders are created
  await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

  return NextResponse.json({
    success: true,
  });
}

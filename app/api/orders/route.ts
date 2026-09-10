import { db } from "@/drizzle/db";
import {
  address,
  cart,
  cartItem,
  notification,
  order,
  orderItem,
  organizationTables,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";
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
  const { address: addressData, shipping: shippingData } = await req.json();
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
          product: {
            with: {
              organization: {
                with: {
                  settings: true,
                },
              },
            },
          },
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
  const addressIsDeafult = await db.query.address.findFirst({
    where: and(
      eq(address.userId, session.user.id),
      eq(address.isDefault, true),
    ),
  });
  const shouldBeDefault = addressData.isDefault === true || !addressIsDeafult;

  const groupedOrders = new Map();
  for (const item of userCartItems) {
    const orgId = item.variant.product.organizationId;
    if (!groupedOrders.has(orgId)) {
      groupedOrders.set(orgId, []);
    }
    if (
      item.variant?.product?.organization?.settings?.storeVisibility === false
    ) {
      return NextResponse.json(
        {
          error: `Store ${item.variant.product.organization.name} is currently closed`,
        },
        { status: 400 },
      );
    }
    const arrayItems = groupedOrders.get(orgId);
    arrayItems.push(item);
  }

  for (const [orgId, items] of groupedOrders) {
    // Calculate subtotal for this organization
    const orgSubtotal = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.variant.price;
    }, 0);
    const OrgShipping = shippingData?.[orgId];

    if (!OrgShipping || !OrgShipping.methodId) {
      return NextResponse.json(
        {
          error: `Shipping method not selected for organization ${orgId}`,
          code: "MISSING_SHIPPING",
        },
        { status: 400 },
      );
    }
    // Create ONE order for this organization
    const [newOrder] = await db
      .insert(order)
      .values({
        userId: session.user.id,
        organizationId: orgId,
        status: "pending",
        subtotal: orgSubtotal.toString(),
        total: orgSubtotal.toString(),
        shippingMethodId: OrgShipping.methodId,
        shippingRateId: OrgShipping.rateId,
        shippingMethodName: OrgShipping.methodName,
        shippingRateName: OrgShipping.rate,
        shippingFullName: addressData.fullName,
        shippingPhone: addressData.phone,
        shippingEmail: addressData.email,
        shippingCountry: addressData.country,
        shippingProvince: addressData.province,
        shippingCity: addressData.city,
        shippingStreetAddress: addressData.streetAddress,
        shippingPostalCode: addressData.postalCode,
      })
      .returning();
    await db
      .insert(notification)
      .values({
        shopId: orgId,
        type: "NEW ORDER",
        title: "New order recived",
        message: `Order #${newOrder.id.slice(0, 10)} has been placed`,
        entityType: "ORDER",
        entityId: String(order.id),
        isRead: false,
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
    let isDefault = shouldBeDefault;
    if (isDefault && addressIsDeafult) {
      // Set all existing default addresses to false
      await db
        .update(address)
        .set({ isDefault: false })
        .where(
          and(eq(address.userId, session.user.id), eq(address.isDefault, true)),
        );
    }

    if (addressData.isDefault === false) {
      if (!addressData.isDefault) {
        await db.insert(address).values({
          orderId: newOrder.id,
          userId: session.user.id,
          fullName: addressData.fullName,
          phone: addressData.phone,
          email: addressData.email,
          country: addressData.country,
          province: addressData.province,
          city: addressData.city,
          streetAddress: addressData.streetAddress,
          postalCode: addressData.postalCode,
          isDefault: isDefault,
        });
      }
    }
  }

  // Clear cart after all orders are created
  await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

  return NextResponse.json({
    success: true,
  });
}

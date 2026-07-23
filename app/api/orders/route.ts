import { db } from "@/drizzle/db";
import { cart, cartItem, order, orderItem, variants } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
  const subTotal = userCartItems.reduce((total: number, item: any) => {
    return total + item.quantity * item.variant?.price;
  }, 0);
  const shipping = subTotal > 300 ? 0 : 10;
  const tax = subTotal > 1000 ? 10 : 0;
  const total = subTotal + shipping + tax;

  // Fixed stock validation - check if variantId exists
  for (const item of userCartItems) {
    if (!item.variantId) continue; // Skip if no variantId

    const variantData: any = await db.query.variants.findFirst({
      where: eq(variants.id, item.variantId), // Now TypeScript knows it's a string
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
  const [createdOrder] = await db
    .insert(order)
    .values({
      userId: session.user.id,
      organizationId:
        userCartItems[0]?.variant?.product?.organizationId || null,
      status: "pending",
      subtotal: subTotal.toString(),
      total: total.toString(),
    })
    .returning();
  for (const item of userCartItems) {
    const [createdOrderItem] = await db
      .insert(orderItem)
      .values({
        orderId: createdOrder.id,
        variantId: item.variantId,
        quantity: Number(item.quantity).toString(), // Convert to string for numeric
        priceAtPurchase: Number(item.variant?.price || 0).toString(),
      })
      .returning();

    await db
      .update(variants)
      .set({ stock: sql`${variants.stock} - ${createdOrderItem.quantity}` })
      .where(eq(variants.id, item.variantId));
  }

  await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
  return NextResponse.json({
    success: true,
  });
}

import { db } from "@/drizzle/db";
import { cart, cartItem } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ variantId: string }> },
) {
  try {
    const { quantity } = await req.json();
    const { variantId } = await params;

    // Validate quantity
    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity is required" },
        { status: 400 },
      );
    }

    const numericQuantity = Number(quantity);
    if (isNaN(numericQuantity) || numericQuantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 },
      );
    }

    // Get session and user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // First get the user's cart
    const userCart = await db
      .select({ id: cart.id })
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (!userCart.length) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartId = userCart[0].id;

    // Update cart item using variantId and cartId
    const [updatedCartItem] = await db
      .update(cartItem)
      .set({
        quantity: String(numericQuantity),
        updatedAt: new Date(),
      })
      .where(
        and(eq(cartItem.variantId, variantId), eq(cartItem.cartId, cartId)),
      )
      .returning();

    if (!updatedCartItem) {
      return NextResponse.json(
        { error: "Cart item not found or doesn't belong to you" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quantity updated successfully",
        cartItem: updatedCartItem,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ variantId: string }> },
) {
  try {
    const { variantId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // First get the user's cart
    const userCart = await db
      .select({ id: cart.id })
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (!userCart.length) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartId = userCart[0].id;
    const deleteItem = await db
      .delete(cartItem)
      .where(
        and(eq(cartItem.cartId, cartId), eq(cartItem.variantId, variantId)),
      )
      .returning();
    return NextResponse.json(
      {
        success: true,
        message: "Cart item successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

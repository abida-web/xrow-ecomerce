import { db } from "@/drizzle/db";
import { cart, cartItem, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user cart
    const userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, session.user.id),
    });

    if (!userCart) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no cart
    }

    // Get all cart items with variant and product details
    const userCartItems = await db.query.cartItem.findMany({
      where: eq(cartItem.cartId, userCart.id),
      with: {
        variant: {
          with: {
            product: {
              with: {
                images: {
                  columns: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const [result] = await db.select({ total: count() }).from(cartItem);
    const totalCartItems = result?.total;
    return NextResponse.json({ userCartItems, totalCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { variantId, quantity } = await req.json();

  if (!variantId || !quantity) {
    return NextResponse.json(
      { error: "Missing required fields: variantId, quantity" },
      { status: 400 },
    );
  }

  // Get session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create user's cart
  let userCart = await db.query.cart.findFirst({
    where: eq(cart.userId, userData.id),
  });

  if (!userCart) {
    const [newCart] = await db
      .insert(cart)
      .values({
        userId: userData.id,
      })
      .returning();
    userCart = newCart;
  }

  // Check if the variant already exists in cart
  const existingItem = await db.query.cartItem.findFirst({
    where: and(
      eq(cartItem.cartId, userCart.id),
      eq(cartItem.variantId, variantId),
    ),
  });

  if (existingItem) {
    // Update quantity for existing variant
    const [updatedItem] = await db
      .update(cartItem)
      .set({
        quantity: String(Number(existingItem.quantity) + Number(quantity)),
        updatedAt: new Date(),
      })
      .where(eq(cartItem.id, existingItem.id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      cartItem: updatedItem,
    });
  } else {
    // Add new variant to cart
    const [newCartItem] = await db
      .insert(cartItem)
      .values({
        cartId: userCart.id,
        variantId: variantId,
        quantity: String(quantity),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cartItem: newCartItem,
    });
  }
}

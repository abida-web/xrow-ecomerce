import { db } from "@/drizzle/db";
import { order } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const orderData = await db.query.order.findFirst({
      where: eq(order.id, id),
      with: {
        user: true,
        organization: true,
        address: true,
        items: {
          with: {
            variant: {
              with: {
                optionValues: {
                  with: {
                    productOptionValue: true,
                  },
                },
                product: {
                  with: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

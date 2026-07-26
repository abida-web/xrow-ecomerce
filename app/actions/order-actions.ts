"use server";

import { db } from "@/drizzle/db";
import { cartItem, order, orderItem } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";

export const updateStatus = async ({
  status,
  orderId,
}: {
  status: string;
  orderId: string;
}) => {
  if (!orderId) return;
  const update = await db
    .update(order)
    .set({ status: status })
    .where(eq(order.id, orderId));
  return { success: true };
};

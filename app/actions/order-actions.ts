"use server";

import { db } from "@/drizzle/db";
import {
  cartItem,
  member,
  order,
  orderItem,
  organization,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
export const assignDriver = async (orderId: string, driverId: string) => {
  const update = await db
    .update(order)
    .set({ driverId: driverId, status: "out_for_delivery" })
    .where(eq(order.id, orderId));
  return { success: true };
};
export const driverDeliveries = async (storeslug: string, driverId: string) => {
  // Check if user is a driver
  const memberData = await db.query.member.findFirst({
    where: and(eq(member.userId, driverId), eq(member.role, "driver")),
  });
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  if (!storeData) {
    throw new Error("store data not found");
  }
  if (!memberData) {
    return [];
  }
  const deliveriesList = await db.query.order.findMany({
    where: and(
      eq(order.driverId, driverId),
      eq(order.organizationId, storeData.id),
    ),
    with: {
      driver: true,
    },
    orderBy: (order, { desc }) => [desc(order.createdAt)],
  });
  return deliveriesList;
};
export const getDeliveryDetails = async (orderId: string | null) => {
  if (!orderId) return;
  const listDetails = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: {
      items: {
        with: {
          variant: {
            with: {
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
  return listDetails;
};

"use server";

import { db } from "@/drizzle/db";
import {
  cartItem,
  member,
  notification,
  order,
  orderItem,
  organization,
  user,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const updateStatus = async ({
  status,
  orderId,
  storeslug,
}: {
  status: string;
  orderId: string;
  storeslug: string;
}) => {
  if (!orderId) return;
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  const update = await db
    .update(order)
    .set({ status: status })
    .where(eq(order.id, orderId));
  const newNotification = await db.insert(notification).values({
    shopId: storeData?.id,
    type: `ORDER ${status.toUpperCase()}`,
    title: "Order status changed",
    message: `Order #${orderId.slice(0, 10)} has been ${status}`,
    entityType: "ORDER",
    entityId: String(orderId),
    isRead: false,
  });
  return { success: true };
};
export const assignDriver = async (
  orderId: string,
  driverId: string,
  storeslug: string,
) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  const update = await db
    .update(order)
    .set({ driverId: driverId, status: "out_for_delivery" })
    .where(eq(order.id, orderId));
  const newNotification = await db.insert(notification).values({
    shopId: storeData?.id,
    type: "ORDER_ASSIGN",
    title: "Order assigned to driver",
    message: `Order #${orderId.slice(0, 10)} has been assigned`,
    entityType: "ORDER",
    entityId: String(orderId),
    isRead: false,
  });
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
export const getCustomers = async (storeslug: string, search: string) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  if (!storeData) {
    throw new Error("store data not found");
  }
  const data = await db
    .select({
      customer: user.name,
      email: user.email,
      orders: count(order.id),
      phone: sql<string | null>`MAX(${order.shippingPhone})`,
      total: sql<number>`COALESCE(SUM(${order.total}), 0)`,
      lastOrderDate: sql<Date | null>`MAX(${order.createdAt})`,
    })
    .from(user)
    .innerJoin(
      order,
      and(eq(order.userId, user.id), eq(order.organizationId, storeData.id)),
    )
    .where(
      and(
        or(
          ilike(user.name, `%${search.trim()}%`),
          ilike(user.email, `%${search.trim()}%`),
          ilike(order.shippingPhone, `%${search.trim()}%`),
        ),
      ),
    )
    .groupBy(user.id, user.name, user.email) // Group by user
    .orderBy(desc(sql`MAX(${order.createdAt})`));
  return data;
};
export const getNotification = async (
  storeSlug: string,
  selectedType: string,
) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeSlug),
  });
  if (!storeData) {
    throw new Error("Store not found");
  }
  let whereCondition;

  if (selectedType === "READ") {
    whereCondition = and(
      eq(notification.isRead, true),
      eq(notification.shopId, storeData.id),
    );
  } else if (selectedType === "UNREAD") {
    whereCondition = and(
      eq(notification.isRead, false),
      eq(notification.shopId, storeData.id),
    );
  } else {
    // "ALL" or any other value - get all notifications
    whereCondition = eq(notification.shopId, storeData.id);
  }
  const allNotifications = await db.query.notification.findMany({
    where: whereCondition
      ? whereCondition
      : eq(notification.shopId, storeData?.id),
    orderBy: desc(notification.createdAt),
  });
  return allNotifications;
};
export const markNotificationAsRead = async (
  notificationId: string,
  storeSlug: string,
) => {
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeSlug),
  });
  if (!storeData) {
    throw new Error("Store not found");
  }
  const mark = await db
    .update(notification)
    .set({ isRead: true })
    .where(
      and(eq(notification.id, notificationId), eq(notification.isRead, false)),
    );
  return { success: true };
};

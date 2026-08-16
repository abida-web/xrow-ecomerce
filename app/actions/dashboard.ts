"use server";

import { db } from "@/drizzle/db";
import {
  order,
  orderItem,
  productImages,
  products,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { and, asc, count, desc, eq, min, sql } from "drizzle-orm";

export const totalDashboardOperation = async (storeslug: string) => {
  const storeData = await getOrganizationBySlug(storeslug);
  if (!storeData) return;

  const ordersData = await db
    .select({
      todayRevenue: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${order.createdAt}::DATE = NOW()::DATE
            THEN ${order.total}
            ELSE 0
          END
        ), 0)
      `,
      totalOrdersForToday: sql<number>`
        COUNT(DISTINCT
          CASE
            WHEN ${order.createdAt}::DATE = NOW()::DATE
            THEN ${order.userId} 
            ELSE NULL
          END
        )
      `,
      totalOrders: count(order.id),
      totalRevenue: sql<number>`COALESCE(SUM(${order.total}), 0)`,
      totalCustomers: sql<number>`COUNT(DISTINCT ${order.userId})`,
    })
    .from(order)
    .where(eq(order.organizationId, storeData.id));

  const {
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalOrdersForToday,
    todayRevenue,
  } = ordersData[0];

  const salesOverviewData = await db
    .select({
      date: sql<number>`${order.createdAt}::DATE`,
      revenue: sql<number>`SUM(${order.total})`,
    })
    .from(order)
    .where(
      and(
        eq(order.organizationId, storeData.id),
        sql`${order.createdAt} >= NOW() - INTERVAL '1 MONTH'`,
      ),
    )
    .groupBy(order.createdAt) // ✅ Use ::DATE in GROUP BY
    .orderBy(order.createdAt);

  const topProducts = await db
    .select({
      productId: products.id, // ✅ Use this for React keys
      image: min(productImages.url).as("image"),
      name: products.name,
      orderCount: count(orderItem.id),
      price: min(variants.price).as("price"),
    })
    .from(orderItem)
    .innerJoin(order, eq(order.id, orderItem.orderId))
    .innerJoin(variants, eq(variants.id, orderItem.variantId))
    .innerJoin(products, eq(products.id, variants.productId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(order.organizationId, storeData.id))
    .groupBy(products.id, products.name) // ✅ Products grouped correctly
    .orderBy(desc(count.apply(orderItem.id)))
    .limit(5);
  const tenLowStack = await db
    .select({
      id: products.id,
      image: min(productImages.url).as("image"),
      name: products.name,
      stock: sql<number>`SUM(${variants.stock})`,
    })
    .from(products)
    .innerJoin(variants, eq(variants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(products.organizationId, storeData.id))
    .groupBy(products.id, products.name)
    .orderBy(asc(sql`SUM(${variants.stock})`)) // Order by lowest total stock first
    .limit(10);
  return {
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalOrdersForToday,
    todayRevenue,
    salesOverviewData,
    topProducts,
    tenLowStack,
  };
};

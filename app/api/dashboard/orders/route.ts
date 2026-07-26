import { db } from "@/drizzle/db";
import { order, orderItem, user } from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { and, eq, ilike, or, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const slug = searchParams.get("slug");
  const limit = 50;
  const offset = (page - 1) * limit;

  if (!slug) {
    return Response.json({ error: "Slug is required" }, { status: 400 });
  }

  const storeData = await getOrganizationBySlug(slug);
  if (!storeData) {
    return Response.json({ error: "Store not found" }, { status: 404 });
  }

  // Build filters
  let filters: any = [eq(order.organizationId, storeData.id)];

  if (search) {
    filters.push(
      or(
        ilike(sql`${order.id}::text`, `%${search.trim()}%`),
        ilike(user.name, `%${search.trim()}%`),
      ),
    );
  }

  if (status) {
    filters.push(eq(order.status, status));
  }

  // First, get the orders with their items
  const results = await db
    .select({
      id: order.id,
      customer: user.name,
      total: order.total,
      status: order.status,
      date: order.createdAt,

      itemCount: sql<number>`count(${orderItem.id})`.as("itemCount"),
    })
    .from(order)
    .innerJoin(user, eq(order.userId, user.id))
    .leftJoin(orderItem, eq(orderItem.orderId, order.id))
    .where(and(...filters))
    .groupBy(order.id, user.name, order.total, order.status, order.createdAt)
    .orderBy(desc(order.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(results);
}

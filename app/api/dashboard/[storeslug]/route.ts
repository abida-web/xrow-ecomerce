import { db } from "@/drizzle/db";
import { order, organization, products, user } from "@/drizzle/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm"; // ✅ Add sql import
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeslug: string }> },
) {
  const storeslug = (await params).storeslug;
  const storeData = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  if (!storeData) return;
  const { searchParams } = await new URL(req.url);
  const search = searchParams.get("search");

  const [productsDetails, ordersDetails, customersDetails] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
      })
      .from(products)
      .where(
        and(
          ilike(products.name, `%${search}%`),
          eq(products.organizationId, storeData?.id),
        ),
      )
      .limit(5),
    db
      .select({
        id: order.id,
      })
      .from(order)
      .where(
        and(
          // ✅ Cast UUID to text for ilike
          sql`${order.id}::text ILIKE ${`%${search}%`}`,
          eq(order.organizationId, storeData?.id),
        ),
      )
      .limit(5),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .innerJoin(order, eq(order.userId, user.id))
      .where(
        and(
          eq(order.organizationId, storeData?.id),
          or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)),
        ),
      )
      .limit(5),
  ]);
  console.log(productsDetails);
  console.log(customersDetails);
  console.log(ordersDetails);
  return NextResponse.json({
    productsDetails,
    customersDetails,
    ordersDetails,
  });
}

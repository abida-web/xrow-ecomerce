import { db } from "@/drizzle/db";
import {
  categories,
  organization,
  productImages,
  products,
  variants,
} from "@/drizzle/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const pageparam = searchParams.get("page");
  const sort = searchParams.get("sort");
  const brand = searchParams.get("brand");
  const inStack = searchParams.get("in-stock");
  const outOfStock = searchParams.get("out-of-stock");

  const page = pageparam ? parseInt(pageparam) : 1;
  const limit = 11;
  const offset = (page - 1) * limit;

  // Use DISTINCT ON to get unique products
  let query: any = db
    .selectDistinctOn([products.id], {
      id: products.id,
      name: products.name,
      brand: products.brand,
      description: products.description,
      category: categories.name,
      price: variants.price,
      stock: variants.stock,
      comparePriceAt: variants.comparePriceAt,
      organizationName: organization.name,
      organizationLogo: organization.logo,
      images: productImages.url,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(variants, eq(products.id, variants.productId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(organization, eq(products.organizationId, organization.id));

  const filters = [];

  if (search) {
    filters.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.brand, `%${search}%`),
        ilike(categories.name, `%${search}%`),
      ),
    );
  }

  if (category) {
    filters.push(eq(categories.name, category));
  }

  if (minPrice) {
    filters.push(sql`${variants.price} >= ${minPrice}`);
  }

  if (maxPrice) {
    filters.push(sql`${variants.price} <= ${maxPrice}`);
  }
  if (inStack === "true") {
    filters.push(sql`${variants.stock} > 0`);
  }
  if (outOfStock === "true") {
    filters.push(sql`${variants.stock} = 0`);
  }
  if (brand) {
    filters.push(sql`${products.brand} = ${brand}`);
  }
  if (filters.length > 0) {
    query = query.where(and(...filters));
  }

  // Handle sorting - must include products.id first for DISTINCT ON
  let orderByClause;
  if (sort === "newest") {
    orderByClause = sql`${products.id}, ${products.createdAt} DESC`;
  } else if (sort === "low") {
    orderByClause = sql`${products.id}, ${variants.price} ASC`;
  } else if (sort === "high") {
    orderByClause = sql`${products.id}, ${variants.price} DESC`;
  } else {
    orderByClause = sql`${products.id}, ${products.createdAt} DESC`;
  }

  const results = await query
    .limit(limit)
    .offset(offset)
    .orderBy(orderByClause);

  return NextResponse.json(results);
}

import { db } from "@/drizzle/db";
import {
  categories,
  organization,
  productImages,
  products,
  variants,
} from "@/drizzle/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = await new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const pageparam = searchParams.get("page");
  const page = pageparam ? parseInt(pageparam) : 1;
  const limit = 3;
  const offset = (page - 1) * limit;
  let query: any = db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      description: products.description,
      category: categories.name,
      price: variants.price,
      comparePriceAt: products.comparePriceAt,
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
    filters.push(eq(categories.name, category)); // Fixed: use categories.name
  }

  if (minPrice) {
    filters.push(sql`${variants.price} >= ${minPrice}`); // Fixed: >= for minPrice
  }

  if (maxPrice) {
    filters.push(sql`${variants.price} <= ${maxPrice}`); // Fixed: <= for maxPrice
  }

  if (filters.length > 0) {
    query = query.where(and(...filters));
  }

  const results = await query.limit(limit).offset(offset);

  return NextResponse.json(results); // Fixed: return the results
}

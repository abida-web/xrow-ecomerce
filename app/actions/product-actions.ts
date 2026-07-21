"use server";

import { db } from "@/drizzle/db";
import { products, variants } from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { table } from "console";
import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import { string } from "zod";

export const getCategories = async () => {
  const list = await db.query.categories.findMany();
  return list;
};
export const getProducts = async (
  storeslug: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
) => {
  let offset = (page - 1) * limit;
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const productsList = await db.query.products.findMany({
    where: search?.trim()
      ? and(
          eq(products.organizationId, organizationData.id),
          or(
            ilike(products.name, `%${search.trim()}%`),
            ilike(products.brand, `%${search.trim()}%`),
            ilike(products.status, `%${search.trim()}%`),
          ),
        )
      : eq(products.organizationId, organizationData.id),
    extras: {
      variantCount: sql<number>`(
        SELECT COUNT(*) FROM variants WHERE variants.product_id = ${products.id}
      )`.as("variant_count"),
    },
    with: {
      variants: true,
      images: true,
      category: true,
    },
    limit,
    offset,
  });
  const productListData = productsList.map((product) => ({
    id: product.id,
    name: product.name,
    costPrice: product.costPrice,
    createdAt: product.createdAt,
    variants: product.variantCount,
    price: product.variants.map((v) => v.price),
    sku: product.variants.map((v) => v.sku),
    stock: product.variants.map((v) => v.stock),
    image: product.images.map((i) => i.url),
    status: product.status,
  }));
  const totalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.organizationId, organizationData.id));

  const totalProducts = Number(totalCount[0]?.count) || 0;
  const totalPages = Math.ceil(totalProducts / limit);
  return { productListData, totalPages };
};
interface GetProductProps {
  storeslug: string;
  productId: string;
}
export const getProduct = async ({ storeslug, productId }: GetProductProps) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Organization doesn't exist");
  }
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.organizationId, organizationData.id),
      eq(products.id, productId),
    ),
    with: {
      variants: true,
      images: true,
      category: true,
    },
  });
  if (!product) {
    throw new Error("Product not exist");
  }
  return {
    id: product.id,
    organizationId: product.organizationId,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    status: product.status,
    comparePriceAt: product.comparePriceAt,
    costPrice: product.costPrice,
    brand: product.brand,
    weight: product.weight,
    weightUnit: product.weightUnit,
    variants: product.variants,
    images: product.images.map((image) => ({
      url: image.url,
    })),
    category: product.category,
  };
};
export const removeProduct = async ({
  storeslug,
  productId,
}: {
  storeslug: string;
  productId: string;
}) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Organization doesn't exist");
  }
  const remove = await db
    .delete(products)
    .where(
      and(
        eq(products.organizationId, organizationData.id),
        eq(products.id, productId),
      ),
    );
  return { success: true };
};
export const getVariantsList = async (storeslug: string, productId: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Organization doesn't exist");
  }

  const variantsList = await db.query.variants.findMany({
    where: eq(variants.productId, productId),
  });
  return variantsList;
};
export const removeVariant = async ({
  storeslug,
  variantId,
}: {
  storeslug: string;
  variantId: string;
}) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Organization doesn't exist");
  }
  const remove = await db.delete(variants).where(eq(variants.id, variantId));
  return { success: true };
};
export const getProductDetail = async (productId: string) => {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId)),
    with: {
      variants: true,
      images: true,
      category: true,
    },
  });
  if (!product) {
    throw new Error("Product not exist");
  }
  return product;
};

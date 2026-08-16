"use server";

import { db } from "@/drizzle/db";
import {
  categories,
  order,
  orderItem,
  organization,
  productImages,
  productOptions,
  products,
  user,
  variants,
} from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { table } from "console";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  min,
  ne,
  or,
  sql,
  sum,
} from "drizzle-orm";
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
    costPrice: product.variants?.[0]?.costPrice ?? null,
    createdAt: product.createdAt,
    variants: product.variantCount ?? 0,
    price: product.variants?.map((v) => v.price) ?? [],
    sku: product.variants?.map((v) => v.sku) ?? [],
    stock: product.variants?.map((v) => v.stock) ?? [],
    image: product.images?.map((i) => i.url) ?? [],
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
  slug: string;
}
export const getProduct = async ({ storeslug, slug }: GetProductProps) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Organization doesn't exist");
  }
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.organizationId, organizationData.id),
      eq(products.slug, slug),
    ),
    with: {
      options: {
        with: {
          values: true,
        },
      },
      variants: {
        with: {
          optionValues: true,
        },
      },

      images: true,
      category: true,
    },
  });
  if (!product) {
    throw new Error("Product not exist");
  }
  const transformedOptions = product.options.map((option) => ({
    ...option,
    // Add 'value' property as array of strings for easy consumption
    value: option.values?.map((v) => v.value) || [],
    // Keep 'values' as the full objects if needed
    values: option.values || [],
  }));

  // Transform variants to include option values
  const transformedVariants = product.variants.map((variant) => ({
    ...variant,
    optionValues: variant.optionValues.filter(Boolean) || [],
  }));

  return {
    id: product.id,
    organizationId: product.organizationId,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    status: product.status,
    comparePriceAt: product.variants.map((variant) => ({
      url: variant.comparePriceAt,
    })),
    costPrice: product.variants.map((variant) => ({
      url: variant.costPrice,
    })),
    brand: product.brand,
    options: transformedOptions,
    variants: transformedVariants,
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
    with: {
      optionValues: {
        with: {
          productOptionValue: true,
        },
      },
    },
  });
  const options = await db.query.productOptions.findMany({
    where: eq(productOptions.productId, productId),
    with: {
      values: true,
    },
  });
  return { variantsList, options };
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
export const getProductDetail = async (slug: string) => {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      options: {
        with: {
          values: true,
        },
      },

      variants: {
        with: {
          optionValues: {
            with: {
              productOptionValue: true,
            },
          },
        },
      },
      images: true,
      category: true,
      organization: true,
    },
  });
  if (!product) {
    throw new Error("Product not exist");
  }

  return product;
};
export const getRelatedProducts = async (
  brand: any,
  categoryId: any,
  productId: any,
) => {
  const relatedProducts = await db.query.products.findMany({
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.brand, brand),
      ne(products.id, productId),
    ),
    with: {
      options: {
        with: {
          values: true,
        },
      },

      variants: {
        with: {
          optionValues: {
            with: {
              productOptionValue: true,
            },
          },
        },
      },
      images: true,
      category: true,
      organization: true,
    },
    limit: 5,
  });
  return relatedProducts;
};
export const getFeaturedProduct = async () => {
  // Get featured products
  const featured = await db.query.products.findMany({
    where: eq(products.featured, true),
    with: {
      category: true,
      images: true,
      variants: true,
      organization: true,
    },
  });
  const transformed = featured.map((product) => ({
    id: product.id,
    slug: product.slug,
    image: product.images[0].url,
    category: product.category?.name,
    name: product.name,
    brand: product.brand,
    stock: product.variants[0].stock,
    price: product.variants[0].price,
    comparePrice: product.variants[0].comparePriceAt,
    owner: product.organization.name,
  }));
  // Get top-selling products based on variant sales
  const topProducts = await db
    .select({
      id: products.id,
      slug: products.slug,
      image: min(productImages.url).as("image"),
      category: categories.name,
      name: products.name,
      brand: products.brand,
      price: min(variants.price).as("price"),
      stock: min(variants.stock).as("stock"),
      comparePrice: min(variants.comparePriceAt).as("comparePriceAt"),
      owner: organization.name,
      totalSold: sum(orderItem.quantity).as("totalSold"),
    })
    .from(products)
    .innerJoin(variants, eq(variants.productId, products.id)) // Connect products to variants
    .innerJoin(orderItem, eq(orderItem.variantId, variants.id)) // Connect variants to order items
    .innerJoin(order, eq(order.id, orderItem.orderId))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(organization, eq(order.organizationId, organization.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .groupBy(
      products.id,
      products.name,
      products.brand,
      categories.name,
      organization.name,
    )
    .orderBy(desc(sum(orderItem.quantity)))
    .limit(10);

  const topStores = await db
    .select({
      name: organization.name,
      totalProduct: sql<number>`COUNT(DISTINCT ${products.id})`.as(
        "totalProduct",
      ),
      totalOrders: sql<number>`COUNT(DISTINCT ${order.id})`.as("totalOrders"),
    })
    .from(organization)
    .innerJoin(products, eq(products.organizationId, organization.id))
    .innerJoin(order, eq(order.organizationId, organization.id))
    .groupBy(organization.id, organization.name)
    .orderBy(desc(sum(order.total)))
    .limit(5);
  return { topProducts, transformed, topStores };
};

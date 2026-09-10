"use server";
import { UTApi } from "uploadthing/server";
import { db } from "@/drizzle/db";
import {
  categories,
  order,
  orderItem,
  organization,
  organizationTables,
  productImages,
  productOptions,
  productOptionValues,
  productReviews,
  products,
  storeCategories,
  user,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { table } from "console";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  max,
  min,
  ne,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { headers } from "next/headers";
import { string } from "zod";

export const getCategories = async () => {
  const list = await db.query.categories.findMany({
    with: {
      storeCategories: true,
    },
  });
  return list;
};
export const removeStoreCategory = async (storeslug: string, catId: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const removeCat = await db
    .delete(storeCategories)
    .where(
      and(
        eq(storeCategories.organizationId, organizationData.id),
        eq(storeCategories.id, catId),
      ),
    );
  return { success: true };
};
export const addNewStoreCategory = async (
  storeslug: string,
  category: {
    globalCategoryId: string;
    name: string;
    icon: string;
  },
) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const newStoreCategory = await db.insert(storeCategories).values({
    organizationId: organizationData.id,
    globalCategoryId: category.globalCategoryId,
    name: category.name,
    icon: category.icon,
  });
  return { success: true };
};
export const updateStoreCategory = async (
  storeslug: string,
  editingId: string,
  category: {
    globalCategoryId: string;
    name: string;
    icon: string;
  },
) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const update = await db
    .update(storeCategories)
    .set({
      organizationId: organizationData.id,
      globalCategoryId: category.globalCategoryId,
      name: category.name,
      icon: category.icon,
    })
    .where(eq(storeCategories.id, editingId))
    .returning();
  return { success: true };
};
export const getProducts = async (
  storeslug: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  selectStatus?: string,
) => {
  let offset = (page - 1) * limit;
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  let orderByClause;
  if (sortBy === "newest") {
    orderByClause = [desc(products.createdAt), asc(products.id)];
  } else if (sortBy === "low") {
    // Sort by the cheapest variant price for each product
    orderByClause = [
      asc(
        sql`(SELECT MIN(variants.price) FROM variants WHERE variants.product_id = ${products.id})`,
      ),
      asc(products.id),
    ];
  } else if (sortBy === "high") {
    // Sort by the most expensive variant price for each product
    orderByClause = [
      desc(
        sql`(SELECT MAX(variants.price) FROM variants WHERE variants.product_id = ${products.id})`,
      ),
      asc(products.id),
    ];
  } else {
    orderByClause = [desc(products.createdAt), asc(products.id)];
  }
  const whereConditions = [];
  whereConditions.push(eq(products.organizationId, organizationData.id));

  if (selectStatus) {
    whereConditions.push(eq(products.status, selectStatus));
  }

  if (search?.trim()) {
    whereConditions.push(
      or(
        ilike(products.name, `%${search.trim()}%`),
        ilike(products.brand, `%${search.trim()}%`),
        ilike(products.status, `%${search.trim()}%`),
      ),
    );
  }
  const productsList = await db.query.products.findMany({
    where: and(...whereConditions),
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
    orderBy: orderByClause,
    offset,
  });
  const productListData = productsList.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
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
      images: true,
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
          images: true,
        },
      },
      images: true,
      category: true,
      organization: {
        with: {
          settings: true,
        },
      },
      reviews: {
        with: {
          user: true,
        },
      },
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
      organization: {
        with: {
          settings: true,
        },
      },
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
      organization: {
        with: {
          settings: true,
        },
      },
    },
  });

  const transformed = featured
    .filter((prod) => {
      const hasStock = prod.variants.some((vari) => vari.stock > 0);
      return hasStock || prod.organization.settings.showOutOfStock;
    })
    .map((product) => ({
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
      showOutOfStock: organizationTables.showOutOfStock,
      price: min(variants.price).as("price"),
      stock: max(variants.stock).as("stock"), // Changed to max to get highest stock
      comparePrice: min(variants.comparePriceAt).as("comparePriceAt"),
      owner: organization.name,
      totalSold: sum(orderItem.quantity).as("totalSold"),
    })
    .from(products)
    .innerJoin(variants, eq(variants.productId, products.id))
    .innerJoin(orderItem, eq(orderItem.variantId, variants.id))
    .innerJoin(order, eq(order.id, orderItem.orderId))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(organization, eq(products.organizationId, organization.id))
    .leftJoin(
      organizationTables,
      eq(organizationTables.organizationId, organization.id),
    )
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(
      and(
        eq(organizationTables.showOutOfStock, true),
        gt(variants.stock, 0), // Only include variants with stock > 0
      ),
    )
    .groupBy(
      products.id,
      products.slug,
      products.name,
      products.brand,
      categories.name,
      organization.name,
      organizationTables.showOutOfStock,
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
export const addNewOptionToProduct = async (productId: string, option: any) => {
  const [newOption] = await db
    .insert(productOptions)
    .values({
      productId: productId,
      name: option.name,
    })
    .returning();
  for (let value of option.value) {
    await db.insert(productOptionValues).values({
      productOptionId: newOption.id,
      value: value,
    });
  }
  return { success: true };
};
interface ReviweForm {
  productId: string;
  organizationId: string;
  orderItemId: string;
  rating: number;
  title: string;
  comment: string;
}
export const addReviewtoProduct = async (reviewForm: ReviweForm) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "You dont have account" };
  }
  const [newReview] = await db
    .insert(productReviews)
    .values({
      userId: session.user.id,
      organizationId: reviewForm.organizationId,
      productId: reviewForm.productId,
      orderItemId: reviewForm.orderItemId,
      title: reviewForm.title || "",
      rating: reviewForm.rating,
      comment: reviewForm.comment || "",
    })
    .returning();
  return { success: true };
};
const utapi = new UTApi();
export async function deleteImageFromUploadthing(url: string) {
  const utapi = new UTApi();

  try {
    // 1. Extract the file key from the end of the URL
    const fileKey = url.split("/").pop();

    if (!fileKey) {
      throw new Error("Invalid URL format");
    }

    // 2. Pass the extracted key to deleteFiles
    await utapi.deleteFiles(fileKey);

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Deletion failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

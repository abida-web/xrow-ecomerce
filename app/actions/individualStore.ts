"use server";
import { db } from "@/drizzle/db";
import slugify from "slugify";

import {
  organization,
  productImages,
  productReviews,
  products,
  storeCategories,
  storeFrontPages,
  storeFrontSections,
  variants,
} from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { and, count, desc, eq, max, min, sql } from "drizzle-orm";

export const getStoreRelatedCategories = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const list = await db.query.storeCategories.findMany({
    where: eq(storeCategories.organizationId, organizationData.id),
  });
  return list;
};
export const getStoreProductsData = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const featured = await db
    .select({
      id: products.id,
      name: products.name,
      image: max(productImages.url).as("image"),
      averageRating: sql<number>`
      COALESCE(AVG(${productReviews.rating}), 0)
    `,
      currency: organization.currency,
      reviewCount: count(productReviews.id),
      price: min(variants.price),
      comparePriceAt: min(variants.comparePriceAt),
    })
    .from(products)
    .leftJoin(variants, eq(variants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(productReviews, eq(productReviews.productId, products.id))
    .leftJoin(organization, eq(products.organizationId, organization.id))
    .where(eq(products.featured, true))
    .groupBy(
      products.id,
      products.name,
      products.description,
      organization.currency,
    )
    .orderBy(desc(sql`COALESCE(AVG(${productReviews.rating}), 0)`)); // Use expression directly
  const newArrivals = await db.query.products.findMany({
    where: and(
      eq(products.organizationId, organizationData.id),
      eq(products.featured, true),
    ),
    orderBy: desc(products.createdAt),
    limit: 10,
  });
  return { featured, newArrivals };
};
export const createPageForStore = async (
  storeslug: string,
  pageData: { type: string; name: string },
) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const existing = await db.query.storeFrontPages.findFirst({
    where: eq(storeFrontPages.name, pageData.name),
  });
  if (!existing) {
    const [newPage] = await db
      .insert(storeFrontPages)
      .values({
        organizationId: organizationData.id,
        slug: slugify(pageData.name.toLowerCase()),
        name: pageData.name,
        type: pageData.type,
      })
      .returning();
  }
  return { success: true };
};
export const creatSectionForPage = async (
  storeslug: string,
  template: any,
  pageId: string,
) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    return { error: "Organization doesn't exist" };
  }

  const navbarExist = await db.query.storeFrontSections.findFirst({
    where: and(
      eq(storeFrontSections.organizationId, organizationData.id),
      eq(storeFrontSections.type, "navbar"),
    ),
  });

  // If trying to create navbar but one already exists
  if (navbarExist && template.type === "navbar") {
    return { error: "You can not have more than one navigation bar" };
  }

  // Create the section
  const [newSection] = await db
    .insert(storeFrontSections)
    .values({
      pageId: pageId,
      name: template.name,
      organizationId: organizationData.id,
      type: template.type,
      position: template.position,
      enabled: template.enabled,
      defaultContent: template.defaultContent,
      defaultSettings: template.defaultSettings,
    })
    .returning();

  return { success: true, section: newSection };
};
export const updateSectionForPage = async (
  storeslug: string,
  template: any,
  pageId: string,
  sectionId: any,
) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    return { error: "Organization doesn't exist" };
  }

  // Create the section
  const [update] = await db
    .update(storeFrontSections)
    .set({
      pageId: pageId,
      name: template.name,
      organizationId: organizationData.id,
      type: template.type,
      position: template.position,
      enabled: template.enabled,
      defaultContent: template.defaultContent,
      defaultSettings: template.defaultSettings,
    })
    .where(eq(storeFrontSections.id, sectionId))
    .returning();

  return { success: true, section: update };
};
export const getStoreRelatedPages = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const list = await db.query.storeFrontPages.findMany({
    where: eq(storeFrontPages.organizationId, organizationData.id),
    with: {
      sections: true,
    },
  });
  return list;
};
export const getNavbarForstore = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const navbar = await db.query.storeFrontSections.findFirst({
    where: and(
      eq(storeFrontSections.organizationId, organizationData.id),
      eq(storeFrontSections.type, "navbar"),
    ),
  });
  return navbar;
};
export const getHomePageForstore = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const homePage = await db.query.storeFrontPages.findFirst({
    where: and(
      eq(storeFrontPages.organizationId, organizationData.id),
      eq(storeFrontPages.type, "home"),
    ),
    with: {
      sections: true,
    },
  });
  return homePage;
};
export const getRecentReviewsForTestimonials = async (storeslug: string) => {
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    throw new Error("Oranization doesn't exists");
  }
  const reviews = await db.query.productReviews.findMany({
    where: eq(productReviews.organizationId, organizationData.id),
    with: {
      user: true,
    },
    orderBy: desc(productReviews.createdAt),
    limit: 4,
  });
  return reviews;
};

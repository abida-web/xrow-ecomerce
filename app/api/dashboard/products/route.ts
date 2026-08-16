import { db } from "@/drizzle/db";
import slugify from "slugify";
import {
  organization,
  productImages,
  productOptions,
  productOptionValues,
  products,
  variantImages,
  variantOptionValues,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const { productForm, storeslug } = body;
  const { variants: productVariants, images, options } = productForm;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const organizationOwner = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  if (!organizationOwner) {
    return NextResponse.json(
      { error: "Organization doesnt exist" },
      { status: 404 },
    );
  }

  const [newProduct] = await db
    .insert(products)
    .values({
      organizationId: organizationOwner?.id,
      categoryId: productForm.categoryId,
      name: productForm.name,
      description: productForm.description || null,
      slug: slugify(productForm.name),
      status: productForm.status || null,
      featured: productForm.featured || false,
      brand: productForm.brand || null,
    })
    .returning();

  // 1. Insert productImages first (depends only on products)
  if (images && Array.isArray(images) && images.length > 0) {
    const imageValues = images.map((image: any, index: number) => ({
      productId: newProduct.id,
      url: image.url,
      isPrimary: index === 0,
    }));
    await db.insert(productImages).values(imageValues);
  }
  const valueAndIdsMap = new Map();
  // 2. Insert productOptions and their values (depends only on products)
  if (options && Array.isArray(options) && options.length > 0) {
    for (let opt of options) {
      const [newOption] = await db
        .insert(productOptions)
        .values({
          productId: newProduct.id,
          name: opt.name,
        })
        .returning();
      if (opt.value && Array.isArray(opt.value) && opt.value.length > 0) {
        const values = opt.value.map((val: any) => ({
          productOptionId: newOption.id,
          value: val,
        }));

        const optionValues = await db
          .insert(productOptionValues)
          .values(values)
          .returning();
        for (let value of optionValues) {
          valueAndIdsMap.set(value.value, value.id);
        }
      }
    }
  }

  // 3. Insert variants last (depends on products, and may reference options)
  if (
    productVariants &&
    Array.isArray(productVariants) &&
    productVariants.length > 0
  ) {
    for (const variant of productVariants) {
      const [newVariant] = await db
        .insert(variants)
        .values({
          productId: newProduct.id,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          comparePriceAt: variant.comparePriceAt || null,
          costPrice: variant.costPrice || null,
        })
        .returning();
      if (
        variant.optionValues &&
        Array.isArray(variant.optionValues) &&
        variant.optionValues.length > 0
      ) {
        for (let value of variant.optionValues) {
          const valueId = valueAndIdsMap.get(value);
          if (valueId) {
            await db.insert(variantOptionValues).values({
              variantId: newVariant.id,
              productOptionValueId: valueId,
            });
          }
        }
      }

      if (variant.variantImages && variant.variantImages.length > 0) {
        await db.insert(variantImages).values(
          variant.variantImages.map((image: any, index: number) => ({
            variantId: newVariant.id,
            url: image.url,
            isPrimary: index === 0,
          })),
        );
      }
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: "Product created successfully",
      product: newProduct,
      variantsCount: productVariants?.length || 0,
      imagesCount: images?.length || 0,
    },
    { status: 201 },
  );
}

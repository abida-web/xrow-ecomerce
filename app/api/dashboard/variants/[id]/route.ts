import { db } from "@/drizzle/db";
import {
  productOptions,
  productOptionValues,
  variantImages,
  variantOptionValues,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json();
  const { id } = await params;
  const { currentVariant: variant, storeslug, productId } = body;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }

  const oraganizationOwner = await getOrganizationBySlug(storeslug);
  if (!oraganizationOwner) {
    return NextResponse.json(
      { error: "Organization doesnt exist" },
      { status: 404 },
    );
  }

  // Update variant
  const [updatedVariant] = await db
    .update(variants)
    .set({
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      costPrice: variant.costPrice,
      comparePriceAt: variant.comparePriceAt,
    })
    .where(eq(variants.id, id))
    .returning();

  // Delete old option values
  await db
    .delete(variantOptionValues)
    .where(eq(variantOptionValues.variantId, id));

  // Get options
  const options = await db.query.productOptions.findMany({
    where: eq(productOptions.productId, productId),
  });

  // Insert option values
  if (options && variant.optionValues && Array.isArray(variant.optionValues)) {
    const optionValuesMap = new Map();

    for (const option of options) {
      const optionValues = await db.query.productOptionValues.findMany({
        where: eq(productOptionValues.productOptionId, option.id),
      });
      for (const value of optionValues) {
        optionValuesMap.set(value.value, value.id);
      }
    }

    for (let selectedValue of variant.optionValues) {
      let valueId = optionValuesMap.get(selectedValue);
      if (valueId) {
        await db.insert(variantOptionValues).values({
          variantId: updatedVariant.id,
          productOptionValueId: valueId,
        });
      }
    }
  }
  console.log(variant.variantImages);

  // Delete old variant images
  await db
    .delete(variantImages)
    .where(eq(variantImages.variantId, updatedVariant.id));

  // Insert new variant images
  if (variant.variantImages && variant.variantImages.length > 0) {
    const imageValues = variant.variantImages.map(
      (image: any, index: number) => ({
        variantId: updatedVariant.id,
        url: image.url,
        isPrimary:
          image.isPrimary !== undefined ? image.isPrimary : index === 0,
        key: image.filekey || image.key || image.fileKey || null,
      }),
    );

    await db.insert(variantImages).values(imageValues);
  }

  return NextResponse.json(
    {
      success: true,
      message: "Variant updated successfully",
    },
    { status: 200 },
  );
}

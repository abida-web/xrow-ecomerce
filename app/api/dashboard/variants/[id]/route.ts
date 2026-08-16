import { db } from "@/drizzle/db";
import {
  productOptions,
  productOptionValues,
  variantOptionValues,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { organization } from "better-auth/client";
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
  await db
    .delete(variantOptionValues)
    .where(eq(variantOptionValues.variantId, id));

  const options = await db.query.productOptions.findMany({
    where: eq(productOptions.productId, productId),
  });
  if (!options) {
    return NextResponse.json({ error: "Option not found" }, { status: 404 });
  }

  const optionValuesMap = new Map();
  for (const option of options) {
    const optionValues = await db.query.productOptionValues.findMany({
      where: eq(productOptionValues.productOptionId, option.id),
    });
    for (const value of optionValues) {
      optionValuesMap.set(value.value, value.id);
    }
  }

  // Should iterate over selected option values from the variant
  if (variant.optionValues && Array.isArray(variant.optionValues)) {
    for (let selectedValue of variant.optionValues) {
      let valueId = optionValuesMap.get(selectedValue); // selectedValue is the string value
      if (valueId) {
        await db.insert(variantOptionValues).values({
          variantId: updatedVariant.id,
          productOptionValueId: valueId,
        });
      }
    }
  }
  return NextResponse.json(
    {
      success: true,
      message: "Variant updated successfully",
    },
    { status: 200 },
  );
}

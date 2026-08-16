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

export async function POST(req: Request) {
  const body = await req.json();
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

  const [newVariant] = await db
    .insert(variants)
    .values({
      productId: productId,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      costPrice: variant.costPrice,
      comparePriceAt: variant.comparePriceAt,
    })
    .returning();
  if (newVariant) {
    console.log("New variant created");
  }
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
  if (variant.optionValues && Array.isArray(variant.optionValues)) {
    for (let value of variant.optionValues) {
      let valueId = optionValuesMap.get(value);
      if (valueId) {
        const variantOptionValueCreate = await db
          .insert(variantOptionValues)
          .values({
            variantId: newVariant.id,
            productOptionValueId: valueId,
          })
          .returning();
        if (variantOptionValueCreate) {
          console.log("New variantOption created");
        }
      }
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: "Variant created successfully",
    },
    { status: 201 },
  );
}

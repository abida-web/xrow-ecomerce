import { db } from "@/drizzle/db";
import {
  organization,
  productImages,
  products,
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
  const { variants: productVariants, images } = productForm;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const oraganizationOwner = await db.query.organization.findFirst({
    where: eq(organization.slug, storeslug),
  });
  if (!oraganizationOwner) {
    return NextResponse.json(
      { error: "Organization doesnt exist" },
      { status: 404 },
    );
  }
  const [newProduct] = await db
    .insert(products)
    .values({
      organizationId: oraganizationOwner?.id,
      categoryId: productForm.categoryId,
      name: productForm.name,
      description: productForm.description || null,
      status: productForm.status || null,
      comparePriceAt: productForm.comparePriceAt || null,
      costPrice: productForm.costPrice || null,
      brand: productForm.brand || null,
      weight: productForm.weight || null,
      weightUnit: productForm.weightUnit || null,
    })
    .returning();
  if (
    productVariants &&
    Array.isArray(productVariants) &&
    productVariants.length > 0
  ) {
    const variantValues = productVariants.map((variant: any) => ({
      productId: newProduct.id,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      option1: variant.option1 || null,
      option1Value: variant.option1Value || null,
      option2: variant.option2 || null,
      option2Value: variant.option2Value || null,
      option3: variant.option3 || null,
      option3Value: variant.option3Value || null,
    }));
    await db.insert(variants).values(variantValues);
  }
  if (images && Array.isArray(images) && images.length > 0) {
    const imageValues = images.map((image: any, index: number) => ({
      productId: newProduct.id,
      url: image.url,
      isPrimary: index === 0, // First image is primary
    }));
    await db.insert(productImages).values(imageValues);
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

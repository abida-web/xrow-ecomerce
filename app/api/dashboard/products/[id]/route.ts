// app/api/dashboard/products/[id]/route.ts
import { db } from "@/drizzle/db";
import {
  organization,
  productImages,
  products,
  variants,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;
    const body = await req.json();
    const { productForm, storeslug } = body;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationOwner = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });

    if (!organizationOwner) {
      return NextResponse.json(
        { error: "Organization doesn't exist" },
        { status: 404 },
      );
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
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
      .where(
        and(
          eq(products.id, productId),
          eq(products.organizationId, organizationOwner.id),
        ),
      )
      .returning();

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const finalProduct = await db.query.products.findFirst({
      where: eq(products.id, updatedProduct.id),
      with: {
        variants: true,
        images: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: finalProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

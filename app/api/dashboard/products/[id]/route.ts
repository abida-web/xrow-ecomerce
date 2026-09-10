// app/api/dashboard/products/[id]/route.ts
import { db } from "@/drizzle/db";
import {
  organization,
  productImages,
  productOptions,
  productOptionValues,
  products,
} from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;
    const body = await req.json();
    const { productForm, storeslug } = body;
    const { images } = productForm;
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
        slug: slugify(productForm.name),
        description: productForm.description || null,
        status: productForm.status || null,
        featured: productForm.featured || false,
        brand: productForm.brand || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, productId),
          eq(products.organizationId, organizationOwner.id),
        ),
      )
      .returning();
    await db
      .delete(productImages)
      .where(eq(productImages.productId, productId));

    // Then insert new images
    if (images && Array.isArray(images) && images.length > 0) {
      const imageValues = images.map((image: any, index: number) => ({
        productId: productId,
        url: image.url,
        isPrimary: index === 0,
        key: image.filekey || image.key || image.fileKey || null,
      }));

      await db.insert(productImages).values(imageValues);
    }
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

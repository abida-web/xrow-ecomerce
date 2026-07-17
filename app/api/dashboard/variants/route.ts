import { db } from "@/drizzle/db";
import { variants } from "@/drizzle/schema";
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

  await db.insert(variants).values({
    productId: productId,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,
    option1: variant.option1 || null,
    option1Value: variant.option1Value || null,
    option2: variant.option2 || null,
    option2Value: variant.option2Value || null,
    option3: variant.option3 || null,
    option3Value: variant.option3Value || null,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Variant created successfully",
    },
    { status: 201 },
  );
}

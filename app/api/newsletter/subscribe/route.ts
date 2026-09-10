import { db } from "@/drizzle/db";
import { newsLetterSubscribers } from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { storeslug, email } = await req.json();
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    return NextResponse.json(
      { error: "Oranization doesn't exists" },
      { status: 404 },
    );
  }
  const existing = await db.query.newsLetterSubscribers.findFirst({
    where: eq(newsLetterSubscribers.email, email),
  });
  if (!existing) {
    const [newNewsLetter] = await db
      .insert(newsLetterSubscribers)
      .values({
        organizationId: organizationData.id,
        email: email,
        status: "pending",
      })
      .returning();
  }
  return NextResponse.json({ success: true }, { status: 200 });
}

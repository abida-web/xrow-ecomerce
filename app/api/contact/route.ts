import { db } from "@/drizzle/db";
import {
  contactMessages,
  newsLetterSubscribers,
  notification,
} from "@/drizzle/schema";
import { getOrganizationBySlug } from "@/lib/organization-check";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { storeslug, formData } = await req.json();
  const organizationData = await getOrganizationBySlug(storeslug);
  if (!organizationData) {
    return NextResponse.json(
      { error: "Oranization doesn't exists" },
      { status: 404 },
    );
  }

  const [newContact] = await db
    .insert(contactMessages)
    .values({
      organizationId: organizationData.id,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      status: "pending",
    })
    .returning();
  await db.insert(notification).values({
    shopId: organizationData.id,
    type: "CONTACT_MESSAGE",
    title: "New Contact Message",
    message: `New message from ${formData.name} (${formData.email})`,
    entityType: "CONTACT",
    entityId: String(newContact.id),
    isRead: false,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

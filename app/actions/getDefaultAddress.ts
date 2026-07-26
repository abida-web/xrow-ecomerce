import { db } from "@/drizzle/db";
import { address } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const getDefaultAddress = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const adressesList = await db.query.address.findMany({
    where: eq(address.userId, session.user.id),
  });
  return adressesList;
};

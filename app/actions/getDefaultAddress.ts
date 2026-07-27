"use server";
import { db } from "@/drizzle/db";
import { address } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const getDefaultAddress = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("unauthorized");
  }
  const adressesList = await db.query.address.findFirst({
    where: and(
      eq(address.userId, session.user.id),
      eq(address.isDefault, true),
    ),
  });
  return adressesList;
};

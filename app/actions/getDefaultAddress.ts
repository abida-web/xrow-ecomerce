"use server";
import { db } from "@/drizzle/db";
import { address } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function getDefaultAddress() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return null; // Return null instead of undefined
    }

    const defaultAddress = await db.query.address.findFirst({
      where: and(
        eq(address.userId, session.user.id),
        eq(address.isDefault, true),
      ),
    });

    return defaultAddress;
  } catch (error) {
    console.error("Error fetching default address:", error);
    return null; // Return null on error
  }
}

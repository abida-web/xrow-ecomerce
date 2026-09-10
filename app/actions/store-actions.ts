"use server";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getOwnnedOrganizations = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;
  const usersData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    with: {
      members: {
        with: {
          organization: true,
        },
      },
    },
  });
  return usersData;
};

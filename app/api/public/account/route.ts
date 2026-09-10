import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session?.user.id),
    with: {
      addresses: true,
      orders: {
        with: {
          items: {
            with: {
              variant: {
                with: {
                  product: {
                    columns: {
                      id: true,
                      name: true,
                    },
                    with: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
          organization: true,
        },
      },
      accounts: true,
    },
  });
  return NextResponse.json(userData);
}

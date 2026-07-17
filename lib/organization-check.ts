import { db } from "@/drizzle/db";
import { organization } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getOrganizationBySlug(
  storeslug: string,
): Promise<typeof organization.$inferSelect | null> {
  try {
    const organizationData = await db.query.organization.findFirst({
      where: eq(organization.slug, storeslug),
    });
    if (!organizationData) {
      throw new Error("Oranization doesn't exists");
    }
    return organizationData ?? null;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return null;
  }
}

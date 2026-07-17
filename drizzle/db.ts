import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";
// Merge schema and relations into a single object
const fullSchema = {
  ...schema,
  ...relations,
};

export const db = drizzle(process.env.DATABASE_URL!, { schema: fullSchema });

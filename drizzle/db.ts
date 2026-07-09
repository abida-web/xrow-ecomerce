import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

// Merge schema and relations into a single object
const fullSchema = {
  ...schema,
};

export const db = drizzle(process.env.DATABASE_URL!, { schema: fullSchema });

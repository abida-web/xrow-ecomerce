import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/drizzle/schema";
import { organization } from "better-auth/plugins/organization";
export const auth = betterAuth({
  appName: "Xrow",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days total session lifespan
    updateAge: 60 * 60 * 24 * 1, // Extend session if user is active after 1 day
  },
  // 2. Your existing cookie cache configuration
  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days local browser cache lifetime
    },
  },
  plugins: [organization()],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
});

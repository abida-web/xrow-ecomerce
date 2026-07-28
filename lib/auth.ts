import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/drizzle/schema";
import { organization } from "better-auth/plugins/organization";
import { sendEmailVerificationEmail } from "./emails/email-verification";
import { sendPasswordReset } from "./emails/sendPassword-reset";
export const auth = betterAuth({
  appName: "Xrow",

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordReset({ user, url });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 1, // 1 day
  },

  sessions: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  plugins: [organization()],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
});

import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/drizzle/schema";
import { organization } from "better-auth/plugins/organization";
import { sendEmailVerificationEmail } from "./emails/email-verification";
import { sendPasswordReset } from "./emails/sendPassword-reset";
import { sendOrganizationInviteEmail } from "./emails/organization-invite-email";
import { owner, ac, admin, member, driver, staff } from "./permission";
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

  plugins: [
    organization({
      schema: {
        organization: {
          modelName: "organization",
          additionalFields: {
            description: {
              type: "string",
              input: true,
              required: false,
            },

            email: {
              type: "string",
              input: true,
              required: false,
              format: "email",
            },
            phone: {
              type: "string",
              input: true,
              required: false,
              format: "phone",
            },
            country: {
              type: "string",
              input: true,
              required: false,
            },
            city: {
              type: "string",
              input: true,
              required: false,
            },
            address: {
              type: "string",
              input: true,
              required: false,
              multiline: true,
            },
            currency: {
              type: "string",
              input: true,
              required: false,
            },
            timezone: {
              type: "string",
              input: true,
              required: false,
            },
            language: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
      },
      ac,
      roles: {
        owner,
        admin,
        member,
        driver,
        staff,
      },
      allowUserToCreateOrganization: true,
      dynamicAccessControl: {
        enabled: true,
      },

      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        });
      },
    }),
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});

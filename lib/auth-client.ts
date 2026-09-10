import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { inferOrgAdditionalFields } from "better-auth/client/plugins";
import { owner, ac, admin, member, driver, staff } from "./permission";
import { auth } from "./auth";
export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      ac,
      roles: {
        owner,
        admin,
        member,
        driver,
        staff,
      },
    }),
  ],
});

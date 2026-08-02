import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { owner, ac, admin, member, driver, staff } from "./permission";
export const authClient = createAuthClient({
  plugins: [
    organizationClient({
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

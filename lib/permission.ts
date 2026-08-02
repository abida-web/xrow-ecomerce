import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

// Define all statements - include ALL default statements
const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// Define roles with proper permissions
export const member = ac.newRole({
  project: ["create"],
});

export const admin = ac.newRole({
  // Organization permissions
  organization: ["update"],
  // Member permissions (users in the organization)
  member: ["create", "update", "delete"],
  // Invitation permissions (inviting users)
  invitation: ["create", "cancel"],
  // Custom project permissions
  project: ["create", "update"],
});

export const owner = ac.newRole({
  // Organization permissions
  organization: ["update", "delete"],
  // Member permissions (users in the organization)
  member: ["create", "update", "delete"],
  // Invitation permissions (inviting users)
  invitation: ["create", "cancel"],
  // Custom project permissions
  project: ["create", "update", "delete", "share"],
});

export const driver = ac.newRole({
  // Driver only has project permissions
  project: ["create", "update", "delete"],
});
export const staff = ac.newRole({
  // Driver only has project permissions
  organization: ["update"],
  project: ["update"],
});

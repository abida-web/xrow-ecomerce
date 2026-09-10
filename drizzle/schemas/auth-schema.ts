import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  integer,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";
import { address, cart, order } from "./cart-schema";
import {
  notification,
  productReviews,
  storeCategories,
} from "./product-schema";
import { storeFrontPages } from "./store-sections";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = pgTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
    language: text("language").default("en"),
    email: text("email").default("info@example.com"), // Example email
    phone: text("phone").default("+93 700 123 456"), // Afghanistan phone format
    country: text("country").default("Afghanistan"), // Default country
    city: text("city").default("Kabul"), // Capital city default
    address: text("address").default("Shahr-e-Naw, District 2"), // Example address
    currency: text("currency").default("AFN"), // Afghanistan Afghani default
    timezone: text("timezone").default("UTC+04:30"), // Afghanistan tim
  },
  (table) => [
    uniqueIndex("organization_slug_uidx").on(table.slug),
    // Optional: Add index for email if you plan to search by it
    index("organization_email_idx").on(table.email),
  ],
);
export const organizationRole = pgTable(
  "organization_role",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    permission: text("permission").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(
      () => /* @__PURE__ */ new Date(),
    ),
  },
  (table) => [
    index("organizationRole_organizationId_idx").on(table.organizationId),
    index("organizationRole_role_idx").on(table.role),
  ],
);
export const organizationTables = pgTable("organization_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  // Store Settings
  storeStatus: text("store_status").default("active"), // active, inactive, maintenance
  storeVisibility: boolean("store_visibility").default(true),
  guestCheckout: boolean("guest_checkout").default(true),
  showOutOfStock: boolean("show_out_of_stock").default(false),
  allReviews: boolean("all_reviews").default(true),

  // Product Settings
  productPerPage: integer("product_per_page").default(20),
  productSort: text("product_sort").default("newest"), // newest, price_asc, price_desc, popularity

  // Order Settings
  autoCancelUnpaidOrder: boolean("auto_cancel_unpaid_order").default(false),
  cancelMin: integer("cancel_min").default(30), // minutes

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const shippingMethods = pgTable("shipping_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const shippingZones = pgTable("shipping_zones", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),

  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const shippingRates = pgTable("shipping_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  shippingMethodId: uuid("shipping_method_id")
    .notNull()
    .references(() => shippingMethods.id, { onDelete: "cascade" }),
  shippingZoneId: uuid("shipping_zone_id")
    .notNull()
    .references(() => shippingZones.id, { onDelete: "cascade" }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);
export const newsLetterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const contactMessages = pgTable("contactMessages", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
  orders: many(order, { relationName: "userOrders" }), // Added relationName
  driverOrders: many(order, { relationName: "driverOrders" }), // New relation for driver
  addresses: many(address),
  reviews: many(productReviews),
}));

export const sessionRelations = relations(session, ({ one, many }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(
  organization,
  ({ many, one }) => ({
    organizationRoles: many(organizationRole),
    members: many(member),
    invitations: many(invitation),
    newsLetters: many(newsLetterSubscribers),
    settings: one(organizationTables, {
      // 👈 Add this
      fields: [organization.id],
      references: [organizationTables.organizationId],
    }),
    shippingMethods: many(shippingMethods), // Add this
    shippingZones: many(shippingZones),
    storeCategories: many(storeCategories),
    storeFrontPages: many(storeFrontPages),
    notifications: many(notification),
  }),
);

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

export const organizationRoleRelations = relations(
  organizationRole,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationRole.organizationId],
      references: [organization.id],
    }),
  }),
);
export const newsLetterSubscribersRelations = relations(
  newsLetterSubscribers,
  ({ one }) => ({
    organization: one(organization, {
      fields: [newsLetterSubscribers.organizationId],
      references: [organization.id],
    }),
  }),
);

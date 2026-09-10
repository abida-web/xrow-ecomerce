// schema/pages-schema.ts
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  index,
  json, // ✅ Added
} from "drizzle-orm/pg-core";
import { organization } from "./auth-schema";
export const storeFrontPages = pgTable("store_front_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").references(() => organization.id),
  type: text("type"),
  name: text("name").notNull(),
  slug: text("slug"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const storeFrontSections = pgTable("store_front_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id").references(() => storeFrontPages.id),
  name: text("name"),
  type: text("type"),
  organizationId: text("organization_id").references(() => organization.id),

  position: integer("position"),
  enabled: boolean("enabled"),
  defaultSettings: jsonb("default_settings").$default(() => ({})),
  defaultContent: jsonb("default_content").$default(() => ({})),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  integer,
  pgEnum,
  index,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { organization } from "./auth-schema";

const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    featured: boolean("featured").default(false),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: text("status").default("draft"),
    brand: text("brand"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // CRITICAL: All product queries filter by organization
    orgIdx: index("products_org_idx").on(table.organizationId),

    // Composite index for active products in an organization
    orgStatusIdx: index("products_org_status_idx").on(
      table.organizationId,
      table.status,
    ),
  }),
);
const productOptions = pgTable(
  "product_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueOption: unique("product_options_unique").on(
      table.productId,
      table.name,
    ),
  }),
);
const productOptionValues = pgTable(
  "product_option_values",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productOptionId: uuid("product_option_id")
      .notNull()
      .references(() => productOptions.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueOptionValue: unique("product_option_values_unique").on(
      table.productOptionId,
      table.value,
    ),
  }),
);
const variants = pgTable("variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: numeric("cost_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  comparePriceAt: numeric("compare_price_at", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
const variantOptionValues = pgTable(
  "variant_option_values",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),
    productOptionValueId: uuid("product_option_value_id")
      .notNull()
      .references(() => productOptionValues.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueVariantOption: unique("variant_option_values_unique").on(
      table.variantId,
      table.productOptionValueId,
    ),
  }),
);
const variantImages = pgTable("variant_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export {
  categories,
  products,
  variants,
  variantImages,
  variantOptionValues,
  productImages,
  productOptions,
  productOptionValues,
};

export const notification = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopId: text("shop_id").references(() => organization.id),
  type: text("type"),
  title: text("title"),
  message: text("message"),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

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
} from "drizzle-orm/pg-core";
import { organization } from "./auth-schema";

const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
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
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").default("draft"),
    comparePriceAt: numeric("compare_price_at", { precision: 10, scale: 2 }),
    costPrice: numeric("cost_price", { precision: 10, scale: 2 }),
    brand: text("brand"),
    weightUnit: text("weight_unit").default("kg"),
    weight: numeric("weight", { precision: 8, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow(),
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

const variants = pgTable("variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  option1: text("option1"),
  option1Value: text("option1_value"),
  option2: text("option2"),
  option2Value: text("option2_value"),
  option3: text("option3"),
  option3Value: text("option3_value"),
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

export { categories, products, variants, productImages };

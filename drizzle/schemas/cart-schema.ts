import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";
import { products, variants } from "./product-schema";

export const cart = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItem = pgTable("cart_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").references(() => cart.id, { onDelete: "cascade" }),

  variantId: uuid("variant_id").references(() => variants.id, {
    onDelete: "cascade",
  }),
  quantity: numeric("quantity").default("1"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const order = pgTable("order", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  status: text("status"),
  subtotal: numeric("subtotal"),
  total: numeric("total"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const orderItem = pgTable("order_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => order.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  quantity: numeric("quantity"),
  priceAtPurchase: numeric("price_at_purchase"),
  createdAt: timestamp("created_at").defaultNow(),
});

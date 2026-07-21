import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
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

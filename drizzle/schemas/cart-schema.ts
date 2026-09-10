import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  organization,
  shippingMethods,
  shippingRates,
  user,
} from "./auth-schema";
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
  driverId: text("driver_id").references(() => user.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  status: text("status"),
  subtotal: numeric("subtotal"),
  total: numeric("total"),
  shippingMethodId: uuid("shipping_method_id").references(
    () => shippingMethods.id,
    { onDelete: "set null" },
  ),
  shippingRateId: uuid("shipping_rate_id").references(() => shippingRates.id, {
    onDelete: "set null",
  }),
  shippingMethodName: text("shipping_method_name"),
  shippingRateName: text("shipping_rate_name"),
  shippingFullName: text("shipping_full_name"),
  shippingPhone: text("shipping_phone"),
  shippingEmail: text("shipping_email"),
  shippingCountry: text("shipping_country"),
  shippingProvince: text("shipping_province"),
  shippingCity: text("shipping_city"),
  shippingStreetAddress: text("shipping_street_address"),
  shippingPostalCode: text("shipping_postal_code"),
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
// Shared address fields
const addressFields = {
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(), // Changed to text
  email: text("email"),
  country: text("country").default("US"),
  province: text("province"),
  city: text("city"),
  streetAddress: text("street_address"),
  postalCode: text("postal_code"),
};

export const address = pgTable("address", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => order.id, { onDelete: "cascade" }),

  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  ...addressFields,
  isDefault: boolean("is_default").default(false),
  addressType: text("address_type").default("shipping"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

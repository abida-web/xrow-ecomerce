// db/relations.ts

import { relations } from "drizzle-orm";
import {
  categories,
  organization,
  productImages,
  products,
  user,
  variants,
} from "./schema";
import {
  address,
  cart,
  cartItem,
  order,
  orderItem,
} from "./schemas/cart-schema";
import {
  member,
  invitation,
  organizationRole,
  session,
  account,
} from "./schemas/auth-schema";

// ============ CATEGORY RELATIONS ============
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// ============ PRODUCT RELATIONS ============
export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organization, {
    fields: [products.organizationId],
    references: [organization.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
  images: many(productImages),
}));

// ============ VARIANT RELATIONS ============
export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

// ============ PRODUCT IMAGE RELATIONS ============
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// ============ CART RELATIONS ============
export const cartsRelations = relations(cart, ({ one, many }) => ({
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
  items: many(cartItem),
}));

// ============ CART ITEM RELATIONS ============
export const cartItemsRelations = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.id],
  }),
  variant: one(variants, {
    fields: [cartItem.variantId],
    references: [variants.id],
  }),
}));

// ============ ORDER RELATIONS ============
export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
    relationName: "userOrders",
  }),
  organization: one(organization, {
    fields: [order.organizationId],
    references: [organization.id],
  }),
  driver: one(user, {
    fields: [order.driverId],
    references: [user.id],
    relationName: "driverOrders",
  }),
  items: many(orderItem),
  address: one(address, {
    fields: [order.id],
    references: [address.orderId],
  }),
}));

// ============ ORDER ITEM RELATIONS ============
export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  variant: one(variants, {
    fields: [orderItem.variantId],
    references: [variants.id],
  }),
}));

// ============ ADDRESS RELATIONS ============
export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
  order: one(order, {
    fields: [address.orderId],
    references: [order.id],
  }),
}));

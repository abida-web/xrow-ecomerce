// db/relations.ts

import { relations } from "drizzle-orm";
import {
  categories,
  organization,
  productImages,
  products,
  user,
  variants,
  productOptions,
  productOptionValues,
  cartItem,
  cart,
  orderItem,
  order,
  address,
  variantImages,
  variantOptionValues,
  notification,
} from "./schema";

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
  options: many(productOptions),
}));

// ============ PRODUCT OPTIONS RELATIONS ============
export const productOptionsRelations = relations(
  productOptions,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productOptions.productId],
      references: [products.id],
    }),
    values: many(productOptionValues),
  }),
);

// ============ PRODUCT OPTION VALUES RELATIONS ============
export const productOptionValuesRelations = relations(
  productOptionValues,
  ({ one, many }) => ({
    productOption: one(productOptions, {
      fields: [productOptionValues.productOptionId],
      references: [productOptions.id],
    }),
    variants: many(variantOptionValues),
  }),
);

// ============ VARIANT RELATIONS ============
export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  images: many(variantImages),
  optionValues: many(variantOptionValues),
  cartItems: many(cartItem),
  orderItems: many(orderItem),
}));

// ============ VARIANT IMAGES RELATIONS ============
export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  variant: one(variants, {
    fields: [variantImages.variantId],
    references: [variants.id],
  }),
}));

// ============ VARIANT OPTION VALUES RELATIONS ============
export const variantOptionValuesRelations = relations(
  variantOptionValues,
  ({ one }) => ({
    variant: one(variants, {
      fields: [variantOptionValues.variantId],
      references: [variants.id],
    }),
    productOptionValue: one(productOptionValues, {
      fields: [variantOptionValues.productOptionValueId],
      references: [productOptionValues.id],
    }),
  }),
);

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
export const notificationRelations = relations(notification, ({ one }) => ({
  organization: one(organization, {
    fields: [notification.shopId],
    references: [organization.id],
  }),
}));
// Export all relations
export const allRelations = {
  categoriesRelations,
  productsRelations,
  productOptionsRelations,
  productOptionValuesRelations,
  variantsRelations,
  variantImagesRelations,
  variantOptionValuesRelations,
  productImagesRelations,
  cartsRelations,
  cartItemsRelations,
  orderRelations,
  orderItemRelations,
  addressRelations,
};

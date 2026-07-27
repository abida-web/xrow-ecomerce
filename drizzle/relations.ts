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

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

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

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
export const cartsRelations = relations(cart, ({ one, many }) => ({
  user: one(organization, {
    fields: [cart.userId],
    references: [organization.id],
  }),
  items: many(cartItem),
}));

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

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [order.organizationId],
    references: [organization.id],
  }),
  items: many(orderItem),
  address: one(address, {
    fields: [order.id],
    references: [address.orderId],
  }),
}));

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
export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}));

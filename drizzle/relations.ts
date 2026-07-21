import { relations } from "drizzle-orm";
import {
  categories,
  organization,
  productImages,
  products,
  variants,
} from "./schema";
import { cart, cartItem } from "./schemas/cart-schema";

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

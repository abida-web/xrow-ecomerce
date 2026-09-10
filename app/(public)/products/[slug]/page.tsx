"use client";

import {
  getProductDetail,
  getRelatedProducts,
} from "@/app/actions/product-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuantityStore } from "@/store/cart-store";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../_components/ProductCard";
import { Star } from "lucide-react";

interface ImageProps {
  id: string;
  url: string;
  isPrimary: boolean | null;
}

interface CartItem {
  variantId: string;
  quantity: number;
}

interface VariantOptionValue {
  productOptionValueId: string;
  productOptionValue: {
    productOptionId: string;
    value: string;
  };
}

interface Variant {
  id: string;
  price: number;
  stock: number;
  optionValues: VariantOptionValue[];
}

interface ProductOption {
  id: string;
  name: string;
  values: {
    id: string;
    value: string;
  }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const { quantity, setQuantity, reset } = useQuantityStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductDetail(slug),
  });
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: [
      "relatedProducts",
      product?.brand,
      product?.categoryId,
      product?.id,
    ],
    queryFn: () =>
      getRelatedProducts(product?.brand, product?.categoryId, product?.id),
    enabled: Boolean(product?.id),
  });
  const { data: cartItems, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart/items", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  // Reset selected options when product changes
  useEffect(() => {
    if (product?.options) {
      const initialOptions: Record<string, string> = {};
      product.options.forEach((opt: ProductOption) => {
        if (opt.values.length === 1) {
          initialOptions[opt.id] = opt.values[0].id;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  const primaryImage = product?.images?.find(
    (img: ImageProps) => img.isPrimary,
  );
  const currentImage = selectedImage || primaryImage;

  // Find matching variant based on selected options
  const currentVariant = product?.variants?.find((variant: any) =>
    variant.optionValues.every(
      (vo: VariantOptionValue) =>
        selectedOptions[vo.productOptionValue.productOptionId] ===
        vo.productOptionValueId,
    ),
  );

  const variant = currentVariant || product?.variants?.[0];

  // Check if all required options are selected
  const allOptionsSelected =
    product?.options?.every((opt: ProductOption) => selectedOptions[opt.id]) ??
    false;

  // Check if the selected options combination exists in stock
  const isOptionCombinationInStock =
    product?.variants.some((vari: any) =>
      vari.optionValues.every(
        (opt: any) =>
          selectedOptions[opt.productOptionValue.productOptionId] ===
          opt.productOptionValueId,
      ),
    ) ?? false;

  const hasStock = variant?.stock && variant.stock > 0;
  const isAvailable = isOptionCombinationInStock && hasStock;

  const existingItem = cartItems?.userCartItems?.find(
    (item: CartItem) => item.variantId === variant?.id,
  );

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      // Check availability before API call
      if (product?.options?.length && !allOptionsSelected) {
        throw new Error("Please select all product options");
      }

      if (!variant) {
        throw new Error("No variant available");
      }

      if (!isAvailable) {
        throw new Error("This combination is not available");
      }

      if (quantity < 1 || quantity > variant.stock) {
        throw new Error(`Quantity must be between 1 and ${variant.stock}`);
      }

      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          variantId: variant.id,
          productId: product?.id,
          quantity: Number(quantity),
          variantOptionValuesId: selectedOptions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to add to cart");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async () => {
      if (!variant) {
        throw new Error("No variant available");
      }

      if (quantity < 1 || quantity > variant.stock) {
        throw new Error(`Quantity must be between 1 and ${variant.stock}`);
      }

      const res = await fetch(`/api/cart/items/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to update quantity");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Quantity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (product?.options?.length && !allOptionsSelected) {
      toast.error("Please select all product options");
      return;
    }

    if (!variant) {
      toast.error("No variant available");
      return;
    }

    if (!isAvailable) {
      toast.error("This combination is not available");
      return;
    }
    if (quantity < 1 || quantity > variant.stock) {
      toast.error(`Quantity must be between 1 and ${variant.stock}`);
      return;
    }

    if (existingItem) {
      updateQuantityMutation.mutate();
    } else {
      addToCartMutation.mutate();
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!variant) return;
    if (newQuantity >= 1 && newQuantity <= variant.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleOptionSelect = (optionId: string, optionValueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: optionValueId,
    }));
  };
  const path = usePathname();
  const breadCramps = path.split("/").filter((seg) => seg);
  const images = currentVariant?.images || product?.images || [];
  if (isProductLoading || isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5">
        {/* Images Section */}
        <div className="flex flex-col">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a href="/" className="text-gray-600 hover:text-orange-500">
                  Home
                </a>
              </li>
              {breadCramps.map((crumb, index) => {
                const href = "/" + breadCramps.slice(0, index + 1).join("/");
                return (
                  <li
                    key={index}
                    className={
                      index === breadCramps.length - 1
                        ? "text-orange-500"
                        : "text-gray-600"
                    }
                  >
                    <a href={`${href}`}>
                      {crumb.charAt(0).toUpperCase() + crumb.slice(1)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative lg:max-h-120 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img
              className="w-full h-full object-cover"
              src={currentImage?.url || "/placeholder-image.jpg"}
              alt={product.name}
            />
          </div>

          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {images &&
              images?.map((img: ImageProps) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`relative min-h-20 h-20 w-15 md:min-h-30 md:h-30 md:w-20 lg:max-h-60 lg:w-30 flex-shrink-0 rounded-lg overflow-hidden border ${
                    selectedImage?.id === img.id
                      ? "ring-2 ring-orange-500 border-orange-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={img.url}
                    alt="Product thumbnail"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-500">{product.category?.name}</p>
          <h1 className="py-2 text-2xl md:text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <p className="text-orange-500 text-lg md:text-xl font-bold">
              afg{variant?.price}
            </p>
            {variant && (
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  isAvailable
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {isAvailable
                  ? `In Stock (${variant.stock})`
                  : product.options?.length > 0 && !isOptionCombinationInStock
                    ? "Combination not available"
                    : "Out of Stock"}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-2 text-sm mt-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4 md:gap-20 mt-3">
            <span className="text-gray-500">Brand:</span>
            <span className="pb-5 text-gray-800 font-medium">
              {product.brand}
            </span>
          </div>

          {/* Product Options */}
          {product.options && product.options.length > 0 && (
            <>
              <div className="flex items-center gap-3 py-5">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Product Options
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {product.options.map((opt: ProductOption) => (
                  <div key={opt.id} className="flex flex-col">
                    <label className="text-[17px] text-gray-700 font-medium">
                      Select {opt.name}:
                    </label>
                    <div className="flex gap-3 items-center flex-wrap mt-2">
                      {opt.values.map((val) => {
                        const isSelected = selectedOptions[opt.id] === val.id;
                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => handleOptionSelect(opt.id, val.id)}
                            className={`px-5 py-2 rounded-lg transition-all font-medium ${
                              isSelected
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            {val.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Add to Cart Form */}
          <form
            onSubmit={handleAddToCart}
            className="flex flex-wrap items-center gap-4 mt-5"
          >
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || !isAvailable}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-6 py-2 text-gray-800 min-w-[3rem] text-center border-x border-gray-300">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= (variant?.stock || 0) || !isAvailable}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              disabled={
                addToCartMutation.isPending ||
                updateQuantityMutation.isPending ||
                !variant ||
                !isAvailable ||
                (product.options?.length > 0 && !allOptionsSelected) ||
                product?.organization?.settings?.storeVisibility === false
              }
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 flex-1 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {addToCartMutation.isPending || updateQuantityMutation.isPending
                ? "Processing..."
                : product?.organization?.settings?.storeVisibility === false
                  ? "Store Unavailable"
                  : !isAvailable
                    ? "Not Available"
                    : product.options?.length > 0 && !allOptionsSelected
                      ? "Select Options"
                      : existingItem
                        ? "Update Cart"
                        : "Add to Cart"}
            </button>
          </form>

          {/* Show message if options not selected */}
          {product.options?.length > 0 && !allOptionsSelected && (
            <p className="text-yellow-600 text-sm mt-2">
              Please select all options before adding to cart
            </p>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div className="card bg-orange-50 border border-orange-200 rounded-xl">
          <div className="card-body p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-between items-center">
              <p className="text-sm text-gray-700 text-center sm:text-left">
                Do you want to visit the shop and see more amazing products from{" "}
                <span className="text-gray-900 font-medium">
                  {product?.organization?.name}?
                </span>
              </p>
              <Link
                href={`/${product?.organization?.slug}`}
                className="btn bg-orange-500 hover:bg-orange-600 border-none text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Visit Shop →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-xl py-5 font-bold text-gray-800">
          Customer Reviews
        </h1>
        <div className="flex  gap-3 ">
          {product.reviews?.length > 0 ? (
            product.reviews.map((rev, index) => (
              <div
                key={rev.id || index}
                className="border-b border-gray-100 pb-3 shadow-sm shadow-orange-500 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {rev.user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="font-medium text-sm text-gray-800">
                    {rev.user?.name || "Anonymous"}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-sm">
                      <Star
                        className={`h-4 w-4 ${star <= rev.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`}
                      />
                    </span>
                  ))}
                </div>

                {rev.comment && (
                  <p className="text-sm text-gray-600 mt-1">{rev.comment}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No reviews yet</p>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-xl py-5 font-bold text-gray-800">
          Related Products
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {relatedProducts?.map((product, i: number) => (
            <ProductCard
              key={i}
              {...{
                id: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand || "",
                description: product.name,
                category:
                  (product?.category && product.category.name) ||
                  "Uncategorized",
                stock: Number(product.variants[0].stock),
                price: Number(product.variants[0].price) || 0,
                comparePriceAt: Number(product.variants[0].comparePriceAt) || 0,
                organizationName: product.organization.name || "Unknown",
                organizationLogo: product.organization.logo || "",
                images: product.images[0].url || "/placeholder-image.jpg",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

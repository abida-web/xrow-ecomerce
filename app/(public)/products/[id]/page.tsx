"use client";

import { getProductDetail } from "@/app/actions/product-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuantityStore } from "@/store/cart-store";

interface ImageProps {
  id: string;
  createdAt: Date | null;
  productId: string;
  url: string;
  isPrimary: boolean | null;
}

interface VariantProps {
  id: string;
  createdAt: Date | null;
  productId: string;
  sku: string;
  price: string;
  stock: number;
  option1: string | null;
  option1Value: string | null;
  option2: string | null;
  option2Value: string | null;
  option3: string | null;
  option3Value: string | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantProps | null>(
    null,
  );

  // Use Zustand for quantity
  const { quantity, setQuantity, reset } = useQuantityStore();

  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetail(id),
  });

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart/items", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  const handleImageSelection = (img: ImageProps) => {
    setSelectedImage(img);
  };

  const handleVariantSelection = (vari: VariantProps) => {
    setSelectedVariant(vari);
    reset(); // Reset quantity to 1 when variant changes
  };

  const primaryImage = product?.images?.find((img) => img.isPrimary);
  const currentImage = selectedImage || primaryImage;
  const currentVariant = selectedVariant || product?.variants?.[0];

  const addtoCartMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          variantId: currentVariant?.id,
          productId: product?.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/cart/items/${currentVariant?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: Number(quantity) }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update quantity");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVariant) return;
    if (quantity < 1 || quantity > currentVariant.stock) return;

    const existingItem = cartItems?.userCartItems?.find(
      (item: any) => item.variantId === currentVariant?.id,
    );

    if (existingItem) {
      updateQuantityMutation.mutate();
    } else {
      addtoCartMutation.mutate();
    }
  };

  const existingItem = cartItems?.userCartItems?.find(
    (item: any) => item.variantId === currentVariant?.id,
  );

  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      reset();
    }
  }, [existingItem, currentVariant?.id, setQuantity, reset]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!currentVariant) return;
    if (newQuantity < 1 || newQuantity > currentVariant.stock) return;
    setQuantity(newQuantity);

    if (existingItem) {
      const timer = setTimeout(() => {
        updateQuantityMutation.mutate();
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  if (isLoading) {
    return <p>is loading</p>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <img
            className="lg:max-h-200 max-h-150 w-full object-cover rounded-lg"
            src={currentImage?.url}
          />

          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {product?.images?.map((img: any) => (
              <img
                onClick={() => handleImageSelection(img)}
                key={img.id}
                className={`min-h-20 h-20 w-15 md:min-h-30 md:h-30 md:w-20 lg:max-h-60 lg:w-30 object-cover rounded-lg flex-shrink-0 cursor-pointer ${selectedImage?.url === img.url ? "border-2 border-orange-500" : ""}`}
                src={img.url}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">{product?.category?.name}</p>
          <h1 className="py-2 text-2xl md:text-3xl">{product?.name}</h1>
          <div className="flex gap-4 text-base md:text-lg">
            <p className="text-orange-500">afg{currentVariant?.price}</p>
            <p className="line-through text-gray-400">
              afg{product?.comparePriceAt}
            </p>
          </div>
          <p className="text-[#d1d5dc] mb-2 text-sm">{product?.description}</p>
          <p className="text-gray-300 flex flex-wrap gap-4 md:gap-20 mt-3">
            <span className="font-medium text-gray-400">Weight:</span>
            <span className="text-orange-500">
              <span className="text-gray-400"> {product?.weight} </span>
              {product?.weightUnit}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 md:gap-20 mt-3">
            <span className="text-gray-400">Brand:</span>
            <span>{product?.brand}</span>
          </div>

          <h1 className="text-xl py-3 text-gray-500">Variants :</h1>
          <div className="flex flex-wrap gap-3 items-center">
            {product?.variants?.map((vari: VariantProps, i: number) => (
              <button
                key={vari.id}
                onClick={() => handleVariantSelection(vari)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${selectedVariant?.id === vari.id ? "bg-orange-500 text-white" : "bg-white text-orange-500"}`}
              >
                Variant {i + 1}
              </button>
            ))}
          </div>
          <div className="mb-5 flex flex-wrap gap-5 items-center">
            <div className="flex flex-col gap-5 mt-5 p-4 md:p-5 w-full bg-gray-900 border-gray-600 border rounded-lg">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-gray-400">Stock:</span>
                <span>{currentVariant?.stock}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-gray-400">Price:</span>
                <span>afg{currentVariant?.price}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h1 className="text-sm font-bold text-white uppercase tracking-wider">
                  Product Options
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-20">
                <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option1}
                </p>
                <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option1Value}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-20">
                <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option2}
                </p>
                <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option2Value}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-20">
                <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option3}
                </p>
                <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                  {currentVariant?.option3Value}
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleAddToCart}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
              >
                -
              </button>
              <span className="px-6 py-2 text-white min-w-[3rem] text-center border-x border-gray-700">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(Number(quantity + 1))}
                disabled={quantity >= (currentVariant?.stock || 0)}
                className="px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
              >
                +
              </button>
            </div>
            <button
              type="submit"
              disabled={
                addtoCartMutation.isPending ||
                updateQuantityMutation.isPending ||
                !currentVariant ||
                currentVariant?.stock === 0
              }
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 flex-1 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {addtoCartMutation.isPending || updateQuantityMutation.isPending
                ? "Processing..."
                : existingItem
                  ? "Update Cart"
                  : "Add to Cart"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

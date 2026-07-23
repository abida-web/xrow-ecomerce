"use client";

import { useQuantityStore } from "@/store/cart-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

const CartPage = () => {
  const queryClient = useQueryClient();
  const {
    data: cartItems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart/items", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      variantId,
      newQuantity,
    }: {
      variantId: string;
      newQuantity: number;
    }) => {
      const res = await fetch(`/api/cart/items/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update quantity");
      }

      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const deleteItemMutation = useMutation({
    mutationFn: async (variantId: string) => {
      const res = await fetch(`/api/cart/items/${variantId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update quantity");
      }

      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const handleUpdateQuantity = (variantId: string, newQuantity: number) => {
    const item = cartItems.userCartItems.find(
      (item: any) => item.variantId === variantId,
    );
    if (!item) return;

    const stock = item.variant?.stock || 0;
    if (newQuantity < 1 || newQuantity > stock) return;

    // Debounce the API call
    const timer = setTimeout(() => {
      updateQuantityMutation.mutate({ variantId, newQuantity });
    }, 300);

    return () => clearTimeout(timer);
  };
  const handleDeleteItem = (variantId: string) => {
    deleteItemMutation.mutate(variantId);
  };
  const subTotal =
    cartItems?.userCartItems?.reduce((curr: any, acc: any) => {
      return curr + acc.quantity * acc?.variant?.price;
    }, 0) || 0;
  const shipping = subTotal > 300 ? 0 : 10;
  const tax = subTotal > 1000 ? 10 : 0;
  const total = subTotal + shipping + tax;
  const createOrderMutaion = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to place Order");
      }

      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const handlePlaceOrder = () => {
    createOrderMutaion.mutate();
  };
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Shopping Cart</h1>
      <div className=" grid lg:grid-cols-[800px_1fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            {cartItems?.userCartItems?.map((item: any) => {
              const subTotal = item.variant.price * item.quantity;
              return (
                <div key={item.id} className="flex items-center">
                  <div className="grid grid-cols-4 items-center gap-5 flex-1 bg-gray-900 p-3 ">
                    <img
                      src={item.variant?.product?.images[0]?.url}
                      className="w-[80px] h-[100px] object-cover rounded-lg"
                    />
                    <div className=" flex flex-col gap-1">
                      <p>{item.variant.product.name}</p>
                      <p className=" text-gray-400 text-xs">
                        #{item.variantId.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex gap-5 items-center">
                      <p className=" bg-white/10 py-1 text-xs px-1.5 rounded-full">
                        {item.quantity}
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.variantId,
                              Number(item.quantity) + 1,
                            )
                          }
                        >
                          <PlusCircle fill="oklch(70.5% 0.213 47.604)" />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.variantId,
                              item.quantity - 1,
                            )
                          }
                        >
                          <MinusCircle fill="oklch(70.5% 0.213 47.604)" />
                        </button>
                      </div>
                    </div>
                    <p>
                      <span className=" text-orange-500">afg</span>
                      {subTotal}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.variantId)}
                    className="ml-5 hover:text-red-800 hover:bg-red-600/20 p-2 transition-colors rounded-full"
                  >
                    <Trash2 size={20} className="" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-10">
            <span className=" text-gray-400">Subtotal:</span>
            <span className=" text-orange-500 font-semibold">
              afg{subTotal}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-900 p-5 h-fit">
          <h1 className=" pb-4 border-b border-gray-500 font-semibold">
            Order Summary
          </h1>
          <div className=" flex justify-between items-center mt-3">
            <p className=" text-gray-400">Items</p>
            <p>{cartItems?.totalCartItems}</p>
          </div>
          <div className=" flex justify-between items-center mt-3">
            <p className=" text-gray-400">Sub Total</p>
            <p>
              {" "}
              <span className=" text-orange-500">afg</span>
              {subTotal}
            </p>
          </div>
          <div className=" flex justify-between items-center mt-3">
            <p className=" text-gray-400">Sub Total</p>
            <p>
              {" "}
              <span className=" text-orange-500">afg</span>
              {subTotal}
            </p>
          </div>
          <div className=" flex justify-between items-center mt-3">
            <p className=" text-gray-400">Shipping</p>
            <p>
              {" "}
              <span className=" text-orange-500">afg</span>
              {shipping}
            </p>
          </div>
          <div className=" flex justify-between items-center mt-3 mb-4 border-b pb-4 border-gray-500">
            <p className=" text-gray-400">Taxes</p>
            <p>
              <span className=" text-orange-500">afg</span>
              {tax}
            </p>
          </div>
          <div className=" flex justify-between items-center mt-3 mb-4">
            <p className=" text-gray-400">Total</p>
            <p>
              <span className=" text-orange-500">afg</span>
              {total}
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="bg-orange-500 w-full hover:bg-orange-600 disabled:bg-gray-600 flex-1 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {createOrderMutaion.isPending ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

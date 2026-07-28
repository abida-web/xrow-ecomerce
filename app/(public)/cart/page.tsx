"use client";

import CustomInput from "@/app/(seller)/dashboard/_components/CustomeInput";
import { getDefaultAddress } from "@/app/actions/getDefaultAddress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const CartPage = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "US",
    province: "",
    city: "",
    streetAddress: "",
    postalCode: "",
    isDefault: true,
  });
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const queryClient = useQueryClient();

  const { data: defaultAddress } = useQuery<any>({
    queryKey: ["address"],
    queryFn: async () => await getDefaultAddress(),
  });

  useEffect(() => {
    if (useDefaultAddress && defaultAddress) {
      setAddress({
        fullName: defaultAddress.fullName || "",
        phone: defaultAddress.phone || "",
        email: defaultAddress.email || "",
        country: defaultAddress.country || "US",
        province: defaultAddress.province || "",
        city: defaultAddress.city || "",
        streetAddress: defaultAddress.streetAddress || "",
        postalCode: defaultAddress.postalCode || "",
        isDefault: true,
      });
    }
  }, [useDefaultAddress, defaultAddress]);

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
        throw new Error(error.error || "Failed to delete item");
      }

      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleUpdateQuantity = (variantId: string, newQuantity: number) => {
    const item = cartItems?.userCartItems?.find(
      (item: any) => item.variantId === variantId,
    );
    if (!item) return;

    const stock = item.variant?.stock || 0;
    if (newQuantity < 1 || newQuantity > stock) return;

    updateQuantityMutation.mutate({ variantId, newQuantity });
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

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address }),
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
      setOpenCheckoutModal(false);
      setAddress({
        fullName: "",
        phone: "",
        email: "",
        country: "US",
        province: "",
        city: "",
        streetAddress: "",
        postalCode: "",
        isDefault: true,
      });
      setUseDefaultAddress(false);
    },
  });

  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.streetAddress ||
      !address.city
    ) {
      alert("Please fill in all required address fields");
      return;
    }
    createOrderMutation.mutate();
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">
        {openCheckoutModal ? "Checkout" : "Shopping Cart"}
      </h1>
      <div className="grid lg:grid-cols-[800px_1fr] gap-5">
        {openCheckoutModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Shipping Address</h1>
                <button
                  onClick={() => setOpenCheckoutModal(false)}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mt-5">
                <div className="bg-white/5 rounded-lg p-5">
                  <div className="mb-4">
                    <CustomInput
                      label="Full Name *"
                      name="fullName"
                      value={address.fullName}
                      onChange={(e) =>
                        handleAddressChange("fullName", e.target.value)
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 mb-4">
                    <CustomInput
                      label="Phone *"
                      name="phone"
                      value={address.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      placeholder="+1 234 567 8900"
                      required
                    />
                    <CustomInput
                      label="Email *"
                      name="email"
                      value={address.email}
                      onChange={(e) =>
                        handleAddressChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                      type="email"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 mb-4">
                    <CustomInput
                      label="Country *"
                      name="country"
                      value={address.country}
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                      placeholder="United States"
                      required
                    />
                    <CustomInput
                      label="Province/State *"
                      name="province"
                      value={address.province}
                      onChange={(e) =>
                        handleAddressChange("province", e.target.value)
                      }
                      placeholder="California"
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 mb-4">
                    <CustomInput
                      label="City *"
                      name="city"
                      value={address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      placeholder="Los Angeles"
                      required
                    />
                    <CustomInput
                      label="Postal Code *"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={(e) =>
                        handleAddressChange("postalCode", e.target.value)
                      }
                      placeholder="90001"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <CustomInput
                      label="Street Address *"
                      name="streetAddress"
                      value={address.streetAddress}
                      onChange={(e) =>
                        handleAddressChange("streetAddress", e.target.value)
                      }
                      placeholder="123 Main Street, Apt 4B"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={useDefaultAddress}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseDefaultAddress(checked);
                        if (!checked) {
                          setAddress({
                            fullName: "",
                            phone: "",
                            email: "",
                            country: "US",
                            province: "",
                            city: "",
                            streetAddress: "",
                            postalCode: "",
                            isDefault: false,
                          });
                        }
                      }}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {defaultAddress
                        ? "Use default address"
                        : "Save as default address"}
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
                className="mt-5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-3 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
              >
                {createOrderMutation.isPending
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {cartItems?.userCartItems?.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5">
                  {cartItems?.userCartItems?.map((item: any) => {
                    const subTotal = item.variant.price * item.quantity;
                    return (
                      <div key={item.id} className="flex items-center">
                        <div className="grid grid-cols-4 items-center gap-5 flex-1 bg-gray-900 p-3 rounded-lg">
                          <img
                            src={item.variant?.product?.images?.[0]?.url}
                            className="w-[80px] h-[100px] object-cover rounded-lg"
                            alt={item.variant?.product?.name}
                          />
                          <div className="flex flex-col gap-1">
                            <p className="font-medium">
                              {item.variant?.product?.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              #{item.variantId.slice(0, 10)}
                            </p>
                            {item.variant?.option1 && (
                              <p className="text-xs text-gray-400">
                                {item.variant.option1}:{" "}
                                {item.variant.option1Value}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-5 items-center">
                            <p className="bg-white/10 py-1 text-xs px-1.5 rounded-full">
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
                                disabled={updateQuantityMutation.isPending}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <PlusCircle
                                  fill="oklch(70.5% 0.213 47.604)"
                                  size={20}
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.variantId,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={updateQuantityMutation.isPending}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <MinusCircle
                                  fill="oklch(70.5% 0.213 47.604)"
                                  size={20}
                                />
                              </button>
                            </div>
                          </div>
                          <p>
                            <span className="text-orange-500">afg</span>
                            {subTotal.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.variantId)}
                          disabled={deleteItemMutation.isPending}
                          className="ml-5 hover:text-red-500 hover:bg-red-600/20 p-2 transition-colors rounded-full"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-10">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-orange-500 font-semibold">
                    afg{subTotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="w-full bg-gray-900 p-5 h-fit rounded-lg sticky top-5">
          <h1 className="pb-4 border-b border-gray-500 font-semibold">
            Order Summary
          </h1>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-400">Items</p>
            <p>{cartItems?.totalCartItems || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-400">Sub Total</p>
            <p>
              <span className="text-orange-500">afg</span>
              {subTotal.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-400">Shipping</p>
            <p>
              <span className="text-orange-500">afg</span>
              {shipping.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 mb-4 border-b pb-4 border-gray-500">
            <p className="text-gray-400">Taxes</p>
            <p>
              <span className="text-orange-500">afg</span>
              {tax.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 mb-4">
            <p className="text-gray-400 font-semibold">Total</p>
            <p className="text-xl font-bold">
              <span className="text-orange-500">afg</span>
              {total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={
              openCheckoutModal
                ? handlePlaceOrder
                : () => setOpenCheckoutModal(true)
            }
            disabled={
              !cartItems?.userCartItems?.length || createOrderMutation.isPending
            }
            className="bg-orange-500 w-full hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {openCheckoutModal
              ? createOrderMutation.isPending
                ? "Placing order..."
                : "Place Order"
              : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

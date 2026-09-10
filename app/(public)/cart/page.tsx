"use client";

import CustomInput from "@/app/(seller)/dashboard/_components/CustomeInput";
import { getDefaultAddress } from "@/app/actions/getDefaultAddress";
import { getOrganizationWithShippingSettings } from "@/app/actions/settings";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MinusCircle, PlusCircle, Store, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // ✅ Store shipping options per shop (keyed by organization ID)
  const [selectedShippingOptions, setSelectedShippingOptions] = useState<
    Record<
      string,
      {
        methodId: string;
        rateId: string;
        rate: string;
        methodName: string;
      }
    >
  >({});

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
        toast.error("Failed to update the quantity");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Quantity updated");
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
        toast.error("Failed to delete item");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Item removed successfully");
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

  // ✅ Calculate total shipping from all selected options
  const totalShipping = Object.values(selectedShippingOptions).reduce(
    (sum, opt) => sum + (opt.rate ? parseFloat(opt.rate) : 0),
    0,
  );

  const tax = subTotal > 1000 ? 10 : 0;
  const total = subTotal + totalShipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address,
          shipping: selectedShippingOptions, // ✅ Send all shipping options
        }),
      });

      if (!res.ok) {
        toast.error("Failed to place Order");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Order placed successfully");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      setSelectedShippingOptions({});
    },
  });

  const groupedProducts = new Map();
  for (let item of cartItems?.userCartItems || []) {
    const orgId = item?.variant?.product?.organization?.id;
    if (!groupedProducts.has(orgId)) {
      groupedProducts.set(orgId, {
        orgId: orgId,
        orgName: item?.variant?.product?.organization?.name,
        items: [],
        methods: item?.variant?.product?.organization?.shippingMethods || [],
      });
    }
    groupedProducts.get(orgId).items.push(item);
  }

  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.streetAddress ||
      !address.city
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }

    // ✅ Check if all shops have shipping selected
    const allSelected = Array.from(groupedProducts.keys()).every(
      (orgId) => selectedShippingOptions[orgId]?.methodId,
    );

    if (!allSelected) {
      toast.error("Please select a shipping method for each shop");
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

  // ✅ handleSelection per shop
  const handleSelection = (
    orgId: string,
    methodId: string,
    rateId: string,
    rate: string,
    methodName: string,
  ) => {
    setSelectedShippingOptions((prev) => ({
      ...prev,
      [orgId]: {
        methodId,
        rateId,
        rate,
        methodName,
      },
    }));
    toast.success(`Selected ${methodName} - afg${rate}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 mt-30 text-orange-500">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="mb-5 text-2xl font-semibold text-gray-800">
        {openCheckoutModal ? "Checkout" : "Shopping Cart"}
      </h1>
      <div className="grid lg:grid-cols-[800px_1fr] gap-5">
        {openCheckoutModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Shipping Address
                </h1>
                <button
                  onClick={() => setOpenCheckoutModal(false)}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mt-5">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
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
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {defaultAddress
                        ? "Use default address"
                        : "Save as default address"}
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpenCheckoutModal(false)}
                disabled={createOrderMutation.isPending}
                className="mt-5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
              >
                Add address
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
                  {Array.from(groupedProducts.entries()).map(
                    ([shopId, grouped]) => {
                      // ✅ Get selected option for this shop
                      const selectedForShop = selectedShippingOptions[shopId];
                      const isShopSelected = !!selectedForShop?.methodId;

                      return (
                        <div
                          key={shopId}
                          className="flex flex-col bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <span className="text-black mb-3 text-lg flex gap-2 items-center">
                            <Store className="text-orange-500 h-5 w-5" />
                            {grouped.orgName}
                            {isShopSelected && (
                              <span className="text-xs text-green-500 ml-2">
                                ✓ Shipping selected
                              </span>
                            )}
                          </span>
                          <div className="flex flex-col gap-2">
                            {grouped.items.map((item: any) => {
                              const subTotal =
                                item.variant.price * item.quantity;
                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center"
                                >
                                  <div className="grid grid-cols-4 items-center gap-5 flex-1">
                                    <img
                                      src={
                                        item.variant?.product?.images?.[0]?.url
                                      }
                                      className="w-[80px] h-[100px] object-cover rounded-lg"
                                      alt={item.variant?.product?.name}
                                    />
                                    <div className="flex flex-col gap-1">
                                      <p className="font-medium text-gray-800">
                                        {item.variant?.product?.name}
                                      </p>
                                      <p className="text-gray-400 text-xs">
                                        #{item.variantId.slice(0, 10)}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {item?.variant?.optionValues
                                          .map(
                                            (val: any) =>
                                              val.productOptionValue.value,
                                          )
                                          .join(" - ")}
                                      </p>
                                    </div>
                                    <div className="flex gap-5 items-center">
                                      <p className="bg-gray-100 py-1 text-xs px-1.5 rounded-full text-gray-600">
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
                                          disabled={
                                            updateQuantityMutation.isPending
                                          }
                                          className="hover:opacity-70 transition-opacity text-orange-500"
                                        >
                                          <PlusCircle size={20} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.variantId,
                                              item.quantity - 1,
                                            )
                                          }
                                          disabled={
                                            updateQuantityMutation.isPending
                                          }
                                          className="hover:opacity-70 transition-opacity text-orange-500"
                                        >
                                          <MinusCircle size={20} />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-gray-800">
                                      <span className="text-orange-500">
                                        {activeOrganization?.currency}
                                      </span>
                                      {subTotal.toFixed(2)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteItem(item.variantId)
                                    }
                                    disabled={deleteItemMutation.isPending}
                                    className="ml-5 hover:text-red-500 hover:bg-red-50 p-2 transition-colors rounded-full text-gray-400"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <h1 className="py-2 text-black">
                            Select a delivery method :
                          </h1>
                          <div className="text-black flex items-center gap-5 flex-wrap">
                            {grouped?.methods
                              ?.filter((me: any) => me.isActive === true)
                              ?.map((method: any) => {
                                const matchedRate = method.rates?.find(
                                  (rate: any) =>
                                    rate.shippingZone?.name.toLowerCase() ===
                                    address.city.toLowerCase(),
                                );
                                const isSelected =
                                  selectedForShop?.methodId === method.id;

                                return (
                                  <div
                                    key={method.id}
                                    className={`flex border-2 p-4 rounded-lg transition-all cursor-pointer ${
                                      isSelected
                                        ? "border-orange-500 bg-orange-50 shadow-md"
                                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                                    }`}
                                    onClick={() => {
                                      if (matchedRate) {
                                        handleSelection(
                                          shopId, // ✅ Pass shop ID
                                          method.id,
                                          matchedRate.id,
                                          matchedRate.price,
                                          method.name,
                                        );
                                      }
                                    }}
                                  >
                                    {matchedRate ? (
                                      <div className="flex items-center gap-4">
                                        <div>
                                          <p className="font-medium text-gray-800">
                                            {method.name}
                                          </p>
                                          <p className="text-xs text-gray-400">
                                            {method.description}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-orange-500 font-bold text-lg">
                                            {activeOrganization?.currency}
                                            {matchedRate.price}
                                          </p>
                                          <p className="text-xs text-gray-400">
                                            {matchedRate.shippingZone?.name}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <span className="text-green-500 text-sm ml-2">
                                            ✓ Selected
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-400">
                                        {method.name} - Not available in{" "}
                                        {address.city || "your location"}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div className="flex items-center gap-10">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-orange-500 font-semibold">
                    {activeOrganization?.currency}
                    {subTotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        <div className="w-full bg-white p-5 h-fit rounded-lg border border-gray-200 shadow-sm sticky top-5">
          <h1 className="pb-4 border-b border-gray-200 font-semibold text-gray-800">
            Order Summary
          </h1>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500">Items</p>
            <p className="text-gray-700">{cartItems?.totalCartItems || 0}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500">Sub Total</p>
            <p className="text-gray-700">
              <span className="text-orange-500">
                {activeOrganization?.currency}
              </span>
              {subTotal.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500">Shipping</p>
            <p className="text-gray-700">
              <span className="text-orange-500">
                {activeOrganization?.currency}
              </span>
              {totalShipping.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 mb-4 border-b pb-4 border-gray-200">
            <p className="text-gray-500">Taxes</p>
            <p className="text-gray-700">
              <span className="text-orange-500">
                {activeOrganization?.currency}
              </span>
              {tax.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 mb-4">
            <p className="text-gray-600 font-semibold">Total</p>
            <p className="text-xl font-bold text-gray-800">
              <span className="text-orange-500">
                {activeOrganization?.currency}
              </span>
              {total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setOpenCheckoutModal(true)}
            disabled={!cartItems?.userCartItems?.length}
            className="bg-orange-500 w-full hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Add Your Address
          </button>
        </div>
      </div>
      <button
        onClick={handlePlaceOrder}
        disabled={createOrderMutation.isPending}
        className="bg-orange-500 w-full mt-5 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Place your order
      </button>
    </div>
  );
};

export default CartPage;

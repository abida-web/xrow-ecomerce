"use client";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Mail,
  Phone,
  ReceiptText,
  MapPin,
  User,
  Package,
} from "lucide-react";
import { useParams } from "next/navigation";

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description: string;
  status: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

interface OptionValue {
  id: string;
  productOptionValueId: string;
  variantId: string;
  productOptionValue?: {
    id: string;
    productOptionId: string;
    value: string;
    createdAt: string;
  };
}

interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: string | number;
  costPrice: string | number | null;
  stock: number;
  comparePriceAt: string | number | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
  optionValues: OptionValue[];
}

interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: string | number;
  priceAtPurchase: string | number;
  createdAt: string;
  variant: Variant;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  metadata: string | null;
}

interface Address {
  id: string;
  orderId: string;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  province: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  createdAt: string;
}

interface OrderData {
  id: string;
  userId: string;
  organizationId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: string | number;
  total: string | number;
  shippingFullName?: string;
  shippingPhone?: string;
  shippingEmail?: string;
  shippingCountry?: string;
  shippingProvince?: string;
  shippingCity?: string;
  shippingStreetAddress?: string;
  shippingPostalCode?: string;
  createdAt: string;
  user: User;
  organization: Organization;
  address: Address | null;
  items: OrderItem[];
}

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = String(params.id);

  const { data, isLoading, error, refetch } = useQuery<OrderData>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }
      return await response.json();
    },
    enabled: !!orderId,
  });

  // Helper function to safely format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined) return "0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Get shipping address from either address object or shipping fields
  const getShippingAddress = () => {
    if (data?.address) {
      return data.address;
    }
    // Fallback to shipping fields from order
    if (data?.shippingStreetAddress) {
      return {
        streetAddress: data.shippingStreetAddress || "",
        city: data.shippingCity || "",
        country: data.shippingCountry || "",
        postalCode: data.shippingPostalCode || "",
        phone: data.shippingPhone || "",
        email: data.shippingEmail || "",
        fullName: data.shippingFullName || "",
      };
    }
    return null;
  };

  // Get option values display text
  const getOptionValuesText = (optionValues: OptionValue[]) => {
    if (!optionValues || optionValues.length === 0) return null;
    return optionValues
      .map((ov) => ov.productOptionValue?.value || "")
      .filter(Boolean)
      .join(" • ");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-3 text-gray-400">Loading order details...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-2">Error loading order</div>
        <div className="text-gray-400 text-sm">{(error as Error).message}</div>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Order not found</div>
      </div>
    );
  }

  const shippingAddress = getShippingAddress();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-5 flex-wrap">
        <h1 className="flex gap-2 text-2xl font-semibold text-gray-400">
          <span>Order</span>
          <span className="text-orange-500">#{data.id.slice(0, 10)}</span>
        </h1>
        <p
          className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColorApplier(
            data.status,
          )}`}
        >
          {data.status.toUpperCase()}
        </p>
        <div className="text-sm flex items-center gap-2">
          <Calendar size={17} className="text-gray-400" />
          <span className="text-orange-400">{formatDate(data.createdAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[700px_1fr] gap-5 mt-5">
        {/* Left Column - Order Items and Summary */}
        <div className="flex flex-col gap-5">
          {/* Order Items */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
              <Package size={20} />
              Order Items ({data.items?.length || 0})
            </h2>

            {data.items?.map((item, index) => {
              // Get the primary image or first image
              const productImage =
                item.variant?.product?.images?.find((img) => img.isPrimary) ||
                item.variant?.product?.images?.[0];

              const optionValuesText = getOptionValuesText(
                item.variant?.optionValues || [],
              );

              return (
                <div
                  key={item.id || index}
                  className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 
                           hover:border-gray-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    {productImage?.url && (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
                        <img
                          src={productImage.url}
                          alt={item.variant?.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {item.variant?.product?.name || "Unknown Product"}
                      </h3>

                      {optionValuesText && (
                        <p className="text-sm text-gray-400 mt-1">
                          {optionValuesText}
                        </p>
                      )}

                      {item.variant?.sku && (
                        <p className="text-xs text-gray-500 mt-1">
                          SKU: {item.variant.sku}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-green-400">
                          AFN {formatCurrency(item.priceAtPurchase)}
                        </span>
                        {item.variant?.comparePriceAt &&
                          Number(item.variant.comparePriceAt) >
                            Number(item.priceAtPurchase) && (
                            <span className="text-xs line-through text-gray-500">
                              AFN {formatCurrency(item.variant.comparePriceAt)}
                            </span>
                          )}
                        <span className="text-gray-400">× {item.quantity}</span>
                        <span className="text-orange-400 font-semibold">
                          AFN{" "}
                          {formatCurrency(
                            Number(item.priceAtPurchase) *
                              Number(item.quantity),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h2 className="pb-2 font-semibold text-lg text-gray-300">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Sub Total</p>
                <p>AFN {formatCurrency(data.subtotal)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Shipping</p>
                <p className="text-green-400">Free</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <p className="text-gray-400 font-semibold">Total</p>
                <p>
                  <span className="text-orange-500 font-bold text-lg">
                    AFN {formatCurrency(data.total)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Information */}
        <div className="flex flex-col gap-5">
          {/* Customer Card */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h2 className="font-semibold text-lg text-gray-300 flex items-center gap-2 mb-4">
              <User size={20} />
              Customer
            </h2>

            {/* Customer Name */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {data?.user?.name?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium">{data?.user?.name || "Unknown"}</p>
                <p className="text-sm text-gray-400">
                  {data?.user?.email || "No email"}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="py-3 border-b border-gray-700">
              <p className="text-sm font-semibold text-gray-400 mb-2">
                Contact
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-orange-400" />
                <span className="text-gray-300">
                  {shippingAddress?.email || data?.user?.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Phone size={16} className="text-green-400" />
                <span className="text-gray-300">
                  {shippingAddress?.phone || data?.shippingPhone || "N/A"}
                </span>
              </div>
            </div>

            {/* Order Stats */}
            <div className="py-3">
              <div className="flex items-center gap-2 text-sm">
                <ReceiptText size={16} className="text-blue-400" />
                <span className="text-gray-300">
                  {data.items?.length || 0} Item
                  {(data.items?.length || 0) > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h2 className="font-semibold text-lg text-gray-300 flex items-center gap-2 mb-4">
              <MapPin size={20} />
              Shipping Address
            </h2>

            {shippingAddress ? (
              <div className="space-y-2 text-sm">
                {shippingAddress.fullName && (
                  <p className="font-medium text-white">
                    {shippingAddress.fullName}
                  </p>
                )}
                <p className="text-gray-300">{shippingAddress.streetAddress}</p>
                {shippingAddress.city && (
                  <p className="text-gray-300">{shippingAddress.city}</p>
                )}
                {shippingAddress.country && (
                  <p className="text-gray-300">{shippingAddress.country}</p>
                )}
                {shippingAddress.postalCode && (
                  <p className="text-gray-400">
                    Postal: {shippingAddress.postalCode}
                  </p>
                )}
                {shippingAddress.phone && (
                  <p className="text-gray-400">
                    Phone: {shippingAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                <p>No shipping address available</p>
                <p className="text-xs text-gray-500 mt-1">
                  Order ID: {data.id.slice(0, 8)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

"use client";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  List,
  ListStart,
  Mail,
  Phone,
  ReceiptText,
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
  comparePriceAt: string | number | null;
  costPrice: string | number | null;
  brand: string;
  weightUnit: string;
  weight: string;
  createdAt: string;
  images: ProductImage[];
}

interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: string | number;
  stock: number;
  option1?: string | null;
  option1Value?: string | null;
  option2?: string | null;
  option2Value?: string | null;
  option3?: string | null;
  option3Value?: string | null;
  createdAt: string;
  product: Product;
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
  createdAt: string;
  user: User;
  organization: Organization;
  address: Address;
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
    enabled: !!orderId, // Only run if orderId exists
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading order details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading order: {(error as Error).message}
        </div>
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

  // Helper function to safely format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5 flex-wrap">
        <h1 className="flex gap-2 text-2xl font-semibold text-gray-400">
          <span>Order</span>
          <span className="text-orange-500">#{orderId.slice(0, 10)}</span>
        </h1>
        <p
          className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColorApplier(
            data.status,
          )}`}
        >
          {data.status}
        </p>
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <Calendar size={17} className="text-gray-400" />
          <span className="text-orange-400">{formatDate(data.createdAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[700px_1fr] gap-5 mt-5">
        <div className="flex flex-col gap-5">
          {/* Order Items */}
          <div className="flex flex-col gap-5">
            {data.items?.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-gray-900 p-3 rounded-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  {item.variant?.product?.images?.[0]?.url && (
                    <div className="relative h-35 w-30 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.variant.product.images[0].url}
                        alt={item.variant.product.name || "Product image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-[17px] font-semibold mb-2">
                      {item.variant?.product?.name || "Unknown Product"}
                    </h1>

                    {/* Product Variants */}
                    {item.variant?.option1 && (
                      <div className="flex flex-wrap items-center gap-5 mb-2">
                        <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                          {item.variant.option1}
                        </p>
                        <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                          {item.variant.option1Value || "N/A"}
                        </p>
                      </div>
                    )}

                    {item.variant?.option2 && (
                      <div className="flex flex-wrap items-center gap-5 mb-2">
                        <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                          {item.variant.option2}
                        </p>
                        <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                          {item.variant.option2Value || "N/A"}
                        </p>
                      </div>
                    )}

                    {item.variant?.option3 && (
                      <div className="flex flex-wrap items-center gap-5 mb-2">
                        <p className="bg-gray-800 px-3 py-px rounded-sm text-sm">
                          {item.variant.option3}
                        </p>
                        <p className="bg-orange-500 px-3 py-px rounded-sm text-sm">
                          {item.variant.option3Value || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2">
                    <p className="text-green-600">afg{item.priceAtPurchase}</p>
                    {item.variant?.product?.comparePriceAt && (
                      <p className="text-xs line-through">
                        afg{item.variant.product.comparePriceAt}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-300">×{item.quantity}</p>
                  <p className="text-orange-400 font-semibold">
                    afg
                    {(
                      Number(item.priceAtPurchase) * Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 p-4 rounded-sm">
            <h1 className="pb-2 font-semibold text-lg">Order Summary</h1>
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-400">Sub Total</p>
              <p>afg{data.subtotal}</p>
            </div>
            <div className="flex justify-between items-center mt-3 border-t border-gray-700 pt-3">
              <p className="text-gray-400 font-semibold">Total</p>
              <p>
                <span className="text-orange-500">afg</span>
                <span className="font-bold text-lg">{data.total}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-sm">
          {/* Placeholder for additional content */}
          <h2 className="font-semibold text-lg text-gray-300">Customer</h2>
          <div className="flex items-center gap-3 border-b pb-3 border-gray-500">
            <span className="px-3 py-1.5 mt-4 bg-orange-500 rounded-full">
              {data?.user?.name?.slice(0, 1).toUpperCase()}
            </span>
            <div className="flex flex-col mt-3 ">
              <span className="text-sm"> {data?.user?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-b pb-3 border-gray-500">
            <span className="px-1.5 py-1.5 mt-4 text-blue-600 bg-white/5 rounded-full">
              <ReceiptText />
            </span>
            <p className="mt-3 text-sm">{data.items.length} Orders</p>
          </div>
          <div className="flex flex-col gap-3 border-b pb-3 border-gray-500">
            <p className="mt-3 text-[16px] font-semibold">Contact Info</p>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-1.5 mt-4 text-orange-500 bg-white/5 rounded-full">
                <Mail />
              </span>
              <h1 className="mt-2 text-gray-400"> {data?.address.email}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-1.5 mt-4 text-green-500 bg-white/5 rounded-full">
                <Phone />
              </span>

              <h1 className="mt-2 text-gray-400"> {data?.address.phone}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3  pb-3 ">
            <p className="mt-3 text-[16px] font-semibold">Shipping address</p>

            <p className=" text-gray-400 text-sm">
              {data.address.streetAddress}
            </p>

            <p className=" text-gray-400 text-sm">{data.address.city}</p>
            <p className=" text-gray-400 text-sm">{data.address.country}</p>
            <p className=" text-gray-400 text-sm">
              Postal code: {data.address.postalCode}
            </p>
            <p className=" text-gray-400 text-sm">{data.address.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

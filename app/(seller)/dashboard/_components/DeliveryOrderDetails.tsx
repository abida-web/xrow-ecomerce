"use client";

import React from "react";
import { X, UserRound, ClipboardPen } from "lucide-react";

interface DeliveryItem {
  id: string;
  quantity: number | null;
  priceAtPurchase: number | null;
  variant?: {
    product?: {
      name?: string;
      images?: Array<{ url: string }>;
    };
    size?: string;
    color?: string;
  };
}

interface DeliveryDetails {
  shippingFullName: string | null;
  shippingPhone: string | null;
  total?: string | null;
  status?: string;
  items?: DeliveryItem[];
}

interface DeliveryStatus {
  status: string;
  icon: React.ComponentType<any>;
  label: string;
}

interface DeliveryOrderDetailsProps {
  openDetails: boolean;
  setOpenDetails: (open: boolean) => void;
  deliveryDetails: DeliveryDetails | null;
  deliveryStatuses: DeliveryStatus[];
  isMobile?: boolean;
}

const DeliveryOrderDetails: React.FC<DeliveryOrderDetailsProps> = ({
  openDetails,
  setOpenDetails,
  deliveryDetails,
  deliveryStatuses,
  isMobile = true,
}) => {
  // Get current status index
  const currentStatusIndex = deliveryStatuses.findIndex(
    (s) => s.status === deliveryDetails?.status,
  );

  const content = (
    <div className="flex flex-col">
      {/* Close button */}
      {isMobile && (
        <div className="sticky top-0 bg-white pb-2 z-10">
          <button
            onClick={() => setOpenDetails(false)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Status Progress */}
      <div className="flex items-center justify-between mt-5 border-b pb-3 border-gray-200">
        {deliveryStatuses.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = index <= currentStatusIndex;

          return (
            <div
              key={item.status}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={`p-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <IconComponent className="h-7 w-7" />
              </span>
              <span
                className={`text-xs ${isActive ? "text-gray-800" : "text-gray-400"}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Customer Information */}
      <h1 className="flex items-center gap-2 my-3 text-gray-800">
        <UserRound className="text-orange-500 h-5 w-5" />
        Customer Information
      </h1>
      <div className="shadow-sm border border-gray-200 rounded-lg p-3 bg-white">
        <h1 className="text-gray-800 font-medium">
          {deliveryDetails?.shippingFullName || "N/A"}
        </h1>
        <p className="text-gray-500 text-sm">
          {deliveryDetails?.shippingPhone || "No phone number"}
        </p>
      </div>

      {/* Order Items */}
      <h1 className="flex items-center gap-2 my-3 text-gray-800">
        <ClipboardPen className="text-orange-500 h-5 w-5" />
        Items
      </h1>
      <div className="flex flex-col shadow-sm border border-gray-200 rounded-lg p-3 bg-white">
        {deliveryDetails?.items?.length ? (
          deliveryDetails.items.map((item) => {
            const price = (item.priceAtPurchase || 0) * (item.quantity || 0);
            const productName =
              item?.variant?.product?.name || "Unknown Product";
            const imageUrl =
              item?.variant?.product?.images?.[0]?.url || "/placeholder.png";

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 mt-2 border-b border-gray-100 pb-3 last:border-b-0"
              >
                <img
                  src={imageUrl}
                  alt={productName}
                  className="h-16 w-16 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <h1 className="font-semibold text-gray-800 truncate">
                    {productName}
                  </h1>
                  {item?.variant?.size && (
                    <p className="text-xs text-gray-500">
                      Size: {item.variant.size}
                    </p>
                  )}
                  {item?.variant?.color && (
                    <p className="text-xs text-gray-500">
                      Color: {item.variant.color}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <p className="text-gray-600 text-sm whitespace-nowrap">
                    <span className="text-xs text-gray-400">×</span>
                    {item.quantity || 0}
                  </p>
                  <p className="text-green-600 text-sm font-medium whitespace-nowrap min-w-[60px] text-right">
                    AFN {price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">
            No items in this order
          </p>
        )}

        {/* Total Amount */}
        <div className="flex items-center justify-between py-2 mt-3 border-t border-gray-200">
          <h1 className="text-gray-800 font-medium">Total Amount</h1>
          <h1 className="text-gray-800 font-medium">
            <span className="text-orange-500 text-sm mr-1">AFN</span>
            {deliveryDetails?.total || "0"}
          </h1>
        </div>
      </div>
    </div>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <div
        className={`lg:hidden flex flex-col fixed bg-white bottom-0 left-0 w-full h-[90vh] overflow-y-auto rounded-t-2xl p-4 transform transition-all duration-300 ease-out z-50 shadow-2xl
          ${openDetails ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}`}
      >
        {content}
      </div>
    );
  }

  // Desktop: Regular container
  return (
    <div className="bg-white rounded-lg p-4 h-[calc(100vh-2rem)] overflow-y-auto border border-gray-200 shadow-sm">
      {content}
    </div>
  );
};

export default DeliveryOrderDetails;

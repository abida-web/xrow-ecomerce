"use client";

import DeliveryOrderDetails from "@/app/(seller)/dashboard/_components/DeliveryOrderDetails";
import {
  driverDeliveries,
  getDeliveryDetails,
  updateStatus,
} from "@/app/actions/order-actions";
import { order } from "@/drizzle/schema";
import { authClient } from "@/lib/auth-client";
import { badgeColorApplier } from "@/lib/helper-functions";
import {
  ChevronRight,
  CircleCheck,
  ClipboardPen,
  List,
  MapPin,
  Motorbike,
  Package,
  PackageCheck,
  Truck,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderWithDate {
  driverId: string | null;
  id: string;
  userId: string | null;
  organizationId: string;
  status: string | null;
  subtotal: string | null;
  total: string | null;
  shippingFullName: string | null;
  shippingPhone: string | null;
  shippingEmail: string | null;
  shippingCountry: string | null;
  shippingProvince: string | null;
  shippingCity: string | null;
  shippingStreetAddress: string | null;
  shippingPostalCode: string | null;
  createdAt: Date | null;
  driver: {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  } | null;
}

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

const deliveryStatuses = [
  {
    status: "preparing",
    icon: Package,
    label: "Preparing",
  },
  {
    status: "ready_for_pickup",
    icon: PackageCheck,
    label: "Ready for Pickup",
  },
  {
    status: "out_for_delivery",
    icon: Truck,
    label: "Out for Delivery",
  },
  {
    status: "delivered",
    icon: CircleCheck,
    label: "Delivered",
  },
];

const DeliveriesPage = () => {
  const params = useParams();
  const driverId = params.driverId as string;
  const storeslug = params.storeslug as string;
  const [deliveriesList, setDeliveriesList] = useState<OrderWithDate[]>([]);
  const [selectOrderId, setSelectOrderId] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<
    DeliveryDetails | null | any
  >(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  async function fetchDeliveries() {
    try {
      setLoading(true);
      const res = await driverDeliveries(storeslug, driverId);
      setDeliveriesList(res || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch deliveries");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetails() {
    if (!selectOrderId) return;

    try {
      setLoading(true);
      const res = await getDeliveryDetails(selectOrderId);
      setDeliveryDetails(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch delivery details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (storeslug && driverId) {
      fetchDeliveries();
    }
  }, [storeslug, driverId]);

  useEffect(() => {
    fetchDetails();
  }, [selectOrderId]);

  async function handleUpdateStatus(status: string, orderId: string) {
    try {
      await updateStatus({ status, orderId, storeslug });
      toast.success("Delivery status updated!");
      fetchDeliveries();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl flex items-center gap-2 flex-wrap text-gray-800">
        Today's Deliveries
        <span className="bg-orange-500 text-white text-sm px-2 rounded-full">
          {deliveriesList.length}
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
        {/* Orders List */}
        <div className="flex flex-col gap-4 sm:gap-5 mt-5">
          {deliveriesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
              <Package className="h-16 w-16 mb-4" />
              <p className="text-lg">No deliveries assigned yet</p>
            </div>
          ) : (
            deliveriesList.map((order) => (
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm bg-white rounded-lg p-4 sm:p-5 gap-4 border border-gray-200"
                key={order.id}
              >
                <div className="flex gap-3 sm:gap-5 items-center w-full sm:w-auto">
                  <div className="text-orange-500 rounded-full bg-orange-100 px-3 py-5 flex-shrink-0">
                    <Truck className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span
                      className={`text-xs px-3 py-0.5 w-fit rounded-full ${badgeColorApplier(order.status || "")}`}
                    >
                      {order.status?.replace(/_/g, " ") || "Unknown"}
                    </span>
                    <h1 className="text-base sm:text-lg truncate text-gray-800">
                      Order #{order.id.slice(0, 10)}
                    </h1>
                    <p className="flex text-xs items-center gap-1 text-gray-500 truncate">
                      <User size={15} className="flex-shrink-0" />
                      {order.driver?.name || "Unassigned"}
                    </p>
                    <p className="flex text-xs items-center gap-1 text-gray-500 truncate">
                      <MapPin size={15} className="flex-shrink-0" />
                      <span className="truncate">
                        {[
                          order.shippingStreetAddress,
                          order.shippingCity,
                          order.shippingCountry,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <h1 className="text-green-600 text-sm sm:text-base whitespace-nowrap font-medium">
                    {activeOrganization?.currency} {order.total || "0"}
                  </h1>
                  <button
                    onClick={() => {
                      setSelectOrderId(order.id);
                      setOpenDetails(true);
                    }}
                    className={`py-1.5 text-sm px-3 transition-all duration-300 cursor-pointer hover:scale-105 rounded-lg flex justify-between items-center gap-2 whitespace-nowrap ${
                      order.status === "delivered"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    {order.status === "delivered" ? "View" : "Start delivery"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: Side Panel */}
        <div className="hidden lg:block">
          {openDetails && (
            <div className="sticky top-4">
              <DeliveryOrderDetails
                openDetails={openDetails}
                setOpenDetails={setOpenDetails}
                deliveryDetails={deliveryDetails}
                deliveryStatuses={deliveryStatuses}
                isMobile={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Bottom Sheet */}
      <DeliveryOrderDetails
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
        deliveryDetails={deliveryDetails}
        deliveryStatuses={deliveryStatuses}
        isMobile={true}
      />
    </div>
  );
};

export default DeliveriesPage;

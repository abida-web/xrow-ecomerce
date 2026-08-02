"use client";

import { assignDriver, updateStatus } from "@/app/actions/order-actions";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClipboardPaste, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// Define types
interface Order {
  id: string;
  customer: string;
  itemCount: number;
  total: number;
  status: string;
  date: string;
  items?: any[];
}

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string | null;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

const OrdersPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectStatus, setSelectStatus] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedQuery] = useDebouncedValue(searchTerm, {
    wait: 500,
  });

  const { data, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["orders", storeslug, selectStatus, debouncedQuery, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/orders?slug=${storeslug}&search=${debouncedQuery}&status=${selectStatus}&page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return await response.json();
    },
    enabled: !!storeslug,
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      status,
      orderId,
    }: {
      status: string;
      orderId: string;
    }) => {
      return updateStatus({ status, orderId });
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update order status");
    },
  });

  const assignDriverMutation = useMutation({
    mutationFn: async ({
      driverId,
      orderId,
    }: {
      driverId: string;
      orderId: string;
    }) => {
      return assignDriver(orderId, driverId);
    },
    onSuccess: () => {
      toast.success("Driver assigned successfully");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to assign driver");
    },
  });

  const handleUpdateStatus = ({
    status,
    orderId,
  }: {
    status: string;
    orderId: string;
  }) => {
    updateMutation.mutate({ status, orderId });
  };

  const handleDriverAssign = ({
    driverId,
    orderId,
  }: {
    driverId: string;
    orderId: string;
  }) => {
    if (!driverId) {
      toast.error("Please select a driver");
      return;
    }
    assignDriverMutation.mutate({ driverId, orderId });
  };

  const statuses = useMemo(() => {
    if (!data) return ["All"];
    return ["All", ...new Set(data.map((order: Order) => order.status))];
  }, [data]);

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const transformedDrivers = useMemo(() => {
    if (!activeOrganization?.members) return [];

    return activeOrganization.members.map((member: any) => ({
      id: member.id,
      userId: member.userId,
      name: member.user?.name || "N/A",
      email: member.user?.email || "N/A",
      role: member.role,
      createdAt: member.createdAt,
      image: member.user?.image,
    }));
  }, [activeOrganization?.members]);

  const drivers = useMemo(() => {
    if (!transformedDrivers) return [];
    return transformedDrivers.filter((member) => member.role === "driver");
  }, [transformedDrivers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Loading orders...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">No orders found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold mt-5">Orders List</h1>

        <div className="flex items-center gap-5">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search product by name, category, status, or price..."
                className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full shadow-xs shadow-orange-500 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            {data && (
              <select
                className="bg-orange-500 px-3 py-2 font-semibold rounded-lg text-white"
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}
              >
                {statuses.map((sta: string, i: number) => (
                  <option
                    className="bg-white text-black"
                    key={i}
                    value={sta === "All" ? "" : sta}
                  >
                    {sta}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Info</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium text-center">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((order: Order) => {
              return (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 font-mono">
                    <Link
                      href={`/dashboard/${storeslug}/orders/${order.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4">{order.customer || "Guest"}</td>
                  <td className="py-3 px-4">{order.itemCount}</td>
                  <td className="py-3 px-4 text-right">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "AFN",
                    }).format(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus({
                          status: e.target.value,
                          orderId: order.id,
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColorApplier(
                        order.status,
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {order.status === "ready_for_pickup" && (
                      <div className="flex items-center gap-2">
                        <ClipboardPaste className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <select
                          onChange={(e) =>
                            handleDriverAssign({
                              driverId: e.target.value,
                              orderId: order.id,
                            })
                          }
                          defaultValue=""
                          className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="" disabled>
                            Select driver
                          </option>
                          {drivers?.map((driver) => (
                            <option key={driver.id} value={driver.userId}>
                              {driver.name}
                            </option>
                          ))}
                          {drivers.length === 0 && (
                            <option value="" disabled>
                              No drivers available
                            </option>
                          )}
                        </select>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination controls - optional */}
      {data && data.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-white/60">
            Showing {data.length} orders
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

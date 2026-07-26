"use client";

import { updateStatus } from "@/app/actions/order-actions";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
const OrdersPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectStatus, setSelectStatus] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedQuery] = useDebouncedValue(searchTerm, {
    wait: 500, // Wait 500ms after last change
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", storeslug, selectStatus, debouncedQuery, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/orders?slug=${storeslug}&search=${debouncedQuery}&status=${selectStatus}&page=${page}`,
      );
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
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update order status:", error);
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

  const statuses = useMemo(() => {
    return ["All", ...new Set(data?.map((order: any) => order.status))];
  }, [data]);

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
      <div className="flex flex-wrap  justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold mt-5">Orders List</h1>

        <div className=" flex items-center gap-5">
          <div className=" flex gap-4 items-center">
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
                className=" bg-orange-500 px-3 py-2 font-semibold rounded-lg text-white"
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}
              >
                {statuses.map((sta: any, i: number) => (
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
            {data?.map((order: any) => {
              return (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
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
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
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
                    <Link
                      href={`/dashboard/${storeslug}/orders/${order.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;

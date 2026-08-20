"use client";

import { getCustomers } from "@/app/actions/order-actions";
import { Search, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
interface CustomerProps {
  customer: string;
  email: string;
  orders: number;
  phone: string | null;
  total: number;
  lastOrderDate: Date | null;
}
const CustomersPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [customers, setCustomers] = useState<CustomerProps[] | []>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });
  async function fetchCustomers() {
    const res = await getCustomers(storeslug, debouncedSearch);
    setCustomers(res);
  }
  useEffect(() => {
    if (!storeslug) return;
    fetchCustomers();
  }, [storeslug, debouncedSearch]);
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers List</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search customer by name, email, phone..."
            className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-full border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left rounded-lg">
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Total orders
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Total spent
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Last Order Date
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((cus: any) => (
              <tr
                key={cus.customer}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {cus.customer}
                </td>
                <td className="px-4 py-3 text-gray-600">{cus.email}</td>
                <td className="px-4 py-3 text-gray-600">{cus.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{cus.orders}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">
                  AFN {cus.total?.toLocaleString() || "0"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {cus.lastOrderDate
                    ? new Date(cus.lastOrderDate).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;

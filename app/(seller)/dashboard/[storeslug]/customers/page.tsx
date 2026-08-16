"use client";

import { getCustomers } from "@/app/actions/order-actions";
import { Search, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  async function fetchCustomers() {
    const res = await getCustomers(storeslug, search);
    setCustomers(res);
  }
  useEffect(() => {
    fetchCustomers();
  }, [search]);
  return (
    <div>
      <div className=" flex items-center justify-between py-4 ">
        <h1 className=" text-2xl ">Customers List</h1>
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search customer by name, email, phone..."
            className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full shadow-xs shadow-orange-500 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>
      <div className=" bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10 rolg">
            <tr className="text-left rounded-lg">
              <th className="px-4 py-3 font-medium"> Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium"> Phone</th>
              <th className="px-4 py-3 font-medium">Total orders</th>
              <th className="px-4 py-3 font-medium">Total spent</th>
              <th className="px-4 py-3 font-medium">Last Order Date</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((cus: any) => (
              <tr
                key={cus.customer}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">{cus.customer}</td>
                <td className="px-4 py-3">{cus.email}</td>
                <td className="px-4 py-3">{cus.phone}</td>
                <td className="px-4 py-3">{cus.orders}</td>
                <td className="px-4 py-3">{cus.total}</td>
                <td className="px-4 py-3">
                  {new Date(cus.lastOrderDate).toLocaleDateString()}
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

"use client";

import { totalDashboardOperation } from "@/app/actions/dashboard";
import {
  ShoppingBag,
  UsersRound,
  Wallet,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { badgeColorApplier } from "@/lib/helper-functions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const StorePage = () => {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const storeslug = String(params.storeslug);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await totalDashboardOperation(storeslug);
      setDashboardData(res);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeslug]);

  // Chart Configuration
  const chartLabels =
    dashboardData?.salesOverviewData?.map((item: any) => item.date) || [];
  const chartValues =
    dashboardData?.salesOverviewData?.map((item: any) => item.revenue) || [];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Monthly Sales (AFN)",
        data: chartValues,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(251, 146, 60, 0.3)");
          gradient.addColorStop(1, "rgba(251, 146, 60, 0)");
          return gradient;
        },
        borderColor: "#FB923C",
        pointBorderColor: "#fff",
        borderWidth: 3,
        pointBackgroundColor: "#FB923C",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151",
          font: { size: 12, weight: "500" },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1F2937",
        bodyColor: "#6B7280",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            return `AFN ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
          callback: function (value: any) {
            return "AFN " + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  // Stat Cards Configuration
  const statCards = [
    {
      title: "Total Revenue",
      value: `AFN ${Number(dashboardData?.totalRevenue).toLocaleString()}`,
      icon: Wallet,
      color: "orange",
      gradient: "from-orange-50 to-orange-100/50",
    },
    {
      title: "Total Orders",
      value: Number(dashboardData?.totalOrders).toLocaleString(),
      icon: ShoppingBag,
      color: "blue",
      gradient: "from-blue-50 to-blue-100/50",
    },
    {
      title: "Total Customers",
      value: Number(dashboardData?.totalCustomers).toLocaleString(),
      icon: UsersRound,
      color: "emerald",
      gradient: "from-emerald-50 to-emerald-100/50",
    },
    {
      title: "Products",
      value: Number(dashboardData?.productsCount?.length || 0).toLocaleString(),
      icon: Package,
      color: "purple",
      gradient: "from-purple-50 to-purple-100/50",
    },
  ];

  const colorMap = {
    orange: "bg-orange-500 hover:bg-orange-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`group bg-gradient-to-br ${stat.gradient} border border-gray-200 bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${colorMap[stat.color as keyof typeof colorMap]} transition-colors duration-300 shadow-lg shadow-${stat.color}-500/20`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart & Inventory Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Monthly Sales Performance
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Last {chartLabels.length} months
            </span>
          </div>
          <div className="h-[300px]">
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Inventory Alerts
            </h2>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {dashboardData?.tenLowStack?.length > 0 ? (
              dashboardData.tenLowStack.map((ord: any) => (
                <div
                  key={ord.id}
                  className="flex items-center gap-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 hover:bg-amber-50 transition-colors duration-200"
                >
                  <img
                    src={ord.image}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    alt={ord.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {ord?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">Stock:</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {ord?.stock} left
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                All products are well-stocked! 🎉
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Top Products
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Best selling items this month
            </p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {dashboardData?.topProducts?.length || 0} products
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {dashboardData?.topProducts?.map((order: any, index: number) => {
            const rankColors = [
              "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-yellow-500/30",
              "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-400/30",
              "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-amber-600/30",
              "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600",
            ];
            return (
              <div
                key={order.productId}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-100/50"
              >
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${rankColors[index] || rankColors[3]}`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden h-48 bg-gradient-to-b from-gray-50 to-gray-100">
                  <img
                    src={order?.image}
                    alt={order.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-200 shadow-sm flex items-center gap-1.5">
                    <span className="text-orange-500">🛒</span>
                    {order.orderCount} sold
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-gray-800 font-medium text-sm line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[40px]">
                    {order.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <p className="text-orange-600 font-bold text-lg">
                      AFN {Number(order.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-gray-400">In stock</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(!dashboardData?.topProducts ||
          dashboardData.topProducts.length === 0) && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No products found</p>
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Info</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Order</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Items</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Total
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.recentOrders?.map((order: any) => {
              return (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono">
                    <Link
                      href={`/dashboard/${storeslug}/orders/${order.id}`}
                      className="text-orange-500 hover:text-orange-600 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-600">
                    #{order.id.slice(0, 10)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {order.customer || "Guest"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.itemCount}</td>
                  <td className="py-3 px-4 text-right text-gray-700 font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "AFN",
                    }).format(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColorApplier(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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

export default StorePage;

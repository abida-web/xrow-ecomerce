"use client";

import { totalDashboardOperation } from "@/app/actions/dashboard";
import { ShoppingBag, UsersRound, Wallet } from "lucide-react";
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
} from "chart.js";
import { useEffect, useState } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
const StorePage = () => {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const params = useParams();
  const storeslug = String(params.storeslug);
  const fetchData = async () => {
    const res = await totalDashboardOperation(storeslug);
    setDashboardData(res);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const chartLabels = dashboardData?.salesOverviewData.map(
    (item: any) => item.date,
  );
  const chartValues = dashboardData?.salesOverviewData.map(
    (item: any) => item.revenue,
  );
  const data = {
    labels: chartLabels, // Passed here

    datasets: [
      {
        label: "Monthly Sales (AFN)",
        data: chartValues, // Passed here
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "oklch(70.5% 0.213 47.604)",
        pointBorderColor: "white",
        borderWidth: 1,
        pointBackgroundColor: "oklch(70.5% 0.213 47.604)",
        pointBorderWidth: 2,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Performance",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Lighter gray for dark bg
          lineWidth: 1,
        },
        ticks: {
          color: "#9CA3AF", // Lighter gray text
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Lighter gray for dark bg
          lineWidth: 1,
        },
        ticks: {
          color: "#9CA3AF", // Lighter gray text
        },
      },
    },
  };
  return (
    <div>
      <h1 className=" text-2xl">Overview</h1>
      <div className=" flex items-center justify-between gap-5 mt-5">
        <div className="flex items-center gap-3 border border-gray-700 w-full bg-white/10 p-5 rounded-lg ">
          <span className="bg-orange-500 p-2 rounded-lg">
            <Wallet className="w-8 h-8 " />
          </span>
          <h1 className="flex flex-col gap-1">
            <span className=" text-gray-300 text-sm">Total Revenue</span>
            <span className=" text-orange-500 font-semibold">
              AFN {Number(dashboardData?.totalRevenue).toLocaleString()}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3 border border-gray-700 w-full bg-white/10 p-5 rounded-lg ">
          <span className="bg-orange-500 p-2 rounded-lg">
            <ShoppingBag className="w-8 h-8 " />
          </span>
          <h1 className="flex flex-col gap-1">
            <span className=" text-gray-300 text-sm">Orders</span>
            <span className=" text-orange-500 font-semibold">
              {Number(dashboardData?.totalOrders).toLocaleString()}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3 border border-gray-700 w-full bg-white/10 p-5 rounded-lg ">
          <span className="bg-orange-500 p-2 rounded-lg">
            <UsersRound className="w-8 h-8 " />
          </span>
          <h1 className="flex flex-col gap-1">
            <span className=" text-gray-300 text-sm">Customers</span>
            <span className=" text-orange-500 font-semibold">
              {Number(dashboardData?.totalCustomers).toLocaleString()}
            </span>
          </h1>
        </div>
      </div>
      <div className="flex tems-center md;flex-col  gap-5">
        <div className="bg-white/10 mt-4 p-5 rounded-xl w-full h-full">
          <Line data={data} options={options} />
        </div>
        <div className="bg-white/10 mt-4 p-5 rounded-xl w-150 overflow-y-auto">
          <h1 className=" text-xl">Inventory Alerts</h1>
          <div className="flex flex-col gap-3 mt-5">
            {dashboardData?.tenLowStack.map((ord: any) => (
              <div key={ord.id} className=" flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src={ord.image}
                    className="h-15 w-15 object-cover rounded-lg"
                  />
                  <p>{ord?.name}</p>
                </div>
                <h1 className=" text-orange-500">{ord?.stock} left</h1>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 mt-4 p-5 rounded-xl">
        <h1 className=" text-xl">Top Products</h1>
        <div className="mt-8">{/* Section Header */}</div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {dashboardData?.topProducts.map((order: any, index: number) => (
            <div
              key={order.productId}
              className="group relative bg-gray-800/50 rounded-xl overflow-hidden 
                   border border-gray-700 hover:border-green-500/50 
                   transition-all duration-300 hover:scale-105 hover:shadow-xl 
                   hover:shadow-green-500/10"
            >
              {/* Rank Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                          font-bold text-sm
                          ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                  ? "bg-amber-700 text-white"
                                  : "bg-gray-700 text-gray-300"
                          }`}
                >
                  #{index + 1}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative overflow-hidden h-48 bg-gray-900">
                <img
                  src={order?.image}
                  alt={order.name}
                  className="w-full h-full object-cover group-hover:scale-110 
                       transition-transform duration-300"
                />
                {/* Order Count Badge */}
                <div
                  className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm 
                          px-3 py-1 rounded-full text-xs text-white border 
                          border-white/10"
                >
                  🛒 {order.orderCount} sold
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3
                  className="text-white font-medium text-sm line-clamp-2 
                         group-hover:text-green-400 transition-colors"
                >
                  {order.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-green-500 font-bold ">AFN {order.price}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span
                      className="inline-block  w-2 h-2 rounded-full bg-green-500 
                               animate-pulse"
                    />
                    Available
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;

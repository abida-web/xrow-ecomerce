import { Clipboard, Package, Store } from "lucide-react";
import React from "react";

interface TopStores {
  name: string;
  totalProduct: number;
  totalOrders: number;
}

const PopularStores = ({
  topStores,
  loading,
}: {
  topStores: TopStores[];
  loading: boolean;
}) => {
  if (loading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 px-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 animate-pulse flex items-center gap-5 shadow-sm"
          >
            <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-20 sm:h-20"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="sm:px-4">
      <h1 className="text-xl sm:text-2xl py-4 sm:py-5 font-bold text-gray-800">
        Popular Stores
      </h1>

      {/* Desktop Grid - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {topStores.map((store, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300"
          >
            <span className="bg-orange-100 text-orange-600 p-4 rounded-full flex-shrink-0">
              <Store className="w-8 h-8" />
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-semibold text-gray-800 truncate">
                {store.name}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Package size={14} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-600">
                  {store.totalProduct} Products
                </span>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Clipboard
                  size={14}
                  className="text-orange-500 flex-shrink-0"
                />
                <span className="text-gray-600">
                  {store.totalOrders} Orders
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll - Visible only on mobile/tablet */}
      <div className="md:hidden flex items-center gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
        {topStores.map((store, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white min-w-[200px] sm:min-w-[220px]"
          >
            <span className="bg-orange-100 text-orange-600 p-3 rounded-full flex-shrink-0">
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-semibold text-gray-800 text-sm truncate">
                {store.name}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Package size={12} className="text-orange-500 flex-shrink-0" />
                <span className="text-gray-600">
                  {store.totalProduct} Products
                </span>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Clipboard
                  size={12}
                  className="text-orange-500 flex-shrink-0"
                />
                <span className="text-gray-600">
                  {store.totalOrders} Orders
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularStores;

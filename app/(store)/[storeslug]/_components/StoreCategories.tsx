"use client";

import { getStoreRelatedCategories } from "@/app/actions/individualStore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Loader2 } from "lucide-react";

// Type definitions
interface Category {
  id: string;
  name: string;
  organizationId: string | null;
  icon: any;
  globalCategoryId: string | null;
}

const StoreCategories = ({ storeslug }: { storeslug: string }) => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["store-categories", storeslug],
    queryFn: () => getStoreRelatedCategories(storeslug),
    enabled: !!storeslug, // Only run if storeslug exists
  });

  // Get icon component with fallback
  const getIconComponent = (iconName: string) => {
    if (!iconName) return Icons.Circle;

    // Try to get the icon from Lucide
    const IconComponent = (Icons as any)[iconName];

    // Return the icon or a fallback
    return IconComponent || Icons.Circle;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="bg-red-50 rounded-lg p-4 max-w-md w-full">
          <p className="text-red-600 text-sm text-center">
            Failed to load categories
          </p>
          <p className="text-red-400 text-xs text-center mt-1">
            {error?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 mx-auto block text-sm text-orange-500 hover:text-orange-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Icons.Package className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No categories available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-black items-center">
      <h1 className="text-2xl font-semibold mb-4">SHOP BY CATEGORY</h1>
      <div className="flex gap-4 sm:gap-5 items-center overflow-x-auto pb-4 w-full px-4">
        {categories.map((cat: Category) => {
          const IconComponent = getIconComponent(cat?.icon && cat.icon);

          return (
            <Link
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              key={cat.id}
              className="flex flex-col items-center p-2 rounded-full transition-all duration-300 cursor-pointer group min-w-[80px] sm:min-w-[100px] bg-white hover:bg-orange-50 flex-shrink-0"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors group-hover:bg-orange-200">
                <IconComponent className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 text-center whitespace-nowrap transition-colors group-hover:text-orange-600">
                {cat.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StoreCategories;

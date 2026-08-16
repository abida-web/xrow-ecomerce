"use client";

import { getCategories } from "@/app/actions/product-actions";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  createdAt: Date | null;
  icon: string | null;
}

const CategoriesPage = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCategoriesList() {
    try {
      setIsLoading(true);
      const res = await getCategories();
      setCategoriesList(res);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const getIconName = (name: string | null) => {
    const IconComponent = (Icons as any)[name || ""];
    return IconComponent || Icons.Circle;
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="h-10 w-72 bg-gray-700/30 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-96 bg-gray-700/30 rounded-lg animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-700/20 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Discover Our Full Categories
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Browse categories filled with exciting topics and new skills
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categoriesList.map((cat, index) => {
            const IconComponent = getIconName(cat.icon);
            return (
              <Link
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                key={cat.id}
                className="group relative flex flex-col items-center p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/0 rounded-2xl transition-all duration-500" />

                {/* Icon container */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Category name */}
                <h3 className="text-sm md:text-base font-medium text-gray-300 group-hover:text-white transition-colors duration-300 text-center">
                  {cat.name}
                </h3>

                {/* Decorative line */}
                <div className="w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-12 transition-all duration-500 mt-2 rounded-full" />
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {categoriesList.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <Icons.FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">
              No categories found
            </h3>
            <p className="text-gray-500 mt-2">
              Categories will appear here once added
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

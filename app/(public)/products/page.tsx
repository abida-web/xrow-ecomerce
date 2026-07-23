"use client";
export const dynamic = "force-dynamic";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import ProductCard from "../_components/ProductCard";
import { useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectPriceRange, setSelectPriceRange] = useState("all");
  const [page, setPage] = useState(1);
  const getQueryParams = () => {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (searchTerm) params.append("search", searchTerm);
    if (selectCategory) params.append("category", selectCategory);
    if (selectPriceRange === "low") {
      params.append("maxPrice", "100");
    } else if (selectPriceRange === "medium") {
      params.append("minPrice", "100");
      params.append("maxPrice", "500");
    } else if (selectPriceRange === "high") {
      params.append("minPrice", "500");
    }
    return params.toString(); // Fixed: was missing return
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", searchTerm, selectCategory, selectPriceRange, page], // Fixed: use actual values not objects
    queryFn: async () => {
      const response = await fetch(`/api/public/products?${getQueryParams()}`);
      return await response.json();
    },
  });

  // Fixed: safely get categories
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];
    const categorySet = new Set();
    data.forEach((p: any) => {
      if (p.category) {
        categorySet.add(p.category);
      }
    });
    return Array.from(categorySet);
  }, [data]);
  const getUniqueProducts = (product: any) => {
    const seen = new Set();
    return product.filter((p: any) => {
      const dub = seen.has(p.id);
      seen.add(p.id);
      return !dub;
    });
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-orange-500">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl py-5 font-bold">
        {searchTerm ? `Results for "${searchTerm}"` : "Find all you need"}
      </h1>

      {searchTerm && data && (
        <p className="text-gray-400 mb-4">
          Found {data.length} product{data.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-5 items-center">
        <select
          className="bg-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={selectCategory}
          onChange={(e) => setSelectCategory(e.target.value)}
        >
          <option className="bg-black" value="">
            All Categories
          </option>
          {categories.map((cat: any, i: number) => (
            <option className="bg-black" key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="bg-white/20 px-5 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={selectPriceRange}
          onChange={(e) => setSelectPriceRange(e.target.value)}
        >
          <option className="bg-black" value="all">
            All Prices
          </option>
          <option className="bg-black" value="low">
            Low ($0 - $100)
          </option>
          <option className="bg-black" value="medium">
            Medium ($100 - $500)
          </option>
          <option className="bg-black" value="high">
            High ($500+)
          </option>
        </select>

        {/* Clear filters button */}
        {(selectCategory || selectPriceRange !== "all" || searchTerm) && (
          <button
            onClick={() => {
              setSelectCategory("");
              setSelectPriceRange("all");
            }}
            className="text-orange-500 hover:text-orange-400 text-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No products found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {data.map((product: any, i: number) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          Previous
        </button>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;

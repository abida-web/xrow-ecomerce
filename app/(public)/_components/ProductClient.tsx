"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import ProductCard from "../_components/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  FilterX,
  LoaderCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useDebounce } from "use-debounce";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchTerm = searchParams.get("search");
  const [selectCategory, setSelectCategory] = useState(categoryParam || "");
  const [sortBy, setSortBy] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStockOption, setSelectedStockOption] = useState("INSTOCK");
  const [selectPriceRange, setSelectPriceRange] = useState({
    min: 0,
    max: 10000,
  });
  const [page, setPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);
  const [debouncedPriceRange] = useDebounce(selectPriceRange, 500);

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (searchTerm) params.append("search", searchTerm);
    if (selectCategory) params.append("category", selectCategory);
    if (sortBy === "low") {
      params.append("maxPrice", "100");
    } else if (sortBy === "medium") {
      params.append("minPrice", "100");
      params.append("maxPrice", "500");
    } else if (sortBy === "high") {
      params.append("minPrice", "500");
    } else if (sortBy === "newest") {
      params.append("sort", "newest");
    } else if (
      (debouncedPriceRange && debouncedPriceRange.min > 0) ||
      (debouncedPriceRange && debouncedPriceRange.max <= 10000)
    ) {
      params.append("minPrice", String(debouncedPriceRange.min));
      params.append("maxPrice", String(debouncedPriceRange.max));
    }
    if (selectedStockOption === "INSTOCK") {
      params.append("in-stock", "true");
    } else if (selectedStockOption === "OUTOFSTOCK") {
      params.append("out-of-stock", "true");
    }
    if (selectedBrand) {
      params.append("brand", selectedBrand);
    }
    return params.toString();
  }, [
    page,
    searchTerm,
    selectCategory,
    sortBy,
    debouncedPriceRange,
    selectedStockOption,
    selectedBrand,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "products",
      searchTerm,
      selectCategory,
      sortBy,
      page,
      selectedBrand,
      selectedStockOption,
      debouncedPriceRange.max,
      debouncedPriceRange.min,
    ],
    queryFn: useCallback(async () => {
      const response = await fetch(`/api/public/products?${getQueryParams()}`);
      return await response.json();
    }, [getQueryParams]),
  });

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

  const brands = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map((p: any) => p.brand).filter(Boolean))];
  }, [data]);

  const hasActiveFilters =
    selectCategory ||
    sortBy !== "all" ||
    searchTerm ||
    selectedBrand ||
    selectedStockOption !== "INSTOCK" ||
    selectPriceRange.min > 0 ||
    selectPriceRange.max < 10000;

  if (isLoading)
    return (
      <div className="flex justify-center mt-30 items-center min-h-[200px]">
        <div className="text-orange-500 animate-spin">
          <LoaderCircle />
        </div>
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
      <h1 className="text-2xl py-5 font-bold text-gray-800">
        {searchTerm ? `Results for "${searchTerm}"` : "Find all you need"}
      </h1>

      {searchTerm && data && (
        <p className="text-gray-500 mb-4">
          Found {data.length} product{data.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="flex flex-wrap gap-3 items-center mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Filter Toggle Button */}
        <button
          onClick={() => setOpenFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all duration-300"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* Category Select */}
        <div className="relative group">
          <select
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 appearance-none pr-8 hover:bg-gray-100 transition-colors"
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat: any, i: number) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort Select */}
        <div className="relative group">
          <select
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 appearance-none pr-8 hover:bg-gray-100 transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="all">Sort by</option>
            <option value="newest">Newest</option>
            <option value="low">Low ($0 - $100)</option>
            <option value="medium">Medium ($100 - $500)</option>
            <option value="high">High ($500+)</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSelectCategory("");
              setSortBy("all");
              setSelectPriceRange({ min: 0, max: 10000 });
              setSelectedStockOption("INSTOCK");
              setSelectedBrand("");
              setPage(1);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 text-sm"
          >
            <FilterX size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {data.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              brand={product.brand}
              description={product.description}
              category={product.category}
              price={product.price}
              stock={product.stock}
              comparePriceAt={product.comparePriceAt}
              organizationName={product.organizationName}
              organizationLogo={product.organizationLogo}
              images={product.images}
            />
          ))}
        </div>
      )}

      {openFilters && (
        <div className="flex flex-col bg-white text-gray-800 fixed top-0 left-0 w-60 h-full p-4 shadow-2xl border-r border-gray-200">
          <button
            onClick={() => setOpenFilters(false)}
            className="absolute right-5 top-4 text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <div className="w-full max-w-xs mt-10 flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-4">
              Price range
            </label>
            <input
              type="range"
              min={0}
              max={10000}
              value={selectPriceRange.max}
              onChange={(e) => {
                setSelectPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
              }}
              className="range range-xs accent-orange-500"
              step="1"
            />
            <div className="flex justify-between px-2.5 mt-2 text-xs text-gray-600">
              <span>{selectPriceRange.min}</span>
              <span>{selectPriceRange.max.toLocaleString()} AFN</span>
            </div>

            <label className="text-sm font-semibold text-gray-700 mt-4">
              Availability
            </label>
            <button
              onClick={() => setSelectedStockOption("INSTOCK")}
              className={`flex items-center mt-3 gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                selectedStockOption === "INSTOCK"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-medium">In Stock</span>
            </button>
            <button
              onClick={() => setSelectedStockOption("OUTOFSTOCK")}
              className={`flex items-center mt-3 gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                selectedStockOption === "OUTOFSTOCK"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-red-500"></span>
              </span>
              <span className="text-sm font-medium">Out of Stock</span>
            </button>

            <h3 className="text-sm font-semibold text-gray-700 mt-4">Brand</h3>
            <div>
              {brands.map((brand: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedBrand(brand)}
                  className={`flex items-center w-full mt-3 gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    selectedBrand === brand
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <span
                    className={`relative flex size-2 ${
                      selectedBrand === brand ? "bg-orange-500" : "bg-gray-300"
                    } rounded-full`}
                  />
                  <span className="text-sm font-medium">{brand}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

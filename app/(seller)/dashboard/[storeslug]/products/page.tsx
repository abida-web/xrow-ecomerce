"use client";

import { getProducts, removeProduct } from "@/app/actions/product-actions";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  costPrice: string | null;
  createdAt: Date | null;
  variants: number;
  price: string[];
  stock: number[];
  image: string[];
  status: string | null;
};

const ProductsPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("all");
  const [selectStatus, setSelectStatus] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchTerm, {
    wait: 500,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "products",
      storeslug,
      debouncedQuery,
      page,
      sortBy,
      selectStatus,
    ],
    queryFn: () =>
      getProducts(storeslug, debouncedQuery, page, 10, sortBy, selectStatus),
    enabled: !!storeslug,
    placeholderData: (previousData) => previousData,
  });

  const router = useRouter();
  const deleteProduct = async (productId: string) => {
    const res = await removeProduct({ storeslug, productId });
    if (res.success) {
      toast.success("Deleted the product");
      refetch();
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };
  const prevPage = () => {
    setPage((prev) => prev - 1);
  };

  const displayProducts = data?.productListData;
  const productsStatuses = useMemo(() => {
    return [...new Set(displayProducts?.map((product) => product.status))];
  }, []);
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No products found. Create your first product!
        </p>
        <Link
          href={`/dashboard/${storeslug}/products/new`}
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Improved Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-orange-500">
            Manage your products, variants and inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-50 pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 appearance-none pr-8 hover:bg-gray-100 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="all">Sort by</option>
              <option value="newest">Newest</option>
              <option value="low">Low ($0 - $100)</option>
              <option value="medium">Medium ($100 - $500)</option>
              <option value="high">High ($500+)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Add Product Button */}
          <Link
            href={`/dashboard/${storeslug}/products/new`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center"
          >
            + Add Product
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-5 text-black ">
        <button
          onClick={() => setSelectStatus("")}
          className={`mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300 ${selectStatus === "" && "bg-orange-500 text-white"}`}
        >
          All
        </button>
        {productsStatuses.map((status: any, i) => (
          <button
            onClick={() => setSelectStatus(status)}
            key={i}
            className={`mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300 ${selectStatus === status && "bg-orange-500 text-white"}`}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">
                Product Name
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Cost</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Date Added
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Variants
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Stock
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts?.map((product: any) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td
                  onClick={() =>
                    router.push(
                      `/dashboard/${storeslug}/products/${product.id}`,
                    )
                  }
                  className="px-4 py-3 font-medium text-gray-800 cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={product.image?.[0]}
                      className="h-10 w-10 rounded-sm object-cover"
                      alt={product.name}
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.costPrice
                    ? `$${parseFloat(product.costPrice).toFixed(2)}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.createdAt ? (
                    <time dateTime={product.createdAt.toString()}>
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {product.variants}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.price.length > 0
                    ? `$${parseFloat(product.price[0]).toFixed(2)}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-medium ${
                      product.stock[0] === 0
                        ? "text-red-500"
                        : product.stock[0] < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {product.stock[0] || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.status || "draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/${storeslug}/products/edit?product=${product.slug}`,
                        )
                      }
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="hover:bg-red-50 text-gray-400 hover:text-red-500 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                page === pageNum
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={nextPage}
          disabled={page === data.totalPages}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;

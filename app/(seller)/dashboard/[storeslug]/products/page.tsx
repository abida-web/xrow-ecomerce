"use client";

import { getProducts, removeProduct } from "@/app/actions/product-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Edit3, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", storeslug, searchTerm, page],
    queryFn: () => getProducts(storeslug, searchTerm, page, 10),
    enabled: !!storeslug,
  });

  const router = useRouter();
  const deleteProduct = async (productId: string) => {
    const res = await removeProduct({ storeslug, productId });
    if (res.success) {
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
  if (!data || !data.productListData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No products found. Create your first product!
        </p>
        <Link
          href={`/dashboard/${storeslug}/products/new`}
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap  justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className=" flex items-center gap-5">
          <div className=" flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search product by name, category, status, or price..."
                className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full shadow-xs shadow-orange-500 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
          <Link
            href={`/dashboard/${storeslug}/products/new`}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Product Name</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Date Added</th>
              <th className="px-4 py-3 font-medium text-center">Variants</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium text-center">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td
                  onClick={() =>
                    router.push(
                      `/dashboard/${storeslug}/products/${product.id}`,
                    )
                  }
                  className="px-4 py-3 font-medium"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src={product.image?.[0]}
                      className="h-10 w-10 rounded-sm object-cover"
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {product.costPrice
                    ? `$${parseFloat(product.costPrice).toFixed(2)}`
                    : "-"}
                </td>
                <td className="px-4 py-3">
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
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                    {product.variants}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {product.price.length > 0
                    ? `$${parseFloat(product.price[0]).toFixed(2)}`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-medium ${
                      product.stock[0] === 0
                        ? "text-red-400"
                        : product.stock[0] < 10
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {product.stock[0] || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      product.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : product.status === "draft"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {product.status || "draft"}
                  </span>
                </td>
                <td className="flex items-center  gap-5">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/products/edit?productId=${product.id}`,
                      )
                    }
                    className=" text-xs flex gap-2 bg-orange-500 hover:bg-orange-600 px-2 py-1 mt-5 rounded-sm  font-medium transition-colors"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className=" hover:bg-red-500/20 p-2 mt-4 transition-all rounded-full"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  : "bg-white/5 hover:bg-white/10 text-gray-400"
              }`}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={nextPage}
          disabled={page === data.totalPages}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;

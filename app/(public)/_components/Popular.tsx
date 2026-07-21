"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProductCard from "./ProductCard";

const Popular = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/public/products");
      return await response.json();
    },
  });

  if (isPending)
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
    <div className="px-4">
      <h1 className="text-2xl py-5 font-bold">Popular Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {data.slice(0, 10).map((product: any, i: number) => (
          <ProductCard product={product} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Popular;

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface TopProduct {
  id: string;
  slug: string;
  image: string | null;
  category: string | null;
  name: string;
  brand: string | null;
  price: string | null;
  stock: number | null;
  comparePrice: string | null;
  owner: string | null;
  totalSold: string | null;
}

const Popular = ({
  topProducts,
  loading,
}: {
  topProducts: TopProduct[];
  loading: boolean;
}) => {
  if (loading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 animate-pulse shadow-sm"
          >
            <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-orange-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="sm:px-4">
      <h1 className="text-2xl py-5 font-bold text-gray-800">
        Popular Products
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {topProducts?.map((product: TopProduct, i: number) => (
          <ProductCard
            key={i}
            {...{
              id: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand || "",
              description: product.name,
              category: product.category || "Uncategorized",
              price: Number(product.price) || 0,
              stock: Number(product.stock) || 0,
              comparePriceAt: Number(product.comparePrice) || 0,
              organizationName: product.owner || "Unknown",
              organizationLogo: product.image || "",
              images: product.image || "/placeholder-image.jpg",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;

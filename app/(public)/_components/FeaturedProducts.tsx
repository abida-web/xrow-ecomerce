import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProductCard from "./ProductCard";

interface FeaturedProduct {
  id: string;
  slug: string;
  image: string;
  category: string | undefined;
  name: string;
  brand: string | null;
  price: string;
  stock: number | null;
  comparePrice: string | null;
  owner: string;
}

const FeaturedProducts = ({
  featuredProduct,
  loading,
}: {
  featuredProduct: FeaturedProduct[];
  loading: boolean;
}) => {
  if (loading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
            <div className="aspect-square bg-white/10 rounded-lg mb-3"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-orange-500/30 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="sm:px-4">
      <h1 className="text-2xl py-5 font-bold">Featured Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {featuredProduct?.map((product: FeaturedProduct, i: number) => (
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

export default FeaturedProducts;

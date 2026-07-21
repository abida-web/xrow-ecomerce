import Link from "next/link";
import React from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  comparePriceAt: number;
  organizationName: string;
  organizationLogo: string;
  images: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Safely get values with fallbacks
  const imageUrl = product.images || "/placeholder-image.jpg";
  const price = Number(product.price || 0);
  const orgName = product.organizationName || "Unknown";
  const orgLogo = product.organizationLogo;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-full bg-white/5 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={product.name || "Product"}
            className="w-full h-60 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <p className="text-xs font-sans text-gray-400 mb-1">
            {product.category || "Uncategorized"}
          </p>

          <h1
            className="text-[17px] font-semibold truncate"
            title={product.name}
          >
            {product.name || "Unnamed Product"}
          </h1>

          {product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}

          <div className="flex items-center gap-3 mt-1">
            <span className="text-orange-500 font-medium">
              <span className="text-xs text-white">afg </span>$
              {price.toFixed(2)}
            </span>
            {product.comparePriceAt && product.comparePriceAt > price && (
              <span className="line-through text-gray-400 text-sm">
                afg {Number(product.comparePriceAt).toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
            {orgLogo ? (
              <img
                src={orgLogo}
                alt={orgName}
                className="h-6 w-6 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {orgName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <p className="text-sm truncate">{orgName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

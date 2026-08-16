import Link from "next/link";
import React from "react";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  comparePriceAt: number;
  organizationName: string;
  organizationLogo: string;
  images: string;
}

const ProductCard = ({
  id,
  name,
  brand,
  stock,
  price,
  comparePriceAt,
  organizationName,
  slug,
  images,
}: ProductCardProps) => {
  const imageUrl = images || "/placeholder-image.jpg";
  const numericPrice = Number(price || 0);
  const comparePrice = Number(comparePriceAt || 0);
  const orgName = organizationName || "Unknown";

  return (
    <Link href={`/products/${slug}`}>
      <div className="relative w-full p-1.5 bg-gradient-to-b from-orange-600 to-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="aspect-square">
          <img
            src={imageUrl}
            alt={name || "Product"}
            className="w-full h-70 object-cover rounded-2xl border-b-8 border-orange-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Price Tag */}
        <span className="font-medium absolute top-0 right-0 text-white bg-orange-500 rounded-l-lg p-1">
          <span className="text-xs text-white">AFN </span>
          {numericPrice.toFixed(2)}
        </span>

        {/* Discount */}
        {comparePrice > numericPrice && (
          <span className="absolute top-8 right-0 text-white bg-red-500 rounded-l-lg p-1 text-xs">
            -{Math.round(((comparePrice - numericPrice) / comparePrice) * 100)}%
            OFF
          </span>
        )}

        {/* Product Info */}
        <div className="flex flex-col flex-grow px-1">
          <h1
            className="text-[18px] font-semibold mt-1 text-gray-200 truncate"
            title={name}
          >
            {name || "Unnamed Product"}
          </h1>

          {brand && <p className="text-xs text-gray-400 mb-1">{brand}</p>}

          {/* Original Price */}
          {comparePrice > numericPrice && (
            <p className="text-sm text-gray-500 line-through">
              AFN {comparePrice.toFixed(2)}
            </p>
          )}
          {stock > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span
                className={`inline-block  w-3 h-3 rounded-full ${stock > 0 ? "bg-green-600" : "bg-red-600"}  animate-pulse`}
              />
              {stock > 0 ? "In Stock" : "Out of Stock"}
            </div>
          )}

          {/* Seller */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <span className="flex gap-2 items-center">
              <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {orgName.slice(0, 1).toUpperCase()}
              </span>
              <p className="text-sm truncate text-gray-100">{orgName}</p>
            </span>
            <p className=" text-orange-500 text-sm hover:underline">
              Order Now ↗
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

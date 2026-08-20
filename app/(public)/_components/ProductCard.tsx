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
  const discountPercentage =
    comparePrice > numericPrice
      ? Math.round(((comparePrice - numericPrice) / comparePrice) * 100)
      : 0;

  return (
    <Link href={`/products/${slug}`}>
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={name || "Product"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
            }}
          />

          {/* Floating Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-3 py-1.5 flex items-center gap-1">
              <span className="text-xs font-bold text-red-500">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4 gap-2">
          {/* Top Row: Brand + Stock */}
          <div className="flex items-center justify-between">
            {brand ? (
              <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                {brand}
              </span>
            ) : (
              <span className="text-xs text-gray-300">No brand</span>
            )}
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stock > 0
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {stock > 0 ? "✓ In Stock" : "✕ Sold Out"}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-snug">
            {name || "Unnamed Product"}
          </h3>

          {/* Price */}
          <div className="flex items-end gap-2 mt-1">
            <span className="text-xl font-bold text-gray-900">
              ${numericPrice.toFixed(2)}
            </span>
            {comparePrice > numericPrice && (
              <span className="text-sm text-gray-400 line-through mb-0.5">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quick Action Row */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
                {orgName.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 truncate">
                by {orgName}
              </span>
            </div>
            {stock > 0 && (
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm hover:shadow">
                Add to Cart
              </button>
            )}
          </div>

          {/* Progress Indicator for Low Stock */}
          {stock > 0 && stock <= 5 && (
            <div className="mt-1">
              <div className="flex items-center justify-between text-[10px] text-red-400 mb-0.5">
                <span>Hurry! Only {stock} left</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${(stock / 20) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

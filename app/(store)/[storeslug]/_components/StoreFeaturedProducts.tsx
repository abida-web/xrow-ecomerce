"use client";
import { getStoreProductsData } from "@/app/actions/individualStore";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Star } from "lucide-react";
import React from "react";

const StoreFeaturedProducts = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured-data", storeslug],
    queryFn: async () => {
      const result = await getStoreProductsData(storeslug);
      return result;
    },
  });

  // Helper to get column classes
  const getColumnClasses = () => {
    const columns = defaultSettings?.columns || 4;
    const gridClass = {
      2: "grid-cols-2",
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    };
    return (
      gridClass[columns as keyof typeof gridClass] ||
      "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    );
  };

  // Helper to get alignment class
  const getAlignmentClass = () => {
    const alignment = defaultSettings?.titleAlignment || "center";
    switch (alignment) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      case "center":
      default:
        return "items-center text-center";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="relative w-full animate-pulse"
        style={{
          paddingTop: `${defaultSettings?.paddingY || 80}px`,
          paddingBottom: `${defaultSettings?.paddingY || 80}px`,
          paddingLeft: `${defaultSettings?.paddingX || 16}px`,
          paddingRight: `${defaultSettings?.paddingX || 16}px`,
          backgroundColor: defaultSettings?.backgroundColor || "#f9fafb",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const products = featured?.featured || [];

  return (
    <div
      className="relative w-full"
      style={{
        paddingTop: `${defaultSettings?.paddingY || 80}px`,
        paddingBottom: `${defaultSettings?.paddingY || 80}px`,
        paddingLeft: `${defaultSettings?.paddingX || 16}px`,
        paddingRight: `${defaultSettings?.paddingX || 16}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#f9fafb",
        color: defaultSettings?.textColor || "#000000",
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: defaultSettings?.maxWidth || "1280px",
        }}
      >
        {/* Title Section - with alignment */}
        <div
          className={`flex flex-col mb-8 ${getAlignmentClass()}`}
          style={{
            gap: `${defaultSettings?.gap || 24}px`,
          }}
        >
          {defaultContent?.title && (
            <h2
              style={{
                fontSize: defaultSettings?.titleSize || "36px",
                fontWeight: defaultSettings?.titleWeight || 700,
                color: defaultSettings?.titleColor || "#000000",
                lineHeight: 1.2,
                margin: 0,
              }}
              className="text-2xl md:text-4xl"
            >
              {defaultContent.title}
            </h2>
          )}
          {defaultContent?.subtitle && (
            <p
              style={{
                fontSize: defaultSettings?.subtitleSize || "16px",
                color: defaultSettings?.subtitleColor || "#4b5563",
                margin: 0,
              }}
              className="text-sm md:text-base"
            >
              {defaultContent.subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div
            className={`grid ${getColumnClasses()}`}
            style={{
              gap: `${defaultSettings?.gap || 24}px`,
            }}
          >
            {products.map((product: any) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: defaultSettings?.productCardBg || "#ffffff",
                  borderRadius: defaultSettings?.productCardRadius || "8px",
                  boxShadow:
                    defaultSettings?.productCardShadow ||
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: `${defaultSettings?.productCardPadding || 16}px`,
                  transition: "all 0.3s ease",
                }}
                className="hover:shadow-xl"
                onMouseEnter={(e) => {
                  if (defaultSettings?.productCardHoverShadow) {
                    e.currentTarget.style.boxShadow =
                      defaultSettings.productCardHoverShadow;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    defaultSettings?.productCardShadow ||
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)";
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    borderRadius: defaultSettings?.productImageRadius || "8px",
                    overflow: "hidden",
                    height: defaultSettings?.productImageHeight || "256px",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="mt-3">
                  {/* Product Name */}
                  <h3
                    style={{
                      fontSize: defaultSettings?.productNameSize || "14px",
                      fontWeight: defaultSettings?.productNameWeight || 500,
                      color: defaultSettings?.productNameColor || "#111827",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                    className="text-sm md:text-base"
                  >
                    {product?.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <span key={val}>
                          <Star
                            className={`h-3.5 w-3.5 ${
                              val <= Math.round(product.averageRating || 0)
                                ? "fill-orange-500 text-orange-500"
                                : "text-gray-300"
                            }`}
                          />
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  {/* Price */}
                  {defaultSettings?.showPrices === true && (
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        style={{
                          fontSize: defaultSettings?.productPriceSize || "18px",
                          fontWeight:
                            defaultSettings?.productPriceWeight || 700,
                          color:
                            defaultSettings?.productPriceColor || "#f97316",
                        }}
                        className="text-base md:text-lg"
                      >
                        ${product.price}
                      </span>
                      {product.comparePriceAt && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.comparePriceAt}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {defaultSettings?.showAddToCart === true && (
                    <button
                      style={{
                        width: defaultSettings?.buttonWidth || "100%",
                        padding: defaultSettings?.buttonPadding || "8px 0",
                        backgroundColor:
                          defaultSettings?.buttonColor || "#f97316",
                        color: defaultSettings?.buttonTextColor || "#ffffff",
                        borderRadius: defaultSettings?.buttonRadius || "8px",
                        fontSize: defaultSettings?.buttonFontSize || "14px",
                        fontWeight: 500,
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        marginTop: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      className="hover:opacity-90"
                      onClick={() => {
                        console.log("Add to cart:", product.id);
                      }}
                      onMouseEnter={(e) => {
                        if (defaultSettings?.buttonHoverColor) {
                          e.currentTarget.style.backgroundColor =
                            defaultSettings.buttonHoverColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          defaultSettings?.buttonColor || "#f97316";
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No featured products available
          </div>
        )}

        {/* View All Button */}
        {defaultContent?.buttonText && products.length > 0 && (
          <div className={`flex justify-center mt-10`}>
            <a
              href={`/${storeslug}${defaultContent.buttonUrl || "/products"}`}
              style={{
                padding: defaultSettings?.buttonPadding || "12px 32px",
                backgroundColor: defaultSettings?.buttonColor || "#f97316",
                color: defaultSettings?.buttonTextColor || "#ffffff",
                borderRadius: defaultSettings?.buttonRadius || "8px",
                fontSize: defaultSettings?.buttonFontSize || "16px",
                fontWeight: 500,
                display: "inline-block",
                textDecoration: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: "none",
                outline: "none",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              className="hover:opacity-90"
              onMouseEnter={(e) => {
                if (defaultSettings?.buttonHoverColor) {
                  e.currentTarget.style.backgroundColor =
                    defaultSettings.buttonHoverColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  defaultSettings?.buttonColor || "#f97316";
              }}
            >
              {defaultContent.buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreFeaturedProducts;

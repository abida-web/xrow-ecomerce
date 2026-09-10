"use client";

import React from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRecentReviewsForTestimonials } from "@/app/actions/individualStore";

const StoreTestimonials = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings || {};
  const defaultContent = settings?.defaultContent || {};

  const columns = defaultSettings?.columns || 3;
  const gap = defaultSettings?.gap ?? 24;
  const titleAlignment = defaultSettings?.titleAlignment || "center";
  const isGrid = (defaultSettings?.layout || "grid") === "grid";

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ["testimonials", storeslug],
    queryFn: async () => {
      const result = await getRecentReviewsForTestimonials(storeslug);
      return result;
    },
  });

  // Map DB reviews → shape used by the component
  const testimonials = (testimonialsData || []).map((review: any) => ({
    id: review.id,
    name: review.user?.name || "Anonymous",
    role: review.title || "Verified Buyer",
    content: review.comment || "",
    rating: review.rating || 0,
    avatar: review.user?.image || null,
  }));

  // Optional: fall back to defaults if no reviews
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : defaultContent?.testimonials || [];

  return (
    <div
      className="relative w-full"
      style={{
        padding: `${defaultSettings.paddingY ?? 80}px ${defaultSettings.paddingX ?? 16}px`,
        backgroundColor: defaultSettings.backgroundColor || "#ffffff",
        color: defaultSettings.textColor || "#000000",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: defaultSettings.maxWidth || "1280px" }}
      >
        {/* Header */}
        {defaultContent.title && (
          <h2
            style={{
              fontSize: defaultSettings.titleSize || "36px",
              fontWeight: defaultSettings.titleWeight || 700,
              color: defaultSettings.titleColor || "#000000",
              textAlign: titleAlignment as React.CSSProperties["textAlign"],
              lineHeight: 1.2,
              marginBottom: defaultContent.subtitle ? "12px" : "40px",
            }}
          >
            {defaultContent.title}
          </h2>
        )}

        {defaultContent.subtitle && (
          <p
            style={{
              fontSize: defaultSettings.subtitleSize || "16px",
              color: defaultSettings.subtitleColor || "#4b5563",
              textAlign: titleAlignment as React.CSSProperties["textAlign"],
              marginBottom: "40px",
            }}
          >
            {defaultContent.subtitle}
          </p>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Testimonials */}
        {!isLoading && (
          <div
            style={{
              display: "grid",
              gap: `${gap}px`,
              gridTemplateColumns: isGrid
                ? `repeat(auto-fit, minmax(280px, 1fr))`
                : "1fr",
              maxWidth: isGrid ? undefined : "720px",
              margin: isGrid ? undefined : "0 auto",
            }}
          >
            {displayTestimonials.map((t: any, index: number) => (
              <div
                key={t.id || index}
                style={{
                  backgroundColor: defaultSettings.cardBg || "#f9fafb",
                  padding: `${defaultSettings.cardPadding ?? 24}px`,
                  borderRadius: defaultSettings.cardRadius || "8px",
                  boxShadow:
                    defaultSettings.cardShadow ||
                    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                  transition: "box-shadow 0.2s ease",
                }}
                className="hover:shadow-md flex flex-col h-full"
              >
                {/* Stars */}
                {t.rating > 0 && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        style={{
                          color:
                            i < t.rating
                              ? defaultSettings.starColor || "#facc15"
                              : "#e5e7eb",
                          fill:
                            i < t.rating
                              ? defaultSettings.starColor || "#facc15"
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Quote */}
                {t.content && (
                  <p
                    style={{
                      fontSize: defaultSettings.quoteSize || "16px",
                      fontStyle:
                        (defaultSettings.quoteStyle as React.CSSProperties["fontStyle"]) ||
                        "italic",
                      color: defaultSettings.quoteColor || "#374151",
                      lineHeight: 1.625,
                      margin: 0,
                      flexGrow: 1,
                    }}
                  >
                    "{t.content}"
                  </p>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-4">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name || "Author"}
                      style={{
                        width: defaultSettings.avatarSize || "48px",
                        height: defaultSettings.avatarSize || "48px",
                        borderRadius: defaultSettings.avatarRadius || "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center bg-orange-100 text-orange-600 font-semibold"
                      style={{
                        width: defaultSettings.avatarSize || "48px",
                        height: defaultSettings.avatarSize || "48px",
                        borderRadius: defaultSettings.avatarRadius || "50%",
                        fontSize: "14px",
                      }}
                    >
                      {t.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span
                      style={{
                        fontSize: defaultSettings.authorNameSize || "14px",
                        fontWeight: defaultSettings.authorNameWeight || 600,
                        color: defaultSettings.authorNameColor || "#111827",
                      }}
                    >
                      {t.name}
                    </span>
                    {t.role && (
                      <span
                        style={{
                          fontSize: defaultSettings.authorRoleSize || "12px",
                          color: defaultSettings.authorRoleColor || "#6b7280",
                        }}
                      >
                        {t.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayTestimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No testimonials yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreTestimonials;

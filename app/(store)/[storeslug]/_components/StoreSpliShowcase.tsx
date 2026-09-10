"use client";

import Link from "next/link";
import React from "react";

const StoreSplitShowcase = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  const isImageRight = defaultSettings?.imagePosition === "right";
  const imageOrder = isImageRight ? "order-2" : "order-1";
  const contentOrder = isImageRight ? "order-1" : "order-2";

  // Helper function to format padding
  const getPadding = () => {
    const padding = defaultSettings?.buttonPadding;
    if (!padding) return "12px 32px";
    if (typeof padding === "number") return `${padding}px`;
    return padding;
  };

  // Helper function to format radius
  const getRadius = () => {
    const radius = defaultSettings?.buttonRadius;
    if (!radius) return "8px";
    if (typeof radius === "number") return `${radius}px`;
    return radius;
  };

  return (
    <div
      className="relative w-full"
      style={{
        paddingTop: `${defaultSettings?.paddingY || 80}px`,
        paddingBottom: `${defaultSettings?.paddingY || 80}px`,
        paddingLeft: `${defaultSettings?.paddingX || 16}px`,
        paddingRight: `${defaultSettings?.paddingX || 16}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
        borderTop: defaultSettings?.divider || "none",
        borderBottom: defaultSettings?.divider || "none",
      }}
    >
      <div
        className="relative mx-auto flex flex-col  md:flex-row items-center"
        style={{
          maxWidth: defaultSettings?.maxWidth || "1280px",
          minHeight: defaultSettings?.minHeight || "500px",
          gap: `${defaultSettings?.spacing || 24}px`,
        }}
      >
        {/* Image Section */}
        <div className={`w-full md:w-1/2 mt-3 ${imageOrder}`}>
          <div
            style={{
              borderRadius: defaultSettings?.imageRadius || "12px",
              boxShadow:
                defaultSettings?.shadow || "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              overflow: "hidden",
            }}
          >
            <img
              src={defaultContent?.image || "/images/split-image.jpg"}
              alt={defaultContent?.title || "Split showcase"}
              className="w-full object-cover"
              style={{
                maxHeight: "500px",
                objectFit: "cover",
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
        {/* Content Section */}
        <div
          className={`w-full md:w-1/2 ${contentOrder}`}
          style={{
            color: defaultSettings?.textColor || "#000000",
          }}
        >
          <div
            style={{ gap: `${defaultSettings?.spacing || 24}px` }}
            className="flex flex-col items-start"
          >
            {/* Title */}
            {defaultContent?.title && (
              <h2
                style={{
                  fontSize: defaultSettings?.titleSize || "48px",
                  fontWeight: defaultSettings?.titleWeight || 700,
                  color: defaultSettings?.titleColor || "#000000",
                  lineHeight: 1.2,
                  margin: 0,
                }}
                className="text-3xl md:text-5xl"
              >
                {defaultContent.title}
              </h2>
            )}

            {/* Subtitle */}
            {defaultContent?.subtitle && (
              <p
                style={{
                  fontSize: defaultSettings?.subtitleSize || "20px",
                  color: defaultSettings?.subtitleColor || "#4b5563",
                  margin: 0,
                  lineHeight: 1.6,
                }}
                className="text-base md:text-xl"
              >
                {defaultContent.subtitle}
              </p>
            )}

            {/* Content */}
            {defaultContent?.content && (
              <p
                style={{
                  fontSize: "16px",
                  color: defaultSettings?.subtitleColor || "#4b5563",
                  lineHeight: 1.8,
                  margin: 0,
                }}
                className="text-sm md:text-base"
              >
                {defaultContent.content}
              </p>
            )}

            {/* Button */}
            {defaultContent?.buttonText && (
              <Link
                href={`/${storeslug}${defaultContent.buttonUrl || ""}`}
                style={{
                  padding: getPadding(),
                  background: defaultSettings?.buttonColor || "#f97316",
                  color: defaultSettings?.buttonTextColor || "#ffffff",
                  borderRadius: getRadius(),
                  fontSize: "16px",
                  fontWeight: 500,
                  display: "inline-block",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  marginTop: "8px",
                }}
                className="hover:opacity-90 text-sm md:text-base px-4 py-2 md:px-8 md:py-3"
                onMouseEnter={(e) => {
                  if (defaultSettings?.buttonHoverColor) {
                    e.currentTarget.style.background =
                      defaultSettings.buttonHoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    defaultSettings?.buttonColor || "#f97316";
                }}
              >
                {defaultContent.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSplitShowcase;

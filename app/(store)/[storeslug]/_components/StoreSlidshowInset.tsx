"use client";

import { SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const StoreSlidshowInset = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;
  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesArray = defaultContent?.slides || [];
  const totalSlides = slidesArray.length;

  const next = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!defaultSettings?.autoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, defaultSettings.autoplaySpeed);
    return () => clearInterval(timer);
  }, [defaultSettings?.autoplay, defaultSettings?.autoplaySpeed, totalSlides]);

  // Helper function to format padding
  const getPadding = () => {
    const padding = defaultSettings?.buttonPadding;
    if (!padding) return "8px 24px";
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

  // Helper function to get responsive size with clamp
  const getResponsiveSize = (
    size: any,
    minSize: string,
    defaultSize: string,
  ) => {
    const formattedSize = getSize(size) || defaultSize;
    const sizeNum = parseInt(formattedSize);
    const minNum = parseInt(minSize);
    const midNum = Math.round((minNum + sizeNum) / 2);
    return `clamp(${minSize}, ${midNum}px, ${formattedSize})`;
  };

  // Helper function to format size
  const getSize = (size: any) => {
    if (!size) return undefined;
    if (typeof size === "number") return `${size}px`;
    return size;
  };

  // Helper function to get button font size
  const getButtonFontSize = () => {
    const fontSize = defaultSettings?.buttonFontSize;
    if (!fontSize) return "clamp(12px, 1vw, 16px)";
    if (typeof fontSize === "number")
      return `clamp(12px, ${fontSize}px, ${fontSize + 4}px)`;
    return fontSize;
  };

  return (
    <div
      className="relative w-full"
      style={{
        padding: `${defaultSettings?.paddingY || 32}px ${defaultSettings?.paddingX || 16}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
      }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: defaultSettings?.maxWidth || "1280px",
          minHeight: defaultSettings?.minHeight || "500px",
          borderRadius: defaultSettings?.borderRadius || "12px",
          boxShadow:
            defaultSettings?.shadow || "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        }}
      >
        <div
          className="relative w-full h-full"
          style={{ minHeight: defaultSettings?.minHeight || "500px" }}
        >
          {/* Navigation Buttons - Hidden on mobile */}
          <div className="absolute inset-0 hidden md:flex items-center justify-between px-4 z-50 pointer-events-none">
            <button
              onClick={prev}
              style={{
                background: defaultSettings?.arrowColor || "#ffffff",
                padding: "12px",
                borderRadius: "50%",
                color: defaultSettings?.arrowTextColor || "#f97316",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              className="pointer-events-auto transition-colors duration-200 hover:bg-orange-50"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              style={{
                background: defaultSettings?.arrowColor || "#ffffff",
                padding: "12px",
                borderRadius: "50%",
                color: defaultSettings?.arrowTextColor || "#f97316",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              className="pointer-events-auto transition-colors duration-200 hover:bg-orange-50"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Slides */}
          {slidesArray.map((slide: any, index: number) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: index === currentIndex ? 1 : 0,
              }}
            >
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: defaultSettings?.borderRadius || "12px",
                  }}
                />
              )}
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    defaultSettings?.overlayColor || "rgba(0,0,0,0.2)",
                  borderRadius: defaultSettings?.borderRadius || "12px",
                }}
              />

              {/* Content - Center Aligned */}
              <div className="absolute inset-0 flex items-center justify-center z-40 px-4 md:px-8">
                <div className="flex flex-col items-center text-center gap-4 max-w-2xl">
                  {slide.title && (
                    <h2
                      className="font-bold"
                      style={{
                        color: defaultSettings?.textColor || "#ffffff",
                        fontSize: getResponsiveSize(
                          defaultSettings?.titleSize,
                          "2rem",
                          "48px",
                        ),
                        fontWeight: defaultSettings?.titleWeight || "700",
                        lineHeight: 1.2,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p
                      style={{
                        color: defaultSettings?.textColor || "#ffffff",
                        fontSize: getResponsiveSize(
                          defaultSettings?.subtitleSize,
                          "1rem",
                          "20px",
                        ),
                        fontWeight: defaultSettings?.subtitleWeight || "400",
                        lineHeight: 1.5,
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {defaultContent?.buttonText && (
                    <Link
                      href={`/${storeslug}${defaultContent.buttonUrl || ""}`}
                      style={{
                        padding: getPadding(),
                        background: defaultSettings?.buttonColor || "#f97316",
                        color: defaultSettings?.buttonTextColor || "#ffffff",
                        borderRadius: getRadius(),
                        fontSize: getButtonFontSize(),
                        fontWeight: defaultSettings?.buttonFontWeight || "500",
                        display: "inline-block",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        border: "none",
                        outline: "none",
                        marginTop: "4px",
                      }}
                      className="hover:opacity-90"
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
          ))}

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
              {slidesArray.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    backgroundColor:
                      i === currentIndex
                        ? defaultSettings?.dotsColor || "#f97316"
                        : defaultSettings?.dotsInactiveColor || "#d1d5db",
                    width:
                      i === currentIndex
                        ? "clamp(10px, 1vw, 12px)"
                        : "clamp(6px, 0.8vw, 10px)",
                    height:
                      i === currentIndex
                        ? "clamp(10px, 1vw, 12px)"
                        : "clamp(6px, 0.8vw, 10px)",
                  }}
                  className="rounded-full transition-all duration-300 hover:scale-110"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreSlidshowInset;

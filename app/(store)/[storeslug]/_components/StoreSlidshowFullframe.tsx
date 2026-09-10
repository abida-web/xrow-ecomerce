"use client";

import { SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const StoreSlidshowFullframe = ({ settings, storeslug }: any) => {
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
    if (!fontSize) return "clamp(14px, 1.2vw, 18px)";
    if (typeof fontSize === "number")
      return `clamp(14px, ${fontSize}px, ${fontSize + 4}px)`;
    return fontSize;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: defaultSettings?.minHeight || "600px",
        height: defaultSettings?.minHeight || "600px",
        padding: `${defaultSettings?.paddingY || 0}px ${defaultSettings?.paddingX || 0}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#000000",
        color: defaultSettings?.textColor || "#ffffff",
      }}
    >
      <div className="relative w-full h-full">
        {/* Navigation Buttons */}
        <div className="hidden sm:absolute inset-0  items-center justify-between px-4 z-50 pointer-events-none">
          <button
            onClick={prev}
            style={{
              background: defaultSettings?.arrowColor || "rgba(0,0,0,0.5)",
              padding: "12px",
              borderRadius: "50%",
              color: defaultSettings?.arrowTextColor || "#ffffff",
            }}
            className="pointer-events-auto transition-colors duration-200 hover:bg-white/30"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            style={{
              background: defaultSettings?.arrowColor || "rgba(0,0,0,0.5)",
              padding: "12px",
              borderRadius: "50%",
              color: defaultSettings?.arrowTextColor || "#ffffff",
            }}
            className="pointer-events-auto transition-colors duration-200 hover:bg-white/30"
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
              />
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: defaultSettings?.overlayColor || "rgba(0,0,0,0.3)",
              }}
            />

            {/* Content - Left Aligned */}
            <div className="absolute inset-0 flex items-center z-40 px-8 md:px-16 lg:px-24">
              <div className="flex flex-col items-start gap-4 max-w-2xl">
                {slide.title && (
                  <h2
                    className="text-white font-bold text-left"
                    style={{
                      color: defaultSettings?.titleColor || "#ffffff",
                      fontSize: getResponsiveSize(
                        defaultSettings?.titleSize,
                        "2rem",
                        "48px",
                      ),
                      fontWeight: defaultSettings?.titleWeight || "700",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <h2
                    className="text-white text-left"
                    style={{
                      color: defaultSettings?.subtitleColor || "#ffffff",
                      fontSize: getResponsiveSize(
                        defaultSettings?.subtitleSize,
                        "1rem",
                        "24px",
                      ),
                      fontWeight: defaultSettings?.subtitleWeight || "500",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.subtitle}
                  </h2>
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
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {slidesArray.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  backgroundColor:
                    i === currentIndex
                      ? defaultSettings?.dotsColor || "#ffffff"
                      : defaultSettings?.dotsInactiveColor ||
                        "rgba(255,255,255,0.5)",
                  width:
                    i === currentIndex
                      ? "clamp(10px, 1vw, 14px)"
                      : "clamp(6px, 0.8vw, 10px)",
                  height:
                    i === currentIndex
                      ? "clamp(10px, 1vw, 14px)"
                      : "clamp(6px, 0.8vw, 10px)",
                }}
                className="rounded-full transition-all duration-300 hover:scale-110"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSlidshowFullframe;

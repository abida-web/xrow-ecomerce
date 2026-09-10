import React from "react";

const StoreHeroMarquee = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  const scrollDuration = defaultSettings?.marqueeDuration || "20";
  const scrollSpeed = defaultSettings?.marqueeSpeed || "linear";
  const marqueeItems = defaultSettings?.marqueeItems || 2;

  // Get alignment with fallback
  const alignment = defaultSettings?.alignment || "center";

  // Map alignment to text-align values
  const getTextAlign = () => {
    if (alignment === "left") return "left";
    if (alignment === "right") return "right";
    return "center";
  };

  // Map alignment to flex alignment
  const getAlignItems = () => {
    if (alignment === "left") return "flex-start";
    if (alignment === "right") return "flex-end";
    return "center";
  };

  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${100 / marqueeItems}%); }
          }
          
          .marquee-wrapper {
            overflow: hidden;
            width: 100%;
            position: relative;
          }
          
          .marquee-track {
            display: flex;
            gap:5px;
            white-space: nowrap;
            animation: scroll ${scrollDuration}s ${scrollSpeed}s infinite;
            width: ${marqueeItems * 100}%;
          }
          
          .marquee-item {
            flex: 0 0 auto;
            padding-right: 40px;
            width: ${100 / marqueeItems}%;
          }
          
          .marquee-item:last-child {
            padding-right: 0;
          }
          
          .marquee-wrapper::before,
          .marquee-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            width: 100px;
            height: 100%;
            z-index: 2;
            pointer-events: none;
          }
          
          .marquee-wrapper::before {
            left: 0;
            background: linear-gradient(to right, ${defaultSettings?.backgroundColor || "#ffffff"}, transparent);
          }
          
          .marquee-wrapper::after {
            right: 0;
            background: linear-gradient(to left, ${defaultSettings?.backgroundColor || "#ffffff"}, transparent);
          }
        `}
      </style>

      <div
        style={{
          minHeight: defaultSettings?.minHeight || "auto",
          background: defaultSettings?.backgroundColor || "#ffffff",
          color: defaultSettings?.textColor || "#000000",
          maxWidth: defaultSettings?.maxWidth || "100%",
          margin: "0 auto",
          paddingTop: defaultSettings?.paddingY || "40px",
          paddingBottom: defaultSettings?.paddingY || "40px",
          paddingLeft: defaultSettings?.paddingX || "20px",
          paddingRight: defaultSettings?.paddingX || "20px",
          display: "flex",
          flexDirection: "column",
          gap: defaultSettings?.spacing || "40px",
          width: "100%",
        }}
      >
        {/* Marquee Section */}
        <div className="marquee-wrapper">
          <div className="marquee-track flex ">
            {Array.from({ length: marqueeItems }).map((_, index) => (
              <h1
                key={index}
                className="marquee-item"
                style={{
                  fontWeight: defaultSettings?.titleWeight || 700,
                  color: defaultSettings?.titleColor || "#000000",
                  margin: 0,
                  fontSize: `clamp(5px, 3vw + 1rem, ${defaultSettings?.titleSize || "4rem"})`,
                }}
              >
                {defaultContent?.marqueeText ||
                  defaultContent?.title ||
                  "Welcome to Our Store"}
              </h1>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="w-full max-w-4xl mx-auto">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: defaultSettings?.spacing || "20px",
                alignItems: getAlignItems(), // Use the mapped value
                textAlign: getTextAlign(), // Use the mapped value
              }}
            >
              {/* Badge */}
              {defaultContent?.badgeText && (
                <span
                  className="inline-block"
                  style={{
                    background: defaultSettings?.badgeColor || "#f97316",
                    color: defaultSettings?.badgeTextColor || "#ffffff",
                    borderRadius: defaultSettings?.badgeRadius || "9999px",
                    padding: defaultSettings?.badgePadding || "4px 16px",
                    fontSize: defaultSettings?.badgeFontSize || "14px",
                    fontWeight: defaultSettings?.badgeFontWeight || 600,
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    // When alignment is left, align badge to left
                    alignSelf:
                      alignment === "left"
                        ? "flex-start"
                        : alignment === "right"
                          ? "flex-end"
                          : "center",
                  }}
                >
                  {defaultContent.badgeText}
                </span>
              )}

              {/* Title - Only show if not using marquee as title */}
              {!defaultSettings?.hideTitle && (
                <h2
                  style={{
                    color: defaultSettings?.titleColor || "#000000",
                    fontSize: `clamp(2rem, 5vw + 1rem, ${defaultSettings?.titleSize || "4rem"})`,
                    fontWeight: defaultSettings?.titleWeight || 700,
                    lineHeight: 1.2,
                    margin: 0,
                    maxWidth: "800px",
                    width: "100%",
                  }}
                >
                  {defaultContent?.title || "Welcome to Our Store"}
                </h2>
              )}

              {/* Subtitle */}
              {defaultContent?.subtitle && (
                <p
                  style={{
                    fontSize: `clamp(3px, 5vw + 7px, ${defaultSettings?.subtitleSize})`,
                    color: defaultSettings?.subtitleColor || "#666666",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: "600px",
                    width: "100%",
                  }}
                >
                  {defaultContent.subtitle}
                </p>
              )}

              {/* Button */}
              {defaultContent?.buttonText && (
                <button
                  className="w-fit transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{
                    padding: defaultSettings?.buttonPadding || "12px 32px",
                    background: defaultSettings?.buttonColor || "#f97316",
                    color: defaultSettings?.buttonTextColor || "#ffffff",
                    fontSize: `clamp(3px,5vw+1rem,${defaultSettings?.buttonFontSize})`,
                    fontWeight: defaultSettings?.buttonFontWeight || 600,
                    borderRadius: defaultSettings?.buttonRadius || "8px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "8px",
                    // When alignment is left, align button to left
                    alignSelf:
                      alignment === "left"
                        ? "flex-start"
                        : alignment === "right"
                          ? "flex-end"
                          : "center",
                  }}
                  onClick={() => {
                    if (defaultContent?.buttonUrl) {
                      window.location.href = `/${storeslug}${defaultContent.buttonUrl}`;
                    }
                  }}
                >
                  {defaultContent.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreHeroMarquee;

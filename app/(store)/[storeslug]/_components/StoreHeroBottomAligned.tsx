import React from "react";

interface StoreHeroSettings {
  layout: string;
  alignment: "left" | "center" | "right";
  minHeight: string;
  backgroundColor: string;
  textColor: string;
  paddingY: number;
  paddingX: number;
  maxWidth: string;
  titleSize: string;
  titleWeight: number;
  titleColor: string;
  subtitleSize: string;
  subtitleColor: string;
  buttonPadding: string;
  buttonColor: string;
  buttonHoverColor: string;
  buttonTextColor: string;
  buttonRadius: string;
  buttonFontSize: string;
  buttonFontWeight: number;
  badgeColor: string;
  badgeTextColor: string;
  badgePadding: string;
  badgeRadius: string;
  badgeFontSize: string;
  badgeFontWeight: number;
  spacing: number;
  imagePosition: string;
  imageWidth: string;
  contentWidth: string;
  overlayOpacity: number;
  overlayColor: string;
}

interface StoreHeroContent {
  title: string;
  subtitle: string;
  badgeText: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
}

interface StoreHeroProps {
  settings: {
    defaultSettings: StoreHeroSettings;
    defaultContent: StoreHeroContent;
  };
  storeslug: string;
}

const StoreHeroBottomAligned: React.FC<StoreHeroProps> = ({
  settings,
  storeslug,
}) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  // Determine content alignment based on settings
  const getContentAlignment = () => {
    switch (defaultSettings.alignment) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      case "center":
        return "center";
      default:
        return "flex-start"; // Default to left
    }
  };

  // Determine text alignment
  const getTextAlignment = () => {
    switch (defaultSettings.alignment) {
      case "left":
        return "left";
      case "right":
        return "right";
      case "center":
        return "center";
      default:
        return "left"; // Default to left
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: defaultSettings.minHeight,
        color: defaultSettings.textColor,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={defaultContent?.image || "/images/hero-image.jpg"}
          alt={defaultContent?.title || "Hero image"}
          className="w-full h-full object-cover"
          style={{
            objectPosition: defaultSettings.imagePosition || "center",
          }}
        />
      </div>

      {/* Content - Positioned at bottom */}
      <div
        className="relative z-10 flex items-end w-full"
        style={{
          minHeight: defaultSettings.minHeight,
          padding: 0, // No outer padding
        }}
      >
        <div
          className="w-full"
          style={{
            paddingLeft: defaultSettings.paddingX,
            paddingRight: defaultSettings.paddingX,
            paddingBottom: defaultSettings.paddingY,
            paddingTop: 0, // No top padding
          }}
        >
          <div
            style={{
              display: "flex",
              gap: defaultSettings.spacing,
              flexDirection: "column",
              alignItems: getContentAlignment(),
              textAlign: getTextAlignment() as any,
            }}
          >
            {/* Badge */}
            {defaultContent.badgeText && (
              <p
                className="inline-block w-fit"
                style={{
                  background: defaultSettings.badgeColor,
                  color: defaultSettings.badgeTextColor,
                  borderRadius: defaultSettings.badgeRadius,
                  padding: defaultSettings.badgePadding,
                  fontSize: defaultSettings.badgeFontSize,
                  fontWeight: defaultSettings.badgeFontWeight,
                  margin: 0,
                }}
              >
                {defaultContent.badgeText}
              </p>
            )}

            {/* Title */}
            <h1
              style={{
                color: defaultSettings.titleColor,
                fontSize: `clamp(2rem,5vw,${defaultSettings.titleSize})`,
                fontWeight: defaultSettings.titleWeight,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {defaultContent.title}
            </h1>

            {/* Subtitle */}
            {defaultContent.subtitle && (
              <p
                style={{
                  fontSize: `clamp(8px,3vw,${defaultSettings.subtitleSize})`,
                  color: defaultSettings.subtitleColor,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {defaultContent.subtitle}
              </p>
            )}

            {/* Button */}
            {defaultContent.buttonText && (
              <button
                className="w-fit transition-all duration-300 hover:opacity-90"
                style={{
                  padding: defaultSettings.buttonPadding,
                  background: defaultSettings.buttonColor,
                  color: defaultSettings.buttonTextColor,
                  fontSize: defaultSettings.buttonFontSize,
                  fontWeight: defaultSettings.buttonFontWeight,
                  borderRadius: defaultSettings.buttonRadius,
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (defaultContent.buttonUrl) {
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
  );
};

export default StoreHeroBottomAligned;

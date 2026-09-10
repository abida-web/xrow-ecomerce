import React from "react";
import Link from "next/link";

const StoreAnnouncementbar = ({ settings }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: defaultSettings?.backgroundColor,
      }}
    >
      <div
        className="container flex items-center gap-2 flex-wrap"
        style={{
          maxWidth: defaultSettings?.maxWidth || "1200px",
          paddingLeft: `clamp(12px, ${defaultSettings?.paddingX || "20px"}, 40px)`,
          paddingRight: `clamp(12px, ${defaultSettings?.paddingX || "20px"}, 40px)`,
          paddingTop: `clamp(8px, ${defaultSettings?.paddingY || "12px"}, 20px)`,
          paddingBottom: `clamp(8px, ${defaultSettings?.paddingY || "12px"}, 20px)`,
          fontSize: `clamp(12px, ${defaultSettings?.fontSize || "14px"}, 18px)`,
          fontWeight: defaultSettings?.fontWeight || 400,
          color: defaultSettings?.textColor || "#ffffff",
          justifyContent:
            defaultSettings?.alignment === "center"
              ? "center"
              : defaultSettings?.alignment === "left"
                ? "flex-start"
                : "flex-end",
          flexWrap: "wrap",
          rowGap: "8px",
          textAlign:
            defaultSettings?.alignment === "center" ? "center" : "left",
        }}
      >
        <span
          style={{
            wordBreak: "break-word",
            flexShrink: 1,
          }}
        >
          {defaultContent?.text}
        </span>

        {defaultContent?.linkUrl && defaultContent?.linkText && (
          <>
            <span
              style={{
                color: defaultSettings?.textColor,
                display: "inline-block",
              }}
              className="hidden sm:inline"
            >
              •
            </span>
            <Link
              href={defaultContent.linkUrl}
              style={{
                color: defaultSettings?.linkColor,
                textDecoration: defaultSettings?.linkUnderline
                  ? "underline"
                  : "none",
                display: "inline-block",
                padding: "4px 0",
                fontSize: `clamp(12px, ${defaultSettings?.fontSize || "14px"}, 18px)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = defaultSettings?.linkHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = defaultSettings?.linkColor;
              }}
            >
              {defaultContent.linkText}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default StoreAnnouncementbar;

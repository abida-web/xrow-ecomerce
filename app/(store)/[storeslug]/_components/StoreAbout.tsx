import React from "react";

const StoreAbout = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  return (
    <div
      className="relative w-full"
      style={{
        padding: `${defaultSettings?.paddingY || 80}px ${defaultSettings?.paddingX || 16}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
        color: defaultSettings?.textColor || "#000000",
        boxShadow: defaultSettings?.shadow,
        borderRadius: defaultSettings?.borderRadius,
      }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: defaultSettings?.maxWidth || "1024px",
          borderRadius: defaultSettings?.borderRadius || "12px",
        }}
      >
        {defaultContent?.title && (
          <h2
            style={{
              fontSize: defaultSettings?.titleSize || "36px",
              fontWeight: defaultSettings?.titleWeight || 700,
              color: defaultSettings?.titleColor || "#000000",
              textAlign: defaultSettings?.titleAlignment || "left",
              lineHeight: 1.5,
            }}
            className="text-2xl md:text-4xl"
          >
            {defaultContent.title}
          </h2>
        )}
        {defaultContent?.content && (
          <p
            style={{
              fontSize: defaultSettings?.subtitleSize || "16px",
              color: defaultSettings?.subtitleColor || "#4b5563",
              textAlign: defaultSettings?.titleAlignment || "left",
              lineHeight: 1.5,
            }}
            className="text-sm md:text-base"
          >
            <span
              dangerouslySetInnerHTML={{ __html: defaultContent.content }}
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreAbout;

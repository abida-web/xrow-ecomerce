"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";

const HeroLargeLogo = ({ settings }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Alignment helpers (unchanged)
  const horizontalAlign = defaultSettings?.alignment || "center";
  const verticalAlign = defaultSettings?.verticalAlignment || "center";

  const getJustifyContent = () => {
    switch (horizontalAlign) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      default:
        return "center";
    }
  };

  const getAlignItems = () => {
    switch (verticalAlign) {
      case "top":
        return "flex-start";
      case "bottom":
        return "flex-end";
      default:
        return "center";
    }
  };

  const getTextAlign = () => {
    switch (horizontalAlign) {
      case "left":
        return "left";
      case "right":
        return "right";
      default:
        return "center";
    }
  };

  const getAlignSelf = () => {
    switch (horizontalAlign) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      default:
        return "center";
    }
  };

  return (
    <div
      style={{
        minHeight: defaultSettings?.minHeight || "100vh",
        background: defaultSettings?.backgroundColor || "#ffffff",
        color: defaultSettings?.textColor || "#000000",
        padding: `${defaultSettings?.paddingY || "40px"} ${defaultSettings?.paddingX || "20px"}`,
        maxWidth: defaultSettings?.maxWidth || "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: getAlignItems(),
        justifyContent: getJustifyContent(),
        textAlign: getTextAlign(),
        width: "100%",
        paddingInline: "clamp(16px, 5vw, 40px)",
      }}
    >
      <img
        src={activeOrganization?.logo! || "/logo.png"}
        alt={defaultContent?.title || "Logo"}
        style={{
          width: `clamp(60px, ${defaultSettings?.logoWidth || "120px"}, 150px)`,
          height: `clamp(60px, ${defaultSettings?.logoHeight || "120px"}, 150px)`,
          background: defaultSettings?.logoBg || "transparent",
          padding: defaultSettings?.logoPadding || "0px",
          borderRadius: defaultSettings?.logoRadius || "0px",
          objectFit: "contain",
          marginBottom: "clamp(16px, 3vh, 24px)",
          alignSelf: getAlignSelf(),
          maxWidth: "100%",
        }}
      />

      <h1
        style={{
          color: defaultSettings?.titleColor || "#000000",
          fontSize: `clamp(28px, 5vw, ${defaultSettings?.titleSize || "48px"})`,
          fontWeight: defaultSettings?.titleWeight || 700,
          lineHeight: 1.2,
          margin: 0,
          marginBottom: "clamp(12px, 3vh, 7rem)",
          textAlign: getTextAlign(),
          alignSelf: getAlignSelf(),
          width: "100%",
          wordBreak: "break-word",
          maxWidth: "min(800px, 95%)",
        }}
      >
        {defaultContent?.title || "Welcome to Our Store"}
      </h1>

      {defaultContent?.subtitle && (
        <p
          style={{
            fontSize: `clamp(16px, 2vw, ${defaultSettings?.subtitleSize || "20px"})`,
            color: defaultSettings?.subtitleColor || "#666666",
            lineHeight: 1.5,
            margin: 0,
            textAlign: getTextAlign(),
            maxWidth: "min(600px, 92%)",
            alignSelf: getAlignSelf(),
            width: "100%",
          }}
        >
          {defaultContent.subtitle}
        </p>
      )}
    </div>
  );
};

export default HeroLargeLogo;

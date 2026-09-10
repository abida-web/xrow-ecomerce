"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const StoreNewsletter = ({ settings, storeslug }: any) => {
  const [email, setEmail] = useState("");
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  const newsLetterCreationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeslug,
          email,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to subscribe");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(
        defaultContent?.successMessage || "Subscribed successfully!",
      );
      setEmail("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSendNewsLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    newsLetterCreationMutation.mutate();
  };

  return (
    <div
      className="relative w-full"
      style={{
        padding: `${defaultSettings?.paddingY || 80}px ${defaultSettings?.paddingX || 16}px`,
        backgroundColor: defaultSettings?.backgroundColor || "#f97316",
        color: defaultSettings?.textColor || "#ffffff",
        boxShadow: defaultSettings?.shadow,
        borderRadius: defaultSettings?.borderRadius,
      }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: defaultSettings?.maxWidth || "768px",
          borderRadius: defaultSettings?.borderRadius || "12px",
        }}
      >
        {/* Title */}
        {defaultContent?.title && (
          <h2
            style={{
              fontSize: defaultSettings?.titleSize || "36px",
              fontWeight: defaultSettings?.titleWeight || 700,
              color: defaultSettings?.titleColor || "#ffffff",
              textAlign: defaultSettings?.titleAlignment || "center",
              lineHeight: 1.5,
            }}
            className="text-2xl md:text-4xl"
          >
            {defaultContent.title}
          </h2>
        )}

        {/* Subtitle */}
        {defaultContent?.subtitle && (
          <p
            style={{
              fontSize: defaultSettings?.subtitleSize || "18px",
              color: defaultSettings?.subtitleColor || "#ffedd5",
              textAlign: defaultSettings?.titleAlignment || "center",
              lineHeight: 1.5,
            }}
            className="text-sm md:text-base"
          >
            {defaultContent.subtitle}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSendNewsLetter}
          style={{ display: defaultSettings?.formLayout || "flex" }}
        >
          <input
            style={{
              background: defaultSettings?.inputBg || "#ffffff",
              color: defaultSettings?.inputTextColor || "#111827",
              border: defaultSettings?.inputBorder || "none",
              borderRadius: defaultSettings?.inputRadius || "8px 0 0 8px",
              padding: defaultSettings?.inputPadding || "12px 16px",
              flex: defaultSettings?.inputFlex || 1,
              outline: "none",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={defaultContent?.placeholder || "Enter your email"}
            type="email"
            disabled={newsLetterCreationMutation.isPending}
          />
          <button
            type="submit"
            disabled={newsLetterCreationMutation.isPending}
            style={{
              background: defaultSettings?.buttonColor || "#000000",
              color: defaultSettings?.buttonTextColor || "#ffffff",
              padding: defaultSettings?.buttonPadding || "12px 32px",
              borderRadius: defaultSettings?.buttonRadius || "0 8px 8px 0",
              fontSize: defaultSettings?.buttonFontSize || "14px",
              fontWeight: defaultSettings?.buttonFontWeight || 500,
              border: "none",
              cursor: newsLetterCreationMutation.isPending
                ? "not-allowed"
                : "pointer",
              transition: "all 0.3s ease",
              opacity: newsLetterCreationMutation.isPending ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (
                !newsLetterCreationMutation.isPending &&
                defaultSettings?.buttonHoverColor
              ) {
                e.currentTarget.style.backgroundColor =
                  defaultSettings.buttonHoverColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!newsLetterCreationMutation.isPending) {
                e.currentTarget.style.backgroundColor =
                  defaultSettings?.buttonColor || "#000000";
              }
            }}
          >
            {newsLetterCreationMutation.isPending
              ? "Subscribing..."
              : defaultContent?.buttonText || "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreNewsletter;

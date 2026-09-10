"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const StoreFaq = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings || {};
  const defaultContent = settings?.defaultContent || {};
  const faqs = defaultContent?.faqs || [];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    if (defaultSettings.accordion) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  const alignment = defaultSettings.titleAlignment || "center";

  return (
    <div
      className="relative w-full"
      style={{
        padding: `${defaultSettings.paddingY ?? 80}px ${defaultSettings.paddingX ?? 16}px`,
        backgroundColor: defaultSettings.backgroundColor || "#f9fafb",
        color: defaultSettings.textColor || "#000000",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: defaultSettings.maxWidth || "768px" }}
      >
        {/* Header */}
        {defaultContent.title && (
          <h2
            style={{
              fontSize: defaultSettings.titleSize || "36px",
              fontWeight: defaultSettings.titleWeight || 700,
              color: defaultSettings.titleColor || "#000000",
              textAlign: alignment as React.CSSProperties["textAlign"],
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
              fontSize: "16px",
              color: defaultSettings.answerColor || "#4b5563",
              textAlign: alignment as React.CSSProperties["textAlign"],
              marginBottom: "40px",
            }}
          >
            {defaultContent.subtitle}
          </p>
        )}

        {/* FAQ Items */}
        <div
          className="flex flex-col"
          style={{ gap: `${defaultSettings.faqSpacing ?? 16}px` }}
        >
          {faqs.map((faq: any, index: number) => {
            const isOpen = defaultSettings.accordion
              ? openIndex === index
              : true;

            return (
              <div
                key={index}
                style={{
                  backgroundColor: defaultSettings.faqItemBg || "#ffffff",
                  padding: `${defaultSettings.faqItemPadding ?? 24}px`,
                  borderRadius: defaultSettings.faqItemRadius || "8px",
                  boxShadow:
                    defaultSettings.faqItemShadow ||
                    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                  border: isOpen
                    ? `1px solid ${defaultSettings.activeBorder || "#f97316"}`
                    : defaultSettings.faqItemBorder || "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                }}
                className="hover:shadow-md"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between text-left gap-4"
                  style={{
                    cursor: defaultSettings.accordion ? "pointer" : "default",
                  }}
                >
                  <h3
                    style={{
                      fontSize: defaultSettings.questionSize || "18px",
                      fontWeight: defaultSettings.questionWeight || 600,
                      color: defaultSettings.questionColor || "#111827",
                      margin: 0,
                    }}
                  >
                    {faq.question}
                  </h3>

                  {defaultSettings.accordion && (
                    <ChevronDown
                      className="w-5 h-5 shrink-0 transition-transform duration-300"
                      style={{
                        color: defaultSettings.iconColor || "#f97316",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  )}
                </button>

                {isOpen && faq.answer && (
                  <>
                    <div
                      style={{
                        borderTop:
                          defaultSettings.divider || "1px solid #e5e7eb",
                        marginTop: "16px",
                        marginBottom: "16px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: defaultSettings.answerSize || "16px",
                        color: defaultSettings.answerColor || "#4b5563",
                        lineHeight: 1.625,
                        margin: 0,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreFaq;

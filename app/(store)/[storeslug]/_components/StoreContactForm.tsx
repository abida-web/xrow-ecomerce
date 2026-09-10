"use client";

import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const StoreContactForm = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  // Only formData is state - everything else is constant
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Constant contact fields
  const contactFields = [
    {
      type: "text",
      name: "name",
      label: "Your Name",
      placeholder: "John Doe",
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "john@example.com",
    },
    {
      type: "textarea",
      name: "message",
      label: "Message",
      placeholder: "Your message here...",
    },
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeslug,
          formData,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send message");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(
        defaultContent?.successMessage || "Message sent successfully!",
      );
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    contactMutation.mutate();
  };

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

        {defaultContent?.subtitle && (
          <p
            style={{
              fontSize: defaultSettings?.subtitleSize || "16px",
              color: defaultSettings?.subtitleColor || "#4b5563",
              textAlign: defaultSettings?.titleAlignment || "left",
              lineHeight: 1.5,
            }}
            className="text-sm md:text-base"
          >
            {defaultContent.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <form
            onSubmit={handleSubmit}
            style={{
              background: defaultSettings?.formBg || "#f9fafb",
              padding: `${defaultSettings?.formPadding || 32}px`,
              borderRadius: defaultSettings?.formRadius || "8px",
              boxShadow:
                defaultSettings?.formShadow ||
                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            className="grid sm:grid-cols-2 grid-cols-1 gap-5"
          >
            {contactFields.map((field, index) => (
              <div
                key={index}
                className={`flex flex-col items-start gap-2 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
              >
                <p
                  className="text-xs"
                  style={{
                    color: defaultSettings?.labelColor || "#374151",
                    fontSize: defaultSettings?.labelSize || "14px",
                    fontWeight: defaultSettings?.labelWeight || 500,
                  }}
                >
                  {field.label}
                </p>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-full"
                    style={{
                      background: defaultSettings?.inputBg || "#ffffff",
                      color: defaultSettings?.inputTextColor || "#111827",
                      border:
                        defaultSettings?.inputBorder || "1px solid #d1d5db",
                      borderRadius: defaultSettings?.inputRadius || "8px",
                      padding: defaultSettings?.inputPadding || "12px 16px",
                      width: "100%",
                      outline: "none",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-full"
                    style={{
                      background: defaultSettings?.inputBg || "#ffffff",
                      color: defaultSettings?.inputTextColor || "#111827",
                      border:
                        defaultSettings?.inputBorder || "1px solid #d1d5db",
                      borderRadius: defaultSettings?.inputRadius || "8px",
                      padding: defaultSettings?.inputPadding || "12px 16px",
                      width: "100%",
                      outline: "none",
                      fontSize: "14px",
                      fontFamily: "inherit",
                    }}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={contactMutation.isPending}
              style={{
                width: defaultSettings?.buttonWidth || "100%",
                padding: defaultSettings?.buttonPadding || "12px 0",
                backgroundColor: defaultSettings?.buttonColor || "#f97316",
                color: defaultSettings?.buttonTextColor || "#ffffff",
                borderRadius: defaultSettings?.buttonRadius || "8px",
                fontSize: defaultSettings?.buttonFontSize || "14px",
                fontWeight: defaultSettings?.buttonFontWeight || 500,
                border: "none",
                cursor: contactMutation.isPending ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: contactMutation.isPending ? 0.7 : 1,
              }}
              className="sm:col-span-2 hover:opacity-90"
            >
              {contactMutation.isPending
                ? "Sending..."
                : defaultContent?.buttonText || "Send Message"}
            </button>
          </form>

          {defaultContent?.contactInfo && (
            <div
              style={{
                padding: `${defaultSettings?.formPadding || 32}px`,
                borderRadius: defaultSettings?.formRadius || "8px",
                background: defaultSettings?.formBg || "#f9fafb",
                boxShadow:
                  defaultSettings?.formShadow ||
                  "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              className="flex flex-col gap-4"
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: defaultSettings?.titleColor || "#000000",
                }}
              >
                Contact Information
              </h3>

              {defaultContent.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ color: defaultSettings?.textColor || "#000000" }}
                  >
                    {defaultContent.contactInfo.phone}
                  </span>
                </div>
              )}

              {defaultContent.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ color: defaultSettings?.textColor || "#000000" }}
                  >
                    {defaultContent.contactInfo.email}
                  </span>
                </div>
              )}

              {defaultContent.contactInfo.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ color: defaultSettings?.textColor || "#000000" }}
                  >
                    {defaultContent.contactInfo.address}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreContactForm;

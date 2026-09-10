"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const StoreFooter = ({ settings, storeslug }: any) => {
  const defaultSettings = settings?.defaultSettings || {};
  const defaultContent = settings?.defaultContent || {};

  const links = defaultContent?.links || [];
  const socialLinks = defaultContent?.socialLinks || [];
  const paymentMethods = defaultContent?.paymentMethods || [];

  const columns = defaultSettings?.columns || 4;
  const gap = defaultSettings?.gap ?? 32;
  const linkSpacing = defaultSettings?.linkSpacing ?? 8;

  // Brand takes 2 columns (wider), links take the rest
  // Total grid: `columns` slots, brand spans 2
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <footer
      className="relative w-full"
      style={{
        padding: `${defaultSettings.paddingY ?? 64}px ${defaultSettings.paddingX ?? 16}px`,
        backgroundColor: defaultSettings.backgroundColor || "#000000",
        color: defaultSettings.textColor || "#ffffff",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: defaultSettings.maxWidth || "1280px" }}
      >
        {/* Top: Brand + Links + Social using GRID */}
        <div
          style={{
            display: "grid",
            gap: `${gap}px`,
            gridTemplateColumns,
          }}
        >
          {/* Brand Column — spans 2 grid columns */}
          <div className="flex flex-col gap-3" style={{ gridColumn: `span 2` }}>
            {activeOrganization?.logo ? (
              <img
                src={activeOrganization?.logo}
                alt={defaultContent.brand || "Logo"}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span
                style={{
                  fontSize: defaultSettings.brandSize || "24px",
                  fontWeight: defaultSettings.brandWeight || 700,
                  color: defaultSettings.brandColor || "#f97316",
                }}
              >
                {defaultContent.brand}
              </span>
            )}

            {defaultContent.description && (
              <p
                style={{
                  fontSize: defaultSettings.descriptionSize || "14px",
                  color: defaultSettings.descriptionColor || "#9ca3af",
                  lineHeight: 1.625,
                  margin: 0,
                }}
              >
                {defaultContent.description}
              </p>
            )}

            {/* Social Links (text) */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {socialLinks.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    style={
                      {
                        fontSize: defaultSettings.socialIconSize || "20px",
                        color: defaultSettings.socialIconColor || "#9ca3af",
                        transition: "color 0.2s ease",
                        "--social-hover":
                          defaultSettings.socialIconHoverColor || "#ffffff",
                      } as React.CSSProperties
                    }
                    className="hover:[color:var(--social-hover)]"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links Column — spans remaining columns */}
          {links.length > 0 && (
            <div
              className="flex flex-col"
              style={{ gridColumn: `span ${Math.max(1, columns - 2)}` }}
            >
              <h3
                style={{
                  fontSize: defaultSettings.titleSize || "14px",
                  fontWeight: defaultSettings.titleWeight || 600,
                  color: defaultSettings.titleColor || "#ffffff",
                  marginBottom: "12px",
                }}
              >
                Quick Links
              </h3>
              {/* Links in a 2-column sub-grid */}
              <ul
                className="list-none p-0 m-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
                  gap: `${linkSpacing}px ${gap}px`,
                }}
              >
                {links.map((link: any, index: number) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      style={
                        {
                          fontSize: defaultSettings.linkSize || "14px",
                          color: defaultSettings.linkColor || "#9ca3af",
                          transition: "color 0.2s ease",
                          "--link-hover":
                            defaultSettings.linkHoverColor || "#ffffff",
                        } as React.CSSProperties
                      }
                      className="hover:[color:var(--link-hover)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Divider */}
        {defaultSettings.divider && (
          <hr
            className="my-8"
            style={{
              border: "none",
              borderTop: defaultSettings.divider || "1px solid #1f2937",
            }}
          />
        )}

        {/* Bottom: Payment + Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {defaultSettings.paymentIcons && paymentMethods.length > 0 && (
            <div className="flex items-center gap-3">
              {paymentMethods.map((method: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded bg-white/10 text-xs capitalize"
                  style={{ color: defaultSettings.textColor || "#ffffff" }}
                >
                  {method}
                </span>
              ))}
            </div>
          )}

          {defaultContent.copyright && (
            <p
              style={{
                fontSize: defaultSettings.copyrightSize || "12px",
                color: defaultSettings.copyrightColor || "#6b7280",
                margin: 0,
              }}
            >
              {defaultContent.copyright}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface NavbarSettings {
  name: string | null;
  type: string | null;
  pageId: string | null;
  id: string;
  enabled: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  organizationId: string | null;
  position: number | null;
  defaultSettings?: any;
  defaultContent?: any;
}

const StoreNavbar = ({
  storeslug,
  settings,
}: {
  storeslug: string;
  settings: NavbarSettings | any;
}) => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const defaultSettings = settings?.defaultSettings;
  const defaultContent = settings?.defaultContent;

  return (
    <div className="relative">
      <nav
        style={{
          backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
          borderBottom: defaultSettings?.borderBottom || "1px solid #e5e7eb",
          boxShadow: defaultSettings?.shadow || "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        <div
          className="container mx-auto flex items-center justify-between"
          style={{
            maxWidth: defaultSettings?.maxWidth || "1280px",
            paddingLeft: defaultSettings?.paddingX || 16,
            paddingRight: defaultSettings?.paddingX || 16,
            paddingTop: defaultSettings?.paddingY || 16,
            paddingBottom: defaultSettings?.paddingY || 16,
          }}
        >
          {/* Logo/Brand */}
          <Link
            href={defaultContent?.logoUrl || "/"}
            className="font-bold shrink-0"
            style={{
              color: defaultSettings?.textColor || "#374151",
              fontSize: defaultSettings?.logoSize || "24px",
              fontWeight: defaultSettings?.logoWeight || 700,
            }}
          >
            <img
              src={
                activeOrganization?.logo &&
                activeOrganization.logo !== "/logo.png"
                  ? activeOrganization.logo
                  : "/logo.png"
              }
              alt={defaultContent?.title || "Logo"}
              className="max-h-8 sm:max-h-10 md:max-h-12 w-auto"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {defaultContent?.links?.map((link: any) => {
              const isActive = pathname === `/${storeslug}${link.url}`;
              return (
                <Link
                  key={link.url}
                  href={`/${storeslug}${link.url}`}
                  className="transition-colors duration-200 whitespace-nowrap"
                  style={{
                    color: isActive
                      ? defaultSettings?.activeColor || "#f97316"
                      : defaultSettings?.textColor || "#374151",
                    fontSize: defaultSettings?.navLinkSize || "14px",
                    fontWeight: defaultSettings?.navLinkWeight || 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color =
                        defaultSettings?.hoverColor || "#f97316";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color =
                        defaultSettings?.textColor || "#374151";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Search bar - Desktop */}
            <div className="hidden md:block">
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 border border-gray-200 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
              />
            </div>

            {/* Search icon - Mobile */}
            <button
              className="md:hidden transition-colors duration-200 p-1.5 sm:p-2"
              style={{ color: defaultSettings?.textColor || "#374151" }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>

            {/* User icon - Hidden on small screens */}
            <button
              className="hidden sm:flex transition-colors duration-200 p-1.5 sm:p-2"
              style={{ color: defaultSettings?.textColor || "#374151" }}
            >
              <User size={20} />
            </button>

            {/* Cart icon with badge */}
            <button className="relative transition-colors duration-200 p-1.5 sm:p-2">
              <span style={{ color: defaultSettings?.textColor || "#374151" }}>
                <ShoppingCart size={20} />
              </span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Get Started Button - Hidden on mobile */}
            {defaultContent?.buttonText && (
              <Link
                href={defaultContent?.buttonUrl || "/sign-up"}
                className="hidden lg:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                style={{
                  backgroundColor: defaultSettings?.buttonColor || "#f97316",
                  color: defaultSettings?.buttonTextColor || "#ffffff",
                }}
                onMouseEnter={(e) => {
                  if (defaultSettings?.buttonHoverColor) {
                    e.currentTarget.style.backgroundColor =
                      defaultSettings?.buttonHoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    defaultSettings?.buttonColor || "#f97316";
                }}
              >
                {defaultContent?.buttonText}
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden transition-colors duration-200 p-1.5 sm:p-2"
              style={{ color: defaultSettings?.textColor || "#374151" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-4">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 px-4 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 border border-gray-200"
              autoFocus
            />
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden border-t border-gray-200"
            style={{
              backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
            }}
          >
            <div className="px-4 py-4 space-y-3">
              {defaultContent?.links?.map((link: any) => {
                const isActive = pathname === `/${storeslug}${link.url}`;
                return (
                  <Link
                    key={link.url}
                    href={`/${storeslug}${link.url}`}
                    className="block py-2 transition-colors duration-200"
                    style={{
                      color: isActive
                        ? defaultSettings?.activeColor || "#f97316"
                        : defaultSettings?.textColor || "#374151",
                      fontSize: defaultSettings?.navLinkSize || "14px",
                      fontWeight: defaultSettings?.navLinkWeight || 500,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile CTA Button */}
              {defaultContent?.buttonText && (
                <Link
                  href={defaultContent?.buttonUrl || "/sign-up"}
                  className="block w-full text-center px-4 py-2 rounded-lg transition-colors duration-200 mt-4"
                  style={{
                    backgroundColor: defaultSettings?.buttonColor || "#f97316",
                    color: defaultSettings?.buttonTextColor || "#ffffff",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {defaultContent?.buttonText}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default StoreNavbar;
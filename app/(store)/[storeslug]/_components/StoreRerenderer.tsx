"use client";
import { useQuery } from "@tanstack/react-query";
import { sectionComponents } from "./sectionRegistory";
import { useParams, usePathname } from "next/navigation";
import { getNavbarForstore } from "@/app/actions/individualStore";
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { authClient } from "@/lib/auth-client";

// Define a proper type for the page
interface PageType {
  id?: string;
  name?: string;
  sections?: any[];
  [key: string]: any;
}

const StoreRerenderer = ({
  selectedPage,
  type,
  setSelectedSectionId,
  selectedSectionId,
  sections: stateSections,
}: {
  selectedPage: PageType | null; // Updated type
  type: string;
  setSelectedSectionId?: Dispatch<SetStateAction<string | null>>;
  selectedSectionId?: string | null;
  sections?: any;
}) => {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const params = useParams();
  const pathname = usePathname();
  const storeslug = String(params.storeslug);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: navbar, isLoading } = useQuery({
    queryKey: ["navbar", storeslug],
    queryFn: () => getNavbarForstore(storeslug),
  });

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-16 bg-gray-100" />
      </div>
    );
  }

  const sections = selectedPage?.sections || [];
  const renderableSections = Array.isArray(sections)
    ? sections
        .filter((section: any) => section?.type !== "navbar")
        .sort((a: any, b: any) => a.position - b.position)
    : [];
  const editeModeSections = Array.isArray(stateSections)
    ? stateSections
        .filter((section: any) => section?.type !== "navbar")
        .sort((a: any, b: any) => a.position - b.position)
    : [];

  const isEditMode = type === "edite" || type === "edit";
  const renderSections = isEditMode ? editeModeSections : renderableSections;
  const navbarData = isEditMode
    ? stateSections?.find((sec: any) => sec.id === navbar?.id) || navbar
    : navbar;

  const defaultSettings: any = navbarData?.defaultSettings;
  const defaultContent: any = navbarData?.defaultContent;

  return (
    <div className="w-full">
      {isEditMode && (
        <nav
          onClick={() => setSelectedSectionId?.(navbarData?.id || null)}
          style={{
            backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
            boxShadow:
              defaultSettings?.shadow || "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
          className={`${selectedSectionId === navbar?.id ? "border-2 border-sky-600" : ""}`}
        >
          <div
            className="container mx-auto flex items-center justify-between relative"
            style={{
              maxWidth: defaultSettings?.maxWidth || "1280px",
              paddingLeft: defaultSettings?.paddingX || 16,
              paddingRight: defaultSettings?.paddingX || 16,
              paddingTop: defaultSettings?.paddingY || 16,
              paddingBottom: defaultSettings?.paddingY || 16,
            }}
          >
            {/* Logo/Brand */}
            <div
              className="font-bold"
              style={{
                color: defaultSettings?.textColor || "#374151",
                fontSize: defaultSettings?.logoSize || "24px",
                fontWeight: defaultSettings?.logoWeight || 700,
              }}
            >
              {" "}
              <img
                src={
                  activeOrganization?.logo &&
                  activeOrganization.logo !== "/logo.png"
                    ? activeOrganization.logo
                    : "/logo.png"
                }
                className="h-8 w-auto object-contain"
                style={{
                  maxHeight: "40px",
                  width: "auto",
                  display: "block",
                }}
                alt={defaultContent?.title || "Logo"}
              />
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {defaultContent?.links?.map((link: any, index: number) => {
                const isActive = pathname === `/${storeslug}${link.url}`;
                return (
                  <Link
                    key={`link-${index}-3`}
                    href={`/${storeslug}${link.url || ""}`}
                    className="transition-colors duration-200"
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
            <div className="flex items-center gap-4">
              <input
                placeholder="Search..."
                className="hidden lg:block bg-gray-50 px-5 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 border border-gray-200"
              />

              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ color: defaultSettings?.textColor || "#374151" }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                className="hidden md:block transition-colors duration-200"
                style={{ color: defaultSettings?.textColor || "#374151" }}
              >
                <User size={20} />
              </button>

              <button className="relative transition-colors duration-200">
                <span
                  style={{ color: defaultSettings?.textColor || "#374151" }}
                >
                  <ShoppingCart size={20} />
                </span>
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              {defaultContent?.buttonText && (
                <Link
                  href={defaultContent?.buttonUrl || "/sign-up"}
                  className="hidden md:block px-4 py-2 rounded-lg transition-colors duration-200"
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
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden border-t border-gray-200"
              style={{
                backgroundColor: defaultSettings?.backgroundColor || "#ffffff",
              }}
            >
              <div className="px-4 py-2 space-y-2">
                {defaultContent?.links?.map((link: any, index: number) => {
                  const isActive = pathname === `/${storeslug}${link.url}`;
                  return (
                    <Link
                      key={link.url || `mobile-link-${index}`}
                      href={`/${storeslug}${link.url || ""}`}
                      className="block py-2 transition-colors duration-200"
                      style={{
                        color: isActive
                          ? defaultSettings?.activeColor || "#f97316"
                          : defaultSettings?.textColor || "#374151",
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <input
                  placeholder="Search..."
                  className="w-full bg-gray-50 px-4 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 border border-gray-200 mb-2"
                />

                {defaultContent?.buttonText && (
                  <Link
                    href={defaultContent?.buttonUrl || "/sign-up"}
                    className="block w-full text-center px-4 py-2 rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor:
                        defaultSettings?.buttonColor || "#f97316",
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
      )}

      {/* Render sections */}
      <div className=" flex flex-col gap-2">
        {renderSections.map((sec: any, index: number) => {
          const Component = (
            sectionComponents as Record<string, React.ComponentType<any>>
          )[sec.name];
          if (!Component) return null;
          return (
            <div
              key={sec.id || `section-${index}`}
              className={`${selectedSectionId === sec.id ? "border-2 border-sky-600" : ""}`}
              onClick={() => isEditMode && setSelectedSectionId?.(sec.id)}
            >
              <Component settings={sec} storeslug={storeslug} />
            </div>
          );
        })}
      </div>

      {renderableSections.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No sections available
        </div>
      )}
    </div>
  );
};

export default StoreRerenderer;

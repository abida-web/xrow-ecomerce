"use client";
import {
  Cog,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingBag,
  UsersRound,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navigations = [
  {
    id: 1,
    name: "Dashboard",
    href: "",
    icon: <LayoutDashboardIcon size={17} />,
  },
  {
    id: 2,
    name: "Products",
    href: "products",
    icon: <PackageIcon size={17} />,
  },
  {
    id: 3,
    name: "Orders",
    href: "orders",
    icon: <ShoppingBag size={17} />,
  },
  {
    id: 4,
    name: "Customers",
    href: "customers",
    icon: <UsersRound size={17} />,
  },
  {
    id: 5,
    name: "Settings",
    href: "settings",
    icon: <Cog size={17} />,
  },
];

const Sidbar = ({ storeSlug }: { storeSlug: string }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`  bg-gradient-to-b from-black via-white/20 to fixed left-0 top-0 h-full w-64 px-5 border-r border-gray-500 shadow-sm  transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mt-20 flex flex-col gap-5">
          {navigations.map((nav) => {
            const href =
              nav.href === ""
                ? `/dashboard/${storeSlug}`
                : `/dashboard/${storeSlug}/${nav.href}`;
            const isActive = pathname === href;
            return (
              <Link
                href={href}
                key={nav.id}
                onClick={closeSidebar}
                className={`flex gap-2 items-center px-4 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "shadow-xs shadow-orange-500 border-t border-orange-500"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <span className="h-5 w-5">{nav.icon}</span>
                <span
                  className={`${
                    isActive && "border-r-2 border-orange-500 pr-18"
                  }`}
                >
                  {nav.name}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidbar;

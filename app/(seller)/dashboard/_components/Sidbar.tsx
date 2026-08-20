"use client";
import { authClient } from "@/lib/auth-client";
import {
  Cog,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingBag,
  UsersRound,
  Menu,
  X,
  Truck,
  Users,
  LogOut,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const navigations = [
  {
    id: 1,
    name: "Dashboard",
    href: "",
    icon: <LayoutDashboardIcon size={18} />,
  },
  {
    id: 2,
    name: "Products",
    href: "products",
    icon: <PackageIcon size={18} />,
  },
  {
    id: 3,
    name: "Orders",
    href: "orders",
    icon: <ShoppingBag size={18} />,
  },
  {
    id: 4,
    name: "Customers",
    href: "customers",
    icon: <UsersRound size={18} />,
  },
  {
    id: 5,
    name: "Staff",
    href: "staff",
    icon: <Users size={18} />,
  },
  {
    id: 6,
    name: "Settings",
    href: "settings",
    icon: <Cog size={18} />,
  },
];

const Sidbar = ({ storeSlug }: { storeSlug: string }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    });
  };
  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-200/50 transition-all duration-300 hover:scale-105"
      >
        <Menu size={22} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          <X size={22} />
        </button>

        {/* Logo Section */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              X
            </div>
            <div>
              <img src="/logo.PNG" className="h-15 object-contain" alt="Logo" />
            </div>
          </Link>
        </div>

        {/* Store Info */}
        <div className="px-5 py-3 border-b border-gray-100 bg-orange-50/50">
          <div className="flex items-center gap-2 text-sm">
            <Store className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600 font-medium truncate">
              {storeSlug}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
          <div className="flex flex-col gap-1">
            {navigations.map((nav) => {
              const href =
                nav.href === ""
                  ? `/dashboard/${storeSlug}`
                  : `/dashboard/${storeSlug}/${nav.href}`;
              const isActive = pathname === href;
              return (
                <Link
                  href={href}
                  key={nav.name}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-orange-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  <span className="flex-1 text-sm">{nav.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidbar;

"use client";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const navLinks = [
    { name: "Home", href: "" },
    { name: "Products", href: "products" },
    { name: "Categories", href: "categories" },
  ];
  const path = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const isActive = (href: string) => {
    if (href === "" && path === "/") return true;
    if (href !== "" && path === href) return true;
    return false;
  };
  const { data } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `api/public/products?search=${encodeURIComponent(searchTerm)}`,
      );
      return await response.json();
    },

    enabled: searchTerm.trim().length > 0,
  });
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart/items", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  const router = useRouter();
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center px-4 -mt-5">
        <Link href="/">
          <img src="./logo.PNG" className="h-20 object-cover" alt="Logo" />
        </Link>
        <div className="flex gap-5 text-gray-400">
          {navLinks.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href === "" ? "/" : nav.href}
              className={`${
                isActive(nav.href)
                  ? "text-orange-500 underline decoration-2 underline-offset-8"
                  : "text-gray-400 hover:text-white"
              } transition-colors font-medium`}
            >
              {nav.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-5 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search product..."
              className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full shadow-sm shadow-orange-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {/* Results dropdown */}
            {data && data.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {data.map((sp: any, i: number) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  >
                    <p className="text-white">{sp.name || sp.brand}</p>
                  </div>
                ))}
                <p
                  onClick={() => {
                    router.push(
                      `/products?search=${encodeURIComponent(searchTerm)}`,
                    );
                    setSearchTerm("");
                  }}
                  className="text-sm mb-4 text-center cursor-pointer text-orange-500 hover:text-orange-400 transition-colors"
                >
                  See all results →
                </p>
              </div>
            )}
          </div>
          <button className="hover:text-orange-500 transition-colors">
            <User size={20} />
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="hover:text-orange-500 transition-colors relative"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems?.totalCartItems || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpenMenu(true)}
          className="bg-orange-500 text-white p-2 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="relative  min-w-[100px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search product..."
            className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full shadow-sm shadow-orange-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
          {/* Results dropdown */}
          {data && data.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {data.map((sp: any, i: number) => (
                <div
                  key={i}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  <p className="text-white">{sp.name || sp.brand}</p>
                </div>
              ))}
              <p
                onClick={() => {
                  router.push(
                    `/products?search=${encodeURIComponent(searchTerm)}`,
                  );
                  setSearchTerm("");
                }}
                className="text-sm mb-4 text-center cursor-pointer text-orange-500 hover:text-orange-400 transition-colors"
              >
                See all results →
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/cart")}
          className="hover:text-orange-500 transition-colors relative"
        >
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems?.totalCartItems || 0}
          </span>
        </button>
      </div>

      {/* Sidebar - slides from left */}
      {openMenu && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpenMenu(false)}
          />

          {/* Sidebar */}
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-black z-50 p-4">
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={() => setOpenMenu(false)}
                className="text-white p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col space-y-4 mt-6">
              {navLinks.map((nav) => (
                <Link
                  key={nav.href}
                  href={nav.href === "" ? "/" : nav.href}
                  onClick={() => setOpenMenu(false)}
                  className={`${
                    isActive(nav.href)
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  } text-lg transition-colors`}
                >
                  {nav.name}
                </Link>
              ))}
            </div>

            {/* User */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-700">
              <User size={20} className="text-gray-400" />
              <span className="text-gray-300">Profile</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;

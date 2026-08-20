"use client";
import { authClient } from "@/lib/auth-client";
import { navLinks } from "@/lib/constants/nav-links";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingCart, Store, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const path = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchDropDownRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery] = useDebouncedValue(searchTerm, {
    wait: 500,
  });
  const { data: session } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  useEffect(() => {
    if (!showResults) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchDropDownRef.current &&
        !searchDropDownRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showResults]);
  const { data } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/public/products?search=${encodeURIComponent(debouncedQuery)}`,
      );
      return await response.json();
    },
    enabled: Boolean(debouncedQuery && debouncedQuery.trim().length > 0),
  });

  const { data: cartItems } = useQuery({
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
      <div
        ref={searchDropDownRef}
        className="hidden md:flex justify-between items-center px-4 -mt-5"
      >
        <Link href="/">
          <img src="/logo.PNG" className="h-20 object-cover" alt="Logo" />
        </Link>
        <div className="flex gap-5 text-gray-600 ">
          {navLinks.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href === "/" ? "/" : nav.href}
              className={`${
                (nav.href === "/" ? path === "/" : path.startsWith(nav.href))
                  ? "text-orange-500 font-semibold bg-orange-500/10 py-1 shadow-xs shadow-orange-500 rounded-full "
                  : " hover:text-orange-400 "
              } transition-colors px-5 font-medium`}
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => {
                if (searchTerm.trim().length > 0) setShowResults(true);
              }}
              type="text"
              placeholder="Search product..."
              className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-full text-sm shadow-sm shadow-orange-500 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {/* Results dropdown */}
            {showResults && data && data.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-200 border border-gray-700/5 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {data.map((sp: any, i: number) => (
                  <Link
                    key={i}
                    href={`/products/${sp.id}`}
                    onClick={() => {
                      setSearchTerm("");
                      setShowResults(false);
                    }}
                    className="block px-4 py-2 hover:bg-white/10 cursor-pointer"
                  >
                    <p className="text-gray-700 text-sm">
                      {sp.name || sp.brand}
                    </p>
                  </Link>
                ))}
                <p
                  onClick={() => {
                    router.push(
                      `/products?search=${encodeURIComponent(searchTerm)}`,
                    );
                    setSearchTerm("");
                    setShowResults(false);
                  }}
                  className="text-sm mb-4 text-center cursor-pointer text-orange-500 hover:text-orange-400 transition-colors"
                >
                  See all results →
                </p>
              </div>
            )}
          </div>
          {!session ? (
            <Link
              href="/login"
              className="hover:text-orange-500 text-gray-600 transition-colors"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {activeOrganization && (
                <Link
                  href={`/dashboard/${activeOrganization?.slug}`}
                  className=" text-gray-600 hover:text-orange-500 transition-colors hover:bg-orange-500/20 p-2 rounded-full"
                >
                  <Store size={20} />
                </Link>
              )}
              <Link
                href="/account"
                className=" text-gray-600 hover:text-orange-500 transition-colors hover:bg-orange-500/20 p-2 rounded-full"
              >
                <User size={20} />
              </Link>
            </div>
          )}
          <button
            onClick={() => router.push("/cart")}
            className=" text-gray-600 hover:text-orange-500 transition-colors relative"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems?.totalCartItems || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between py-3">
        <button
          onClick={() => setOpenMenu(true)}
          className="bg-orange-500/20 shadow-xs transition-all duration-500 hover:shadow-orange-500 text-white p-2 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="relative min-w-[100px] mx-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (searchTerm.trim().length > 0) setShowResults(true);
            }}
            type="text"
            placeholder="Search product..."
            className="w-full bg-white/5 pl-10 pr-4 py-1 rounded-full shadow-sm shadow-orange-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
          {/* Results dropdown */}
          {showResults && data && data.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-300 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {data.map((sp: any, i: number) => (
                <Link
                  key={i}
                  href={`/products/${sp.id}`}
                  onClick={() => {
                    setSearchTerm("");
                    setShowResults(false);
                  }}
                  className="block px-4 py-2 hover:bg-white/10 cursor-pointer"
                >
                  <p className="text-white">{sp.name || sp.brand}</p>
                </Link>
              ))}
              <p
                onClick={() => {
                  router.push(
                    `/products?search=${encodeURIComponent(searchTerm)}`,
                  );
                  setSearchTerm("");
                  setShowResults(false);
                }}
                className="text-sm mb-4 text-center cursor-pointer text-orange-500 hover:text-orange-400 transition-colors"
              >
                See all results →
              </p>
            </div>
          )}
        </div>

        {!session ? (
          <Link
            href="/login"
            className="hover:text-orange-500 transition-colors"
          >
            Login
          </Link>
        ) : (
          <div className="flex items-center">
            <Link
              href={`/dashboard/${activeOrganization?.slug}`}
              className="hover:text-orange-500 hover:bg-orange-500/20 p-2 rounded-full transition-colors"
            >
              <Store size={20} />
            </Link>
            <Link
              href="/account"
              className="hover:text-orange-500 hover:bg-orange-500/20 p-2 rounded-full transition-colors"
            >
              <User size={20} />
            </Link>
          </div>
        )}
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
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-72  z-50 p-4">
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
                    (
                      nav.href === "/"
                        ? path === "/"
                        : path.startsWith(nav.href)
                    )
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-white"
                  } text-lg transition-colors`}
                >
                  {nav.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;

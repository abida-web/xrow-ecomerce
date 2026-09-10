"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  X,
  LayoutDashboard,
  Store,
  Truck,
  CreditCard,
  Bell,
  Shield,
  Settings as SettingsIcon,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [openSettings, setOpenSettings] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const storeslug = params.storeslug;

  useEffect(() => {
    setOpenSettings(true);
  }, []);

  const navItems = [
    {
      name: "General",
      href: `/dashboard/${storeslug}/settings/general`,
      icon: <SettingsIcon className="w-4 h-4" />,
    },
    {
      name: "Store Preference",
      href: `/dashboard/${storeslug}/settings/store-preference`,
      icon: <Store className="w-4 h-4" />,
    },
    {
      name: "Shipping",
      href: `/dashboard/${storeslug}/settings/shipping`,
      icon: <Truck className="w-4 h-4" />,
    },
    {
      name: "Payments",
      href: `/dashboard/${storeslug}/settings/payments`,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      name: "Notifications",
      href: `/dashboard/${storeslug}/settings/notifications`,
      icon: <Bell className="w-4 h-4" />,
    },
    {
      name: "Security",
      href: `/dashboard/${storeslug}/settings/security`,
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 text-black flex">
        {/* SettingBar - Fixed on the left side */}
        {openSettings && (
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm z-50 overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setOpenSettings(false)}
                className="absolute right-3 top-3 transition-all hover:bg-orange-500/10 rounded-full p-1 hover:text-orange-500"
              >
                <X size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-orange-500" />
                Settings
              </h1>
              {/* Navigation items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors group ${
                        isActive
                          ? "bg-orange-50 text-orange-600 font-medium border border-orange-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={`transition-colors ${
                          isActive
                            ? "text-orange-500"
                            : "text-gray-400 group-hover:text-orange-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-6 bg-orange-500 rounded-full"></span>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main content with left sidebar spacing */}
        <div className="min-h-screen flex-1">
          <main>
            <div className="max-w-7xl mx-auto flex gap-2">
              <button
                onClick={() => setOpenSettings(true)}
                className="py-1 px-0 shadow shadow-orange-500 h-fit rounded-lg "
              >
                <ChevronRight className="h-3 w-3 text-orange-500" />
              </button>
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

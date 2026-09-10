"use client";

import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  getNotification,
  markNotificationAsRead,
} from "@/app/actions/order-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationModal from "./NotificationModal";

const Topbar = ({ storeSlug }: { storeSlug: string }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, { wait: 400 });
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();

  const {
    data: notificationData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications", storeSlug, selectedType],
    queryFn: () => getNotification(storeSlug, selectedType),
    enabled: !!storeSlug,
  });

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["search", storeSlug, debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await fetch(
        `/api/dashboard/${storeSlug}?search=${encodeURIComponent(debouncedSearch)}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      return res.json();
    },
    enabled:
      !!storeSlug && Boolean(debouncedSearch && debouncedSearch.length > 0),
  });

  const handleMarkAsRead = async (notificationId: string) => {
    const res = await markNotificationAsRead(notificationId, storeSlug);
    if (res.success) {
      queryClient.invalidateQueries({
        queryKey: ["notifications", storeSlug],
      });
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const notsCount = notificationData?.filter(
    (noti) => noti.isRead === false,
  ).length;

  if (isSessionPending || isNotificationsLoading) {
    return <TopbarSkeleton />;
  }

  if (isNotificationsError) {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-red-500">
            Error: {notificationsError?.message}
            <button
              onClick={() => refetchNotifications()}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left - Search */}
        <button
          type="button"
          className="relative flex-1 max-w-md cursor-pointer text-left"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <div className="w-full truncate whitespace-nowrap bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-800 text-sm hover:border-gray-300 transition-colors">
              Search products,customers,orders
            </div>
          </div>
        </button>

        {/* Search Modal */}
        {isSearchModalOpen && (
          <div className="fixed text-black inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">Search</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setSearchTerm("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products,customers,orders"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mt-4 max-h-96 overflow-y-auto">
                  {isSearchLoading && (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-12 bg-gray-100 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  )}
                  {searchResults &&
                    searchResults.length === 0 &&
                    searchTerm && (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No results found for "{searchTerm}"
                      </p>
                    )}
                  {searchResults && (
                    <div className="p-4 space-y-6">
                      {/* Products Section */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Products
                          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {searchResults?.productsDetails?.length || 0}
                          </span>
                        </h2>
                        <div className="space-y-1.5">
                          {searchResults?.productsDetails?.map(
                            (result: any) => (
                              <Link
                                href={`/dashboard/${storeSlug}/products/${result.id}`}
                                key={result.id}
                                className="px-4 py-2.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200"
                              >
                                <p className="text-sm text-gray-700 font-medium">
                                  {result.name}
                                </p>
                              </Link>
                            ),
                          )}
                          {!searchResults?.productsDetails?.length && (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-400 text-center border border-dashed border-gray-200">
                              No products found
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customers Section */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Customers Found
                          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {searchResults?.customersDetails?.length || 0}
                          </span>
                        </h2>
                        <div className="space-y-1.5">
                          {searchResults?.customersDetails?.map(
                            (result: any, i: number) => (
                              <Link
                                href={`/dashboard/${storeSlug}/customers/${result.id}`}
                                key={`${i}-customer`}
                                className="px-4 py-2.5 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-emerald-200"
                              >
                                <p className="text-sm text-gray-700 font-medium">
                                  {result.name}
                                </p>
                              </Link>
                            ),
                          )}
                          {!searchResults?.customersDetails?.length && (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-400 text-center border border-dashed border-gray-200">
                              No customers found
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Orders Section */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Orders Found
                          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {searchResults?.ordersDetails?.length || 0}
                          </span>
                        </h2>
                        <div className="flex flex-col gap-2">
                          {searchResults?.ordersDetails?.map((result: any) => (
                            <Link
                              href={`/dashboard/${storeSlug}/orders/${result.id}`}
                              key={result.id}
                              className="px-4 py-2.5  rounded-lg cursor-pointer transition-all duration-200 "
                            >
                              <p className="text-sm text-gray-700 font-mono">
                                #{result.id}
                              </p>
                            </Link>
                          ))}
                          {!searchResults?.ordersDetails?.length && (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-400 text-center border border-dashed border-gray-200">
                              No orders found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {!searchTerm && (
                    <p className="text-gray-400 text-sm text-center py-4">
                      Type to start searching...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn-ghost btn-sm p-1">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                {notsCount && notsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                    {notsCount > 99 ? "99+" : notsCount}
                  </span>
                )}
              </button>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-[1] w-80 p-2 shadow-lg"
            >
              {notsCount === 0 ? (
                <div>
                  <li className="text-center py-4 text-gray-500">
                    No new notifications
                  </li>
                  <li className="mt-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => setIsNotificationModalOpen(true)}
                      className="text-sm text-center w-full text-orange-500 hover:text-orange-400 transition-colors py-2 font-medium"
                    >
                      See all notifications →
                    </button>
                  </li>
                </div>
              ) : (
                <>
                  {notificationData
                    ?.filter((noti) => !noti.isRead)
                    .slice(0, 5)
                    .map((noti) => (
                      <li
                        key={noti.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <div className="flex flex-col items-start py-2">
                          <h1 className="font-medium text-black text-sm">
                            {noti.title}
                          </h1>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {noti.message}
                          </p>
                        </div>
                      </li>
                    ))}
                  <li className="mt-2 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => setIsNotificationModalOpen(true)}
                      className="text-sm text-center w-full text-orange-500 hover:text-orange-400 transition-colors py-2 font-medium"
                    >
                      See all notifications →
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {sessionData?.user?.name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {sessionData?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400">Owner</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 truncate">
                      {sessionData?.user?.email || "No email"}
                    </p>
                  </div>
                  <Link
                    href={`/${storeSlug}/profile`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href={`/${storeSlug}/settings`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {isNotificationModalOpen && (
        <NotificationModal
          setIsNotificationModalOpen={setIsNotificationModalOpen}
          notificationData={notificationData}
          handleMarkAsRead={handleMarkAsRead}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      )}
    </div>
  );
};

// Skeleton Component
const TopbarSkeleton = () => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="w-64 h-10 bg-gray-200 rounded-xl animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="hidden sm:block">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

"use client";

import { useParams, useRouter } from "next/navigation";
import Sidbar from "../_components/Sidbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Topbar from "../_components/Topbar";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { storeslug } = useParams<{ storeslug: string }>();
  const router = useRouter();

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: member } = await authClient.organization.getActiveMember();
      if (member?.role !== "owner" && member?.role !== "staff") {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 `}
        >
          <Sidbar storeSlug={storeslug} />
        </div>
        {/* Main */}
        <div className="lg:pl-68">
          <Topbar storeSlug={storeslug} />
          <main className="p-4 w-full sm:p-6">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

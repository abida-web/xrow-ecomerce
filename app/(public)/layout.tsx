"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen overflow-x-hidden bg-white px-3 py-4 sm:px-5 md:p-8">
        <Navbar />
        {/* Main content */}
        <main className="  min-h-screen ">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

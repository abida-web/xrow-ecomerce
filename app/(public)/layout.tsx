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
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen p-4 bg-white md:p-8">
        <Navbar />
        {/* Main content */}
        <main className="  min-h-screen ">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

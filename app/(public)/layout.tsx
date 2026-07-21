"use client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen p-4 md:p-8 bg-black">
        <Navbar />
        {/* Main content */}
        <main className="  min-h-screen bg-black">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

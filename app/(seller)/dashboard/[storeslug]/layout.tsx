"use client";
import { useParams } from "next/navigation";
import Sidbar from "../_components/Sidbar";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const storeslug = String(params.storeslug);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black">
        <Sidbar storeSlug={storeslug} />

        {/* Main content */}
        <main className="lg:ml-64 p-8 min-h-screen bg-black">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

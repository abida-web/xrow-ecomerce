"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getOrganizationWithSettings } from "@/app/actions/settings";
import StoreNavbar from "./_components/StoreNavbar";
import { getNavbarForstore } from "@/app/actions/individualStore";

// Create a separate component that uses useQuery
function StoreContent({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const { data } = useQuery({
    queryKey: ["organizationSettings", storeslug], // Fixed typo here too
    queryFn: () => getOrganizationWithSettings(storeslug),
    enabled: !!storeslug,
  });
  const { data: navbar, isLoading } = useQuery({
    queryKey: ["navbar", storeslug],
    queryFn: () => getNavbarForstore(storeslug),
  });

  return (
    <div className="min-h-screen  bg-white text-black ">
      <main className="min-h-screen">
        <div className=" mx-auto">
          {data?.settings && data?.settings.storeVisibility && (
            <div>
              <StoreNavbar storeslug={storeslug} settings={navbar} />
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StoreContent>{children}</StoreContent>
    </QueryClientProvider>
  );
}

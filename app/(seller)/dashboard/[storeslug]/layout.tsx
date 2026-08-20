"use client";

import { useParams, useRouter } from "next/navigation";
import Sidbar from "../_components/Sidbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Topbar from "../_components/Topbar";
import { useEffect, useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const router = useRouter();
  const hasCheckedRef = useRef(false); // ✅ Prevent double checking

  // ✅ Create QueryClient once and store in state
  const [queryClient] = useState(() => new QueryClient());

  // ✅ Get session data
  const { data, isPending, error } = authClient.useSession();

  // ✅ State for member check
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [isCheckingMember, setIsCheckingMember] = useState(true);

  // ✅ Redirect if no session
  useEffect(() => {
    if (!isPending && !data?.session) {
      toast.error("You are not authorized. Please sign in.");
      router.push("/");
    }
  }, [isPending, data?.session, router]);

  // ✅ Check if user is a member of the organization - ONLY ONCE
  useEffect(() => {
    const checkMembership = async () => {
      // ✅ Skip if already checked or no user
      if (hasCheckedRef.current || !data?.user?.id || !storeslug) {
        if (!data?.user?.id) {
          setIsCheckingMember(false);
        }
        return;
      }

      try {
        setIsCheckingMember(true);

        const { data: orgData, error: orgError } =
          await authClient.organization.getFullOrganization({
            query: {
              organizationSlug: storeslug,
            },
          });

        if (orgError) {
          console.error("Organization fetch error:", orgError);
          toast.error("Failed to verify store access");
          router.push("/");
          return;
        }

        const userIsMember = orgData?.members?.some(
          (member: any) => member.userId === data.user.id,
        );

        setIsMember(!!userIsMember);
        hasCheckedRef.current = true; // ✅ Mark as checked

        if (!userIsMember) {
          toast.error("You are not a member of this store");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking membership:", error);
        toast.error("Failed to verify store access");
        router.push("/");
      } finally {
        setIsCheckingMember(false);
      }
    };

    checkMembership();
  }, [data?.user?.id, storeslug, router]); // ✅ Only depend on user.id, not the whole data

  // ✅ Show loading state
  if (isPending || isCheckingMember) {
    return (
      <div className="flex justify-center bg-white items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-orange-500"></span>
          <p className="text-gray-600 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600">{error.message}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Redirect if not authenticated or not a member
  if (!data?.session || isMember === false) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Sidbar storeSlug={storeslug} />
        <div className="lg:ml-72 min-h-screen flex flex-col">
          <div className="fixed top-0 right-0 left-0 lg:left-72 z-40">
            <Topbar storeSlug={storeslug} />
          </div>
          <main className="flex-1 mt-16 lg:mt-18 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

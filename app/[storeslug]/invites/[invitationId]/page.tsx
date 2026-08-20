"use client";

import { authClient } from "@/lib/auth-client";
import { Briefcase, Building2, Mail, UserIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define types - match the actual API response
type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "canceled";

interface Invitation {
  id: string;
  organizationId: string;
  organizationName: string;
  inviterId: string;
  inviterEmail: string;
  inviterName?: string;
  email: string;
  role: "member" | "owner" | "admin" | "driver" | "staff";
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
}

interface ApiError {
  message?: string;
  code?: string;
  status?: number;
}

const InvitationPage = () => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const invitationId = params?.invitationId as string;
  const storeslug = params?.storeslug as string;
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    if (!invitationId) {
      toast.error("No invitation ID found");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await authClient.organization.acceptInvitation({
        invitationId: invitationId,
      });

      if (error) {
        console.error("Error accepting invitation:", error);
        toast.error(error?.message || "Failed to accept invitation");
        setError(error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Invitation accepted successfully!");

      if (data?.invitation?.organizationId) {
        router.push(`/${storeslug}/deliveries/${data.member.userId}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
      setError({ message: "Failed to accept invitation" });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectInvitation = async () => {
    if (!invitationId) {
      toast.error("No invitation ID found");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await authClient.organization.rejectInvitation({
        invitationId: invitationId,
      });

      if (error) {
        console.error("Error rejecting invitation:", error);
        toast.error(error?.message || "Failed to reject invitation");
        setError(error);
        setIsSubmitting(false);
        return;
      }

      toast.success("Invitation rejected");
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
      setError({ message: "Failed to reject invitation" });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetInvitation = async () => {
    if (!invitationId) {
      setError({ message: "No invitation ID provided" });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.organization.getInvitation({
        query: {
          id: invitationId,
        },
      });

      if (error) {
        console.error("Error fetching invitation:", error);
        setError(error);
        setLoading(false);
        return;
      }

      setInvitation(data);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError({ message: "Failed to load invitation" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInvitation();
  }, [invitationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
            <Mail className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to accept your invitation
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to view and accept this invitation. Please
            sign in or create an account to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() =>
                router.push(`/login?redirect=${window.location.pathname}`)
              }
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() =>
                router.push(`/sign-up?redirect=${window.location.pathname}`)
              }
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Create Account
            </button>
          </div>
          {invitationId && (
            <p className="text-xs text-gray-400 mt-4">
              You'll be redirected back to this invitation after signing in.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Something went wrong
          </h2>
          <p className="text-gray-500 mt-2">
            {error?.message || "Failed to load invitation. Please try again."}
          </p>
          <button
            onClick={handleGetInvitation}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 rounded-full p-4 inline-block mb-4">
            <svg
              className="w-12 h-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Invitation Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The invitation you're looking for doesn't exist or has expired.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-xl max-w-md">
        <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="bg-orange-100 text-orange-500 rounded-full p-4 inline-block mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">You're Invited!</h1>
          <p className="text-gray-500 mt-2">
            Join {invitation.organizationName || "the organization"} on our
            platform
          </p>
          {session?.user?.email && (
            <p className="text-sm text-gray-400 mt-2">
              Logged in as:{" "}
              <span className="font-semibold text-gray-700">
                {session.user.email}
              </span>
            </p>
          )}
          <div className="bg-white rounded-xl mt-5 shadow-lg p-8 border border-gray-200">
            <div className="space-y-4 mb-8">
              <div className="border-b border-gray-100 pb-4 flex flex-col items-start">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Organization
                </label>
                <p className="text-gray-800 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  {invitation.organizationName}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4 flex flex-col items-start">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Invited by
                </label>
                <p className="text-gray-800 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  {invitation.inviterEmail}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4 flex flex-col items-start">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Role
                </label>
                <p className="text-gray-800 flex items-center gap-2 capitalize">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  {invitation.role}
                </p>
              </div>
            </div>
            {invitation.status === "pending" && (
              <div className="flex items-center gap-5 w-full">
                <button
                  onClick={handleAcceptInvitation}
                  disabled={isSubmitting}
                  className={`bg-orange-500 w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 hover:bg-orange-600 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Accept"}
                </button>
                <button
                  onClick={handleRejectInvitation}
                  disabled={isSubmitting}
                  className={`bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 w-full py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Reject"}
                </button>
              </div>
            )}
            {invitation.status !== "pending" && (
              <div className="text-center py-2">
                <p className="text-gray-500">
                  This invitation has been {invitation.status}
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;

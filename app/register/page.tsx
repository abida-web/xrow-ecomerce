"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

// Define proper types
interface Organization {
  id: string;
  name: string;
  slug: string;
  // Add other properties as needed
}

const CreateStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
});

type CreateStoreForm = z.infer<typeof CreateStoreSchema>;

const CreateStorePage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreForm>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateStore(data: CreateStoreForm) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    try {
      await authClient.organization.create(
        {
          name: data.name,
          slug,
        },
        {
          onSuccess: () => {
            router.push(`/dashboard/${slug}`);
          },
          onError: (error: any) => {
            toast.error("Failed to create store", error);
          },
        },
      );
    } catch (error: any) {
      toast.error("Error creating store", error);
    }
  }
  const { data: organizaions, error } = authClient.useListOrganizations();
  const hasOrganization = !!session?.session?.activeOrganizationId;

  // Fix: Check if organizations is null or empty, show loading/empty state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  function setActiveOrganization(orgId: string, slug: string) {
    authClient.organization.setActive({ organizationId: orgId });
    router.push(`/dashboard/${slug}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-100 rounded-full p-3">
            <Store className="w-10 h-10 text-orange-500" />
          </span>
          <h1 className="text-3xl font-bold mt-4">Create Your Store</h1>
          <p className="text-sm text-gray-500 mt-2">
            {hasOrganization && organizaions && organizaions.length > 0
              ? "Manage your existing stores or create a new one"
              : "Set up your online store to start selling"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateStore)}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
        >
          {hasOrganization && organizaions && organizaions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Your Stores</h3>
              <div className="space-y-3">
                {organizaions.map((org) => (
                  <div
                    key={org.id}
                    className="border-2 border-gray-200 hover:border-orange-500 rounded-lg p-4 flex items-center justify-between transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {org.name}
                    </span>
                    <button
                      type="button" // Important: prevents form submission
                      onClick={() => setActiveOrganization(org.id, org.slug)}
                      className="bg-orange-500 text-white px-4 py-1.5 flex items-center gap-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                    >
                      Go to dashboard
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or create new
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              placeholder="My Awesome Store"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-shadow"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Creating Store..." : "Create Store"}
          </button>

          <p className="text-center text-sm text-gray-600">
            <a href="/" className="text-orange-500 hover:underline font-medium">
              ← Back to Home
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateStorePage;

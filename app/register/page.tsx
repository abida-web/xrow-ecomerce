"use client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getOwnnedOrganizations } from "@/app/actions/store-actions";
import { UploadButton } from "@/lib/utils/uploadthing";
import { deleteImageFromUploadthing } from "../actions/product-actions";

const CreateStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  logo: z.string().optional(),
});

type CreateStoreForm = z.infer<typeof CreateStoreSchema>;

const CreateStorePage = () => {
  const router = useRouter();
  const [selectTab, setSelectTab] = useState("STORES");
  const [logoPreview, setLogoPreview] = useState("");
  const { data: session, isPending } = authClient.useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreForm>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  async function handleCreateStore(data: CreateStoreForm) {
    if (!session?.session) {
      toast.error(
        "You need to sign in or create account before creating store ",
      );
      return;
    }
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    try {
      await authClient.organization.create(
        {
          name: data.name,
          slug,
          logo: data.logo,
        },
        {
          onSuccess: () => {
            toast.success("Store created successfully!");
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

  const { data: membersData } = useQuery<any>({
    queryKey: ["organization-members"],
    queryFn: async () => {
      const result = await getOwnnedOrganizations();
      return result || [];
    },
  });

  const organizations = membersData?.members || [];
  const hasOrganization = !!session?.session.activeOrganizationId;

  const removeImage = async (fileUrl: string) => {
    if (fileUrl) {
      const res = await deleteImageFromUploadthing(fileUrl);
      if (res?.success) {
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    }
    setLogoPreview("");
    setValue("logo", "");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  function setActiveOrganization(
    orgId: string,
    slug: string,
    role: string,
    id?: string,
  ) {
    authClient.organization.setActive({
      organizationId: orgId,
      organizationSlug: slug,
    });
    router.push(
      role === "driver" ? `/deliveries/${slug}/${id}` : `/dashboard/${slug}`,
    );
  }

  return (
    <div className="min-h-screen flex items-center text-black justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-100 rounded-full p-3">
            <Store className="w-10 h-10 text-orange-500" />
          </span>
          <h1 className="text-3xl font-bold mt-4 text-gray-800">
            Create Your Store
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {hasOrganization && organizations.length > 0
              ? "Manage your existing stores or create a new one"
              : "Set up your online store to start selling"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateStore)}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
        >
          {organizations.length > 0 && (
            <div className="space-y-3 ">
              <div role="tablist" className="tabs text-black tabs-border">
                <a
                  role="tab"
                  className={`tab !text-black hover:!text-orange-500 transition-all duration-500 hover:!text-black ${selectTab === "STORES" ? "tab-active !text-black hover:!text-orange-500" : ""}`}
                  onClick={() => setSelectTab("STORES")}
                >
                  Ownned
                </a>
                <a
                  role="tab"
                  className={`tab !text-black hover:!text-orange-500 hover:!text-black ${selectTab === "WORKSPACES" ? "tab-active !text-black hover:!text-orange-500" : ""}`}
                  onClick={() => setSelectTab("WORKSPACES")}
                >
                  Workspaces
                </a>
              </div>

              {selectTab === "STORES" && (
                <>
                  <div className="space-y-3">
                    {organizations
                      .filter((me: any) => me.role === "owner")
                      .map((mem: any) => (
                        <div
                          key={mem.id}
                          className="border-2 border-gray-200 hover:border-orange-400 rounded-lg p-4 flex items-center justify-between transition-colors bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {mem.organization.logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={mem.organization.logo}
                                alt={mem.organization.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-lg font-medium text-gray-800 truncate">
                              {mem.organization.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({mem.role})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveOrganization(
                                mem.organization.id,
                                mem.organization.slug,
                                mem.role,
                              )
                            }
                            className="bg-orange-500 text-white px-4 py-1.5 flex items-center gap-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                          >
                            Go to dashboard
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      ))}
                  </div>
                </>
              )}
              {selectTab === "WORKSPACES" && (
                <>
                  <div className="space-y-3">
                    {organizations
                      .filter((me: any) => me.role !== "owner")
                      .map((mem: any) => (
                        <div
                          key={mem.id}
                          className="border-2 border-gray-200 hover:border-orange-400 rounded-lg p-4 flex items-center justify-between transition-colors bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {mem.organization.logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={mem.organization.logo}
                                alt={mem.organization.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-lg font-medium text-gray-800 truncate">
                              {mem.organization.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({mem.role})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveOrganization(
                                mem.organization.id,
                                mem.organization.slug,
                                mem.role,
                                mem.userId,
                              )
                            }
                            className="bg-orange-500 text-white px-4 py-1.5 flex items-center gap-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                          >
                            Go to dashboard
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      ))}
                  </div>
                </>
              )}

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

          <div className="space-y-4">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Logo
              </label>

              {logoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(logoPreview)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove logo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Logo uploaded successfully. You can remove it to upload a
                    new one.
                  </p>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const logoUrl = res[0].ufsUrl || res[0].url;
                      setValue("logo", logoUrl);
                      setLogoPreview(logoUrl);
                      toast.success("Logo uploaded successfully");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors",
                    container: "w-full",
                  }}
                />
              )}
            </div>

            {/* Store Name */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-shadow text-gray-800 placeholder-gray-400"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Creating Store..." : "Create Store"}
          </button>

          <p className="text-center text-sm text-gray-600">
            {!session ? (
              <a
                href="/logoin"
                className="text-orange-500 hover:underline font-medium"
              >
                ← Log in
              </a>
            ) : (
              <a
                href="/"
                className="text-orange-500 hover:underline font-medium"
              >
                ← Back to Home
              </a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateStorePage;

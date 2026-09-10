"use client";
import CustomInput from "@/app/(seller)/dashboard/_components/CustomeInput";
import { authClient } from "@/lib/auth-client";
import { useSettingsStore } from "@/store/settings-store";
import React, { useEffect } from "react";
import { UploadButton } from "@/lib/utils/uploadthing";
import toast from "react-hot-toast";
import { deleteImageFromUploadthing } from "@/app/actions/product-actions";
import { X } from "lucide-react";

const GeneralSettings = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Use Zustand store
  const {
    formData,
    isLoading,
    error,
    success,
    setField,
    setLoading,
    setError,
    setSuccess,
    initializeForm,
  } = useSettingsStore();

  // Update form data when organization data loads
  useEffect(() => {
    if (activeOrganization) {
      initializeForm({
        name: activeOrganization.name || "",
        slug: activeOrganization.slug || "",
        email: activeOrganization.email || "",
        phone: activeOrganization.phone || "",
        city: activeOrganization.city || "",
        country: activeOrganization.country || "",
        address: activeOrganization.address || "",
        currency: activeOrganization.currency || "USD",
        timezone: activeOrganization.timezone || "UTC+00:00",
        language: activeOrganization.language || "",
        logo: activeOrganization.logo || "",
      });
    }
  }, [activeOrganization, initializeForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField(name as keyof typeof formData, value);
  };

  const handleUpdateContactInformation = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await authClient.organization.update({
        data: {
          email: formData.email || "",
          phone: formData.phone || "",
          city: formData.city || "",
          country: formData.country || "",
          address: formData.address || "",
        },
        organizationId: activeOrganization?.id,
      });

      if (error) {
        setError(error.message || "Failed to update organization");
        return;
      }

      setSuccess("Organization updated successfully!");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStoreInformation = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await authClient.organization.update({
        data: {
          logo: formData.logo,
        },
        organizationId: activeOrganization?.id,
      });

      if (error) {
        setError(error.message || "Failed to update organization");
        return;
      }

      setSuccess("Organization updated successfully!");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (fileURL: any) => {
    const fileKey = fileURL;
    if (fileKey) {
      const res = await deleteImageFromUploadthing(fileKey);
      if (res?.success) {
        toast.success("Image deleted successfully");
        setField("logo", ""); // Clear the logo field
      } else {
        toast.error("Failed to delete image");
      }
    } else {
      // If no file key, just clear the field
      setField("logo", "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">General</h1>
        <p className="text-sm text-orange-500">
          Manage and monitor all your active sessions
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Store Information Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-1">
            <h1 className="font-semibold text-gray-800">Store Information</h1>
            <p className="text-xs text-gray-500">
              Setting store and invoice information
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Logo
              </label>
              {!formData.logo && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      const logoUrl = res[0].ufsUrl || res[0].url;
                      setField("logo", logoUrl);
                      toast.success("Logo uploaded successfully");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg w-full transition-colors",
                    container: "w-full",
                  }}
                />
              )}
              {formData.logo && (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData?.logo}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(formData?.logo)}
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
              )}
            </div>
            <CustomInput
              label="Shop Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter shop name"
              required
            />
            <CustomInput
              label="Shop URL"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Enter shop URL"
            />
          </div>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              placeholder="USD"
            />
            <CustomInput
              label="Timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              placeholder="UTC+00:00"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleUpdateStoreInformation}
            disabled={isLoading}
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-1">
            <h1 className="font-semibold text-gray-800">Contact Information</h1>
            <p className="text-xs text-gray-500">
              How customers can contact your store
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              type="email"
            />
            <CustomInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              type="tel"
            />
            <CustomInput
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Select or enter country"
            />
          </div>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
            />
            <CustomInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleUpdateContactInformation}
            disabled={isLoading}
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;

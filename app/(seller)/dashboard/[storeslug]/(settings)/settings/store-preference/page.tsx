"use client";

import {
  createOrganizationSettings,
  updateOrganizationSettings,
  saveOrganizationsSettings,
  getOrganizationWithSettings,
  type StoreSettings,
} from "@/app/actions/settings";
import { authClient } from "@/lib/auth-client";
import { currencies, languages, timezones } from "@/lib/constants/currencies";
import { useSettingsStore } from "@/store/settings-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Storepreference = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const queryClient = useQueryClient();

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeStatus: "",
    storeVisibility: true,
    guestCheckout: true,
    showOutOfStock: false,
    allReviews: true,
    productPerPage: 20,
    productSort: "newest",
    autoCancelUnpaidOrder: false,
    cancelMin: 30,
  });

  const [hasSettings, setHasSettings] = useState<boolean | null>(null);
  const { formData, initializeForm, setFormData } = useSettingsStore();

  // ✅ Fetch settings from database on load
  const { data: organizationData, refetch: refetchSettings } = useQuery({
    queryKey: ["organization-settings", storeslug],
    queryFn: () => getOrganizationWithSettings(storeslug),
    enabled: !!storeslug,
  });

  // ✅ Update UI when settings are fetched from database
  useEffect(() => {
    if (organizationData?.settings) {
      const settings = organizationData.settings;
      setHasSettings(true);
      setStoreSettings({
        storeStatus: settings.storeStatus || "",
        storeVisibility: settings.storeVisibility ?? true,
        guestCheckout: settings.guestCheckout ?? true,
        showOutOfStock: settings.showOutOfStock ?? false,
        allReviews: settings.allReviews ?? true,
        productPerPage: settings.productPerPage ?? 20,
        productSort: settings.productSort || "newest",
        autoCancelUnpaidOrder: settings.autoCancelUnpaidOrder ?? false,
        cancelMin: settings.cancelMin ?? 30,
      });
    } else if (organizationData) {
      setHasSettings(false);
    }
  }, [organizationData]);

  useEffect(() => {
    if (activeOrganization) {
      initializeForm({
        ...formData,
        currency: activeOrganization.currency || "",
        timezone: activeOrganization.timezone || "",
        language: activeOrganization.language || "",
      });
    }
  }, [activeOrganization, initializeForm]);

  // ✅ CREATE Settings Mutation
  const createSettingsMutation = useMutation({
    mutationFn: async () => {
      const res = await createOrganizationSettings(storeslug, storeSettings);
      if (!res.success) {
        throw new Error(res.error || "Failed to create settings");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Settings created successfully!");
      setHasSettings(true);
      refetchSettings();
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
    },
    onError: (error: Error) => {
      if (error.message.includes("ALREADY_EXISTS")) {
        toast.error("Settings already exist. Use update instead.");
        setHasSettings(true);
      } else {
        toast.error(error.message || "Failed to create settings");
      }
    },
  });
  const settingId = organizationData?.settings?.id;
  // ✅ UPDATE Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      const res = await updateOrganizationSettings(
        storeslug,
        settingId,
        storeSettings,
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to update settings");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Settings updated successfully!");
      refetchSettings();
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
    },
    onError: (error: Error) => {
      if (error.message.includes("don't exist")) {
        toast.error("Settings don't exist. Creating instead.");
        setHasSettings(false);
        createSettingsMutation.mutate();
      } else {
        toast.error(error.message || "Failed to update settings");
      }
    },
  });

  // ✅ SMART SAVE Mutation (Create OR Update)
  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const res = await saveOrganizationsSettings(storeslug, storeSettings);
      if (!res.success) {
        throw new Error(res.error || "Failed to save settings");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Settings saved successfully!");
      setHasSettings(true);
      refetchSettings();
      queryClient.invalidateQueries({ queryKey: ["organization-settings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const handleUpdateStoreRegion = async () => {
    try {
      const { data, error } = await authClient.organization.update({
        data: {
          currency: formData.currency || "",
          timezone: formData.timezone || "",
          language: formData.language || "",
        },
        organizationId: activeOrganization?.id,
      });

      if (error) {
        toast.error(error.message || "Failed to update organization");
        return false;
      }
      toast.success("Regional settings updated successfully!");
      return true;
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  const handleSaveAllSettings = async () => {
    const toastId = toast.loading("Saving settings...");

    try {
      const regionSuccess = await handleUpdateStoreRegion();
      if (!regionSuccess) {
        toast.error("Failed to save regional settings", { id: toastId });
        return;
      }

      await saveSettingsMutation.mutateAsync();
      toast.success("All settings saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Error saving all settings:", error);
      toast.error("Failed to save all settings", { id: toastId });
    }
  };

  const handleCreateSettings = async () => {
    const toastId = toast.loading("Creating settings...");
    try {
      await createSettingsMutation.mutateAsync();
      toast.success("Settings created!", { id: toastId });
    } catch (error) {
      toast.error("Failed to create settings", { id: toastId });
    }
  };

  const handleUpdateSettings = async () => {
    const toastId = toast.loading("Updating settings...");
    try {
      await updateSettingsMutation.mutateAsync();
      toast.success("Settings updated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update settings", { id: toastId });
    }
  };

  const isPending =
    createSettingsMutation.isPending ||
    updateSettingsMutation.isPending ||
    saveSettingsMutation.isPending;

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Store Preferences</h1>
        <p className="text-sm text-orange-500">
          Control how your store behaves and how customers experience it.
        </p>
        {hasSettings !== null && (
          <span
            className={`text-xs mt-1 ${hasSettings ? "text-green-500" : "text-yellow-500"}`}
          >
            {hasSettings
              ? "✅ Settings configured"
              : "⚠️ No settings found - will create on save"}
          </span>
        )}
      </div>

      {/* Regional & Display Settings */}
      <div className="bg-white p-4 w-full rounded-2xl shadow-sm border border-gray-200 mt-5">
        <div className="flex flex-col space-y-1">
          <h1 className="font-semibold text-gray-800">Regional & Display</h1>
          <p className="text-xs text-gray-500">
            Setting store and invoice information
          </p>
        </div>

        <h1 className="mt-3 font-semibold text-orange-500">Currency</h1>
        <p className="text-xs text-gray-500">
          Currency used throughout your store and orders.
        </p>
        <select
          value={formData.currency}
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value })
          }
          className="w-full mt-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          ))}
        </select>

        <h1 className="mt-3 font-semibold text-orange-500">Timezone</h1>
        <p className="text-xs text-gray-500">
          Used for order times, reports and scheduled operations.
        </p>
        <select
          value={formData.timezone}
          onChange={(e) =>
            setFormData({ ...formData, timezone: e.target.value })
          }
          className="w-full mt-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
        >
          {timezones.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </select>

        <h1 className="mt-3 font-semibold text-orange-500">Language</h1>
        <p className="text-xs text-gray-500">
          Language used in your seller dashboard.
        </p>
        <select
          value={formData.language}
          onChange={(e) =>
            setFormData({ ...formData, language: e.target.value })
          }
          className="w-full mt-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleUpdateStoreRegion}
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Regional Settings
          </button>
        </div>
      </div>

      {/* Store Visibility */}
      <div className="bg-white p-4 w-full rounded-2xl shadow-sm border border-gray-200 mt-5">
        <h1 className="font-semibold text-gray-800">Store Visibility</h1>
        <p className="text-xs text-gray-500">
          Control whether your store is accessible to customers.
        </p>

        <div className="flex flex-col gap-4 mt-3">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="storeVisibility"
              checked={storeSettings.storeVisibility === true}
              onChange={() =>
                setStoreSettings({
                  ...storeSettings,
                  storeVisibility: true,
                })
              }
              className="radio radio-primary mt-1 bg-orange-100 border-orange-300 checked:bg-orange-200 checked:text-orange-600 checked:border-orange-600"
            />
            <div>
              <span className="font-medium text-gray-800">Visible</span>
              <p className="text-xs text-gray-500">
                Customers can browse products and place orders
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="storeVisibility"
              checked={storeSettings.storeVisibility === false}
              onChange={() =>
                setStoreSettings({
                  ...storeSettings,
                  storeVisibility: false,
                })
              }
              className="radio radio-primary mt-1 bg-orange-100 border-orange-300 checked:bg-orange-200 checked:text-orange-600 checked:border-orange-600"
            />
            <div>
              <span className="font-medium text-gray-800">
                Temporarily Closed
              </span>
              <p className="text-xs text-gray-500">
                Store is hidden from customers. Only admins can access it.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Customer Experience */}
      <div className="bg-white p-4 w-full rounded-2xl shadow-sm border border-gray-200 mt-5">
        <h1 className="font-semibold text-gray-800">Customer Experience</h1>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm font-medium text-orange-500">
              Guest Checkout
            </p>
            <p className="text-xs text-gray-500">
              Allow customers to order without creating an account
            </p>
          </div>
          <input
            type="checkbox"
            checked={storeSettings.guestCheckout}
            onChange={() =>
              setStoreSettings({
                ...storeSettings,
                guestCheckout: !storeSettings.guestCheckout,
              })
            }
            className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm font-medium text-orange-500">
              Show out-of-stock products
            </p>
            <p className="text-xs text-gray-500">
              Keep unavailable products visible in your store.
            </p>
          </div>
          <input
            type="checkbox"
            checked={storeSettings.showOutOfStock}
            onChange={() =>
              setStoreSettings({
                ...storeSettings,
                showOutOfStock: !storeSettings.showOutOfStock,
              })
            }
            className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm font-medium text-orange-500">
              Allow products reviews
            </p>
            <p className="text-xs text-gray-500">
              Customers can leave reviews after purchasing.
            </p>
          </div>
          <input
            type="checkbox"
            checked={storeSettings.allReviews}
            onChange={() =>
              setStoreSettings({
                ...storeSettings,
                allReviews: !storeSettings.allReviews,
              })
            }
            className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
          />
        </div>
      </div>

      {/* Product Display */}
      <div className="bg-white p-4 w-full rounded-2xl shadow-sm border border-gray-200 mt-5">
        <h1 className="font-semibold text-gray-800">Products Display</h1>
        <p className="text-xs text-gray-500">Default product sorting</p>

        <select
          value={storeSettings.productSort}
          onChange={(e) =>
            setStoreSettings({
              ...storeSettings,
              productSort: e.target.value,
            })
          }
          className="w-full mt-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>

        <div className="mt-4">
          <p className="text-sm font-medium text-orange-500">
            Products Per Page
          </p>
          <p className="text-xs text-gray-500">
            Number of products shown per page
          </p>
          <input
            type="number"
            value={storeSettings.productPerPage}
            onChange={(e) =>
              setStoreSettings({
                ...storeSettings,
                productPerPage: parseInt(e.target.value) || 20,
              })
            }
            min="1"
            max="100"
            className="w-full mt-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Order Preferences */}
      <div className="bg-white p-4 w-full rounded-2xl shadow-sm border border-gray-200 mt-5">
        <h1 className="font-semibold text-gray-800">Order Preferences</h1>
        <p className="text-xs text-gray-500">
          Configure how orders are processed and managed.
        </p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm font-medium text-orange-500">
              Auto Cancel Unpaid Orders
            </p>
            <p className="text-xs text-gray-500">
              Automatically cancel orders that remain unpaid
            </p>
          </div>
          <input
            type="checkbox"
            checked={storeSettings.autoCancelUnpaidOrder}
            onChange={() =>
              setStoreSettings({
                ...storeSettings,
                autoCancelUnpaidOrder: !storeSettings.autoCancelUnpaidOrder,
              })
            }
            className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
          />
        </div>

        {storeSettings.autoCancelUnpaidOrder && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              Cancel After (minutes)
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Time after which unpaid orders are automatically cancelled
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setStoreSettings({
                    ...storeSettings,
                    cancelMin: Math.max(5, storeSettings.cancelMin - 5),
                  })
                }
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-700 font-medium"
              >
                −
              </button>
              <input
                type="number"
                value={storeSettings.cancelMin}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    cancelMin: parseInt(e.target.value) || 30,
                  })
                }
                min="5"
                max="1440"
                className="w-24 bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() =>
                  setStoreSettings({
                    ...storeSettings,
                    cancelMin: Math.min(1440, storeSettings.cancelMin + 5),
                  })
                }
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-700 font-medium"
              >
                +
              </button>
              <span className="text-sm text-gray-500">minutes</span>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min="5"
                max="1440"
                step="5"
                value={storeSettings.cancelMin}
                onChange={(e) =>
                  setStoreSettings({
                    ...storeSettings,
                    cancelMin: parseInt(e.target.value),
                  })
                }
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 min</span>
                <span>1440 min (24 hours)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        {hasSettings === false && (
          <button
            type="button"
            onClick={handleCreateSettings}
            disabled={isPending}
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {createSettingsMutation.isPending
              ? "Creating..."
              : "Create Settings"}
          </button>
        )}

        {hasSettings === true && (
          <button
            type="button"
            onClick={handleUpdateSettings}
            disabled={isPending}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {updateSettingsMutation.isPending
              ? "Updating..."
              : "Update Settings"}
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={isPending}
          className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {saveSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
};

export default Storepreference;

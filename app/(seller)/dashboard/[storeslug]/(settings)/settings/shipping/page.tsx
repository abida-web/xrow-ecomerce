"use client";

import CustomInput from "@/app/(seller)/dashboard/_components/CustomeInput";
import {
  getOrganizationWithShippingSettings,
  saveOrganizationsrateSettings,
  saveOrganizationsShippingSettings,
  saveOrganizationsZonShippingSettings,
} from "@/app/actions/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ShippingPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  // State for shipping method
  const [methodForm, setMethodForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // State for shipping zone
  const [zoneForm, setZoneForm] = useState({
    zoneName: "",
    zoneActive: true,
  });
  //State for rate form
  const [rateForm, setRateForm] = useState({
    methodId: "",
    zoneId: "",
    price: 0,
  });
  const {
    data: data,
    refetch: refetchSettings,
    isLoading,
  } = useQuery({
    queryKey: ["organization-shipping-settings", storeslug],
    queryFn: () => getOrganizationWithShippingSettings(storeslug),
    enabled: !!storeslug,
  });

  const queryClient = useQueryClient();

  // Mutation for saving shipping method
  const createMethodMutation = useMutation({
    mutationFn: async () => {
      const res = await saveOrganizationsShippingSettings(
        storeslug,
        methodForm,
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to create shipping method");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Shipping method created successfully");
      setMethodForm({
        name: "",
        description: "",
        isActive: true,
      });
      refetchSettings();
      queryClient.invalidateQueries({
        queryKey: ["organization-shipping-settings"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create shipping method");
    },
  });

  // Mutation for saving shipping zone
  const createZoneMutation = useMutation({
    mutationFn: async () => {
      const res = await saveOrganizationsZonShippingSettings(
        storeslug,
        zoneForm,
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to create shipping zone");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Shipping zone created successfully");
      setZoneForm({
        zoneName: "",
        zoneActive: true,
      });
      refetchSettings();
      queryClient.invalidateQueries({
        queryKey: ["organization-shipping-settings"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create shipping zone");
    },
  });
  // Mutation for saving shipping rate
  const createRateMutation = useMutation({
    mutationFn: async () => {
      const res = await saveOrganizationsrateSettings(storeslug, rateForm);
      if (!res.success) {
        throw new Error(res.error || "Failed to create shipping rate");
      }
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Shipping rate created successfully");
      // Fix: Reset rate form, not zone form
      setRateForm({
        methodId: "",
        zoneId: "",
        price: 0,
      });
      refetchSettings();
      queryClient.invalidateQueries({
        queryKey: ["organization-shipping-settings"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create shipping rate");
    },
  });
  const handleCreateMethod = async () => {
    if (!methodForm.name.trim()) {
      toast.error("Please enter a method name");
      return;
    }
    await createMethodMutation.mutateAsync();
  };

  const handleCreateZone = async () => {
    if (!zoneForm.zoneName.trim()) {
      toast.error("Please enter a zone name");
      return;
    }
    await createZoneMutation.mutateAsync();
  };
  const handleCreateRate = async () => {
    if (!rateForm.price) {
      toast.error("Please enter a rate name");
      return;
    }
    await createRateMutation.mutateAsync();
  };
  // Handle method form field changes
  const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodToggle = () => {
    setMethodForm((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Handle zone form field changes
  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZoneForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleZoneToggle = () => {
    setZoneForm((prev) => ({
      ...prev,
      zoneActive: !prev.zoneActive,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Shipping</h1>
        <p className="text-sm text-orange-500">
          Manage how customers receive their orders.
        </p>
      </div>

      {/* Display Existing Shipping Settings */}
      {isLoading ? (
        <div className="mt-6 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading shipping settings...</p>
        </div>
      ) : (
        data && (
          <div className="mt-6 space-y-6">
            {/* Shipping Methods List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Shipping Methods
              </h2>
              {data.shippingMethods?.length > 0 ? (
                <div className="space-y-3">
                  {data.shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {method.name}
                          </p>
                          {method.description && (
                            <p className="text-sm text-gray-500">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          method.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {method.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No shipping methods yet</p>
                </div>
              )}
            </div>

            {/* Shipping Zones List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Shipping Zones
              </h2>
              {data.shippingZones?.length > 0 ? (
                <div className="space-y-3">
                  {data.shippingZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {zone.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          zone.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {zone.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No shipping zones yet</p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Create Forms Side by Side */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Add New Shipping Method Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="font-semibold text-gray-800 mb-5">
            Add New Shipping Method
          </h1>
          <div className="space-y-4">
            <CustomInput
              name="name"
              value={methodForm.name}
              onChange={handleMethodChange}
              placeholder="Method name"
              label="Method Name"
            />
            <CustomInput
              name="description"
              value={methodForm.description}
              onChange={handleMethodChange}
              placeholder="Description here"
              label="Description"
            />

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={methodForm.isActive}
                onChange={handleMethodToggle}
                className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
              />
              <div>
                <span className="font-medium text-gray-800">Active</span>
                <p className="text-xs text-gray-500">
                  Allow the method to be active
                </p>
              </div>
            </label>
            <button
              type="button"
              onClick={handleCreateMethod}
              disabled={createMethodMutation.isPending}
              className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {createMethodMutation.isPending
                ? "Creating Method..."
                : "Create Shipping Method"}
            </button>
          </div>
        </div>

        {/* Add New Shipping Zone Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="font-semibold text-gray-800 mb-5">
            Add New Shipping Zone
          </h1>
          <div className="space-y-4">
            <CustomInput
              name="zoneName"
              value={zoneForm.zoneName}
              onChange={handleZoneChange}
              placeholder="Zone name"
              label="Zone Name"
            />
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={zoneForm.zoneActive}
                onChange={handleZoneToggle}
                className="toggle toggle-sm bg-gray-200 [--tglbg:theme(colors.orange.500)] checked:bg-orange-500"
              />
              <div>
                <span className="font-medium text-gray-800">Active Zone</span>
                <p className="text-xs text-gray-500">
                  Allow this zone to be active
                </p>
              </div>
            </label>
            <button
              type="button"
              onClick={handleCreateZone}
              disabled={createZoneMutation.isPending}
              className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {createZoneMutation.isPending
                ? "Creating Zone..."
                : "Create Shipping Zone"}
            </button>
          </div>
        </div>
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="font-semibold text-gray-800 mb-5">Add Rate</h1>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Method
              </label>
              <select
                value={rateForm.methodId}
                onChange={(e) =>
                  setRateForm({
                    ...rateForm,
                    methodId: e.target.value,
                  })
                }
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select a method</option>
                {data?.shippingMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Zone
              </label>
              <select
                value={rateForm.zoneId}
                onChange={(e) =>
                  setRateForm({
                    ...rateForm,
                    zoneId: e.target.value,
                  })
                }
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Select a zone</option>
                {data?.shippingZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <CustomInput
                name="price"
                type="number"
                value={rateForm.price.toString()}
                onChange={(e) =>
                  setRateForm({
                    ...rateForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter price"
                label="Price"
                step="0.01"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateRate}
            disabled={createRateMutation.isPending}
            className="w-full px-6 py-3 mt-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {createRateMutation.isPending
              ? "Adding rate..."
              : "Add Shipping Rate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;

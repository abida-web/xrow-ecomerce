// stores/settings-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsFormData {
  name: string;
  slug: string;
  logo?: string | null | undefined | undefined;
  metadata?: any;
  description?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  country?: string | undefined;
  city?: string | undefined;
  address?: string | undefined;
  currency?: string | undefined;
  timezone?: string | undefined;
  language?: string | undefined;
}

interface SettingsState {
  formData: SettingsFormData;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  setFormData: (data: Partial<SettingsFormData>) => void;
  setField: (field: keyof SettingsFormData, value: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  resetForm: () => void;
  initializeForm: (data: SettingsFormData) => void;
}

const defaultFormData: SettingsFormData = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  address: "",
  currency: "USD",
  timezone: "UTC+00:00",
  language: "",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      formData: defaultFormData,
      isLoading: false,
      error: null,
      success: null,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setSuccess: (success) => set({ success }),

      resetForm: () =>
        set({
          formData: defaultFormData,
          isLoading: false,
          error: null,
          success: null,
        }),

      initializeForm: (data) =>
        set({
          formData: data,
          isLoading: false,
          error: null,
          success: null,
        }),
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        formData: state.formData,
        currency: state.formData.currency,
        timezone: state.formData.timezone,
      }),
    },
  ),
);

// Selectors for better performance
export const useSettingsFormData = () =>
  useSettingsStore((state) => state.formData);
export const useSettingsLoading = () =>
  useSettingsStore((state) => state.isLoading);
export const useSettingsError = () => useSettingsStore((state) => state.error);
export const useSettingsSuccess = () =>
  useSettingsStore((state) => state.success);

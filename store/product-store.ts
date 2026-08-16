import { create } from "zustand";
import { getCategories } from "@/app/actions/product-actions";

interface ProductOptionInput {
  id: string | number;
  name: string;
  value: string[];
}
interface VariantOptionValues {
  optionId: string | number;
  optionName: string;
  optionValueId: string;
}
interface VariantImage {
  id?: string;
  url: string;
  isPrimary: boolean;
}

interface Variant {
  id?: string;
  sku: string;
  price: string;
  stock: string;
  comparePriceAt: string;
  costPrice: string;
  variantImages: VariantImage[];
  optionValues: string[];
}

interface ImageData {
  id?: string;
  url: string;
  thumb?: string;
  display_url?: string;
}

interface CategoryProps {
  id: string;
  name: string;
}

type VariantKey = keyof Variant;

interface ProductState {
  productForm: {
    organizationId: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    featured: boolean;
    status: string;
    brand: string;
    variants: Variant[];
    options: ProductOptionInput[];
    images: ImageData[];
  };
  categories: CategoryProps[];
  uploading: boolean;
  currentVariant: Variant;
  storeslug: string;
  currentProductOption: ProductOptionInput;

  // Setters
  setProductForm: (form: any) => void;
  setCategories: (categories: CategoryProps[]) => void;
  setUploading: (uploading: boolean) => void;
  setCurrentVariant: (variant: Variant) => void;
  setCurrentProductOption: (productOption: ProductOptionInput) => void;
  setStoreslug: (slug: string) => void;

  // Variant handlers
  handleVariantChange: (field: VariantKey, value: string) => void;
  handleAddVariant: () => void;
  removeVariant: (index: number) => void;

  // Product option handlers
  handleAddProductOption: () => void;
  handleRemoveProductOption: (optId: string | number) => void;
  handleRemoveValueField: (optId: string | number, index: number) => void;

  // Image handlers
  handleUploadImage: (file: File) => Promise<string | null>;
  handleUploadVariantImage: (
    file: File,
    variantIndex: number,
  ) => Promise<string | null>;
  removeVariantImage: (variantIndex: number, imageIndex: number) => void;
  removeImage: (index: number) => void;

  // Other
  fetchCategories: () => Promise<void>;
  resetForm: () => void;
}

export const useProduct = create<ProductState>((set, get) => ({
  // Initial state
  productForm: {
    organizationId: "",
    categoryId: "",
    name: "",
    description: "",
    featured: false,
    status: "draft",
    slug: "",
    brand: "",
    variants: [],
    options: [],
    images: [],
  },
  currentProductOption: {
    id: Date.now(),
    name: "",
    value: [""],
  },
  setCurrentProductOption: (currentProductOption) =>
    set({ currentProductOption }),
  categories: [],
  uploading: false,
  currentVariant: {
    sku: "",
    price: "",
    stock: "",
    comparePriceAt: "",
    costPrice: "",
    variantImages: [],
    optionValues: [],
  },
  storeslug: "",

  // Setters
  setProductForm: (form) => set({ productForm: form }),
  setCategories: (categories) => set({ categories }),
  setUploading: (uploading) => set({ uploading }),
  setCurrentVariant: (currentVariant) => set({ currentVariant }),
  setStoreslug: (storeslug) => set({ storeslug }),

  // Variant handlers
  handleVariantChange: (field, value) => {
    set((state) => ({
      currentVariant: {
        ...state.currentVariant,
        [field]: value,
      },
    }));
  },

  handleAddVariant: () => {
    const { currentVariant } = get();
    // Validate required fields
    if (!currentVariant.sku || !currentVariant.price || !currentVariant.stock) {
      console.error("SKU, Price, and Stock are required");
      return;
    }

    set((state) => ({
      productForm: {
        ...state.productForm,
        variants: [...state.productForm.variants, { ...currentVariant }],
      },
      currentVariant: {
        sku: "",
        price: "",
        stock: "",
        comparePriceAt: "",
        costPrice: "",
        variantImages: [],
        optionValues: [],
      },
    }));
  },

  removeVariant: (index) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        variants: state.productForm.variants.filter((_, i) => i !== index),
      },
    }));
  },

  // Product option handlers
  handleAddProductOption: () => {
    const { currentProductOption } = get();
    if (!currentProductOption.name) {
      console.error("Option name is required");
      return;
    }

    set((state) => ({
      productForm: {
        ...state.productForm,
        options: [...state.productForm.options, { ...currentProductOption }],
      },
      currentProductOption: {
        id: Date.now() + 1,
        name: "",
        value: [""],
      },
    }));
  },

  handleRemoveProductOption: (optId) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        options: state.productForm.options.filter((opt) => opt.id !== optId),
      },
    }));
  },

  handleRemoveValueField: (optId, index) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        options: state.productForm.options.map((opt) => {
          if (opt.id === optId) {
            return {
              ...opt,
              value: opt.value.filter((_, idx) => idx !== index),
            };
          }
          return opt;
        }),
      },
    }));
  },

  // Image handlers
  handleUploadImage: async (file) => {
    set({ uploading: true });
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=c9668feeda70f40e354b4e3ae6258cf8",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        const imageData = {
          url: data.data.url,
          thumb: data.data.thumb?.url,
          display_url: data.data.display_url,
        };

        set((state) => ({
          productForm: {
            ...state.productForm,
            images: [...state.productForm.images, imageData],
          },
        }));

        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      set({ uploading: false });
    }
  },

  handleUploadVariantImage: async (file, variantIndex) => {
    set({ uploading: true });
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=c9668feeda70f40e354b4e3ae6258cf8",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        set((state) => ({
          productForm: {
            ...state.productForm,
            variants: state.productForm.variants.map((variant, index) =>
              index === variantIndex
                ? {
                    ...variant,
                    variantImages: [
                      ...variant.variantImages,
                      {
                        url: data.data.url,
                        isPrimary: variant.variantImages.length === 0,
                      },
                    ],
                  }
                : variant,
            ),
          },
        }));

        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading variant image:", error);
      return null;
    } finally {
      set({ uploading: false });
    }
  },

  removeImage: (index) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        images: state.productForm.images.filter((_, i) => i !== index),
      },
    }));
  },

  removeVariantImage: (variantIndex, imageIndex) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        variants: state.productForm.variants.map((variant, index) =>
          index === variantIndex
            ? {
                ...variant,
                variantImages: variant.variantImages.filter(
                  (_, i) => i !== imageIndex,
                ),
              }
            : variant,
        ),
      },
    }));
  },

  fetchCategories: async () => {
    try {
      const res = await getCategories();
      set({ categories: res });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  resetForm: () => {
    set({
      productForm: {
        organizationId: "",
        categoryId: "",
        name: "",
        description: "",
        status: "draft",
        featured: false,
        slug: "",
        brand: "",
        variants: [],
        options: [],
        images: [],
      },
      currentVariant: {
        sku: "",
        price: "",
        stock: "",
        comparePriceAt: "",
        costPrice: "",
        variantImages: [],
        optionValues: [],
      },
      currentProductOption: {
        id: Date.now(),
        name: "",
        value: [""],
      },
      uploading: false,
    });
  },
}));

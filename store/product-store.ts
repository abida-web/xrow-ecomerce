import { create } from "zustand";
import { getCategories } from "@/app/actions/product-actions";

interface Variant {
  id?: string;
  sku: string;
  price: string;
  stock: string;
  option1?: string;
  option1Value?: string;
  option2?: string;
  option2Value?: string;
  option3?: string;
  option3Value?: string;
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
    description: string;
    status: string;
    comparePriceAt: string;
    costPrice: string;
    brand: string;
    weight: string;
    weightUnit: string;
    variants: Variant[];
    images: ImageData[];
  };
  categories: CategoryProps[];
  uploading: boolean;
  currentVariant: Variant;
  storeslug: string;

  setProductForm: (form: any) => void;
  setCategories: (categories: CategoryProps[]) => void;
  setUploading: (uploading: boolean) => void;
  setCurrentVariant: (variant: Variant) => void;
  setStoreslug: (slug: string) => void;
  handleVariantChange: (field: VariantKey, value: string) => void;
  handleAddVariant: () => void;
  removeVariant: (index: number) => void;
  handleUploadImage: (file: File) => Promise<string | null>;
  removeImage: (index: number) => void;
  fetchCategories: () => Promise<void>;
  resetForm: () => void;
}

export const useProduct = create<ProductState>((set, get) => ({
  productForm: {
    organizationId: "",
    categoryId: "",
    name: "",
    description: "",
    status: "draft",
    comparePriceAt: "",
    costPrice: "",
    brand: "",
    weight: "",
    weightUnit: "kg",
    variants: [],
    images: [],
  },
  categories: [],
  uploading: false,
  currentVariant: {
    sku: "",
    price: "",
    stock: "",
    option1: "",
    option1Value: "",
    option2: "",
    option2Value: "",
    option3: "",
    option3Value: "",
  },
  storeslug: "",

  setProductForm: (form) => set({ productForm: form }),
  setCategories: (categories) => set({ categories }),
  setUploading: (uploading) => set({ uploading }),
  setCurrentVariant: (currentVariant) => set({ currentVariant }),
  setStoreslug: (storeslug) => set({ storeslug }),

  handleVariantChange: (field, value) => {
    set((state) => ({
      currentVariant: {
        ...state.currentVariant,
        [field]: value,
      },
    }));
  },

  handleAddVariant: () => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        variants: [...state.productForm.variants, { ...state.currentVariant }],
      },
      currentVariant: {
        sku: "",
        price: "",
        stock: "",
        option1: "",
        option1Value: "",
        option2: "",
        option2Value: "",
        option3: "",
        option3Value: "",
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

  removeImage: (index) => {
    set((state) => ({
      productForm: {
        ...state.productForm,
        images: state.productForm.images.filter((_, i) => i !== index),
      },
    }));
  },

  fetchCategories: async () => {
    const res = await getCategories();
    set({ categories: res });
  },

  resetForm: () => {
    set({
      productForm: {
        organizationId: "",
        categoryId: "",
        name: "",
        description: "",
        status: "draft",
        comparePriceAt: "",
        costPrice: "",
        brand: "",
        weight: "",
        weightUnit: "kg",
        variants: [],
        images: [],
      },
      currentVariant: {
        sku: "",
        price: "",
        stock: "",
        option1: "",
        option1Value: "",
        option2: "",
        option2Value: "",
        option3: "",
        option3Value: "",
      },
      uploading: false,
    });
  },
}));

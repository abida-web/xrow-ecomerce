"use client";

import { ImagePlus, LayersPlus, PackagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CustomInput from "../../../_components/CustomeInput";
import { useParams } from "next/navigation";
import { useProduct } from "@/store/product-store";
import ProductForm from "../../../_components/ProductForm";
import toast from "react-hot-toast";

const NewProduct = () => {
  const params = useParams();
  const storeslug = params.storeslug;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    productForm,
    setCurrentVariant,
    setProductForm,
    fetchCategories,
    setStoreslug,
  } = useProduct();

  useEffect(() => {
    if (storeslug) {
      setStoreslug(storeslug as string);
    }
    fetchCategories();
  }, [storeslug]);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productForm, storeslug }),
      });

      if (res.ok) {
        toast.success("Product submitted successfully");
        setProductForm({
          organizationId: "",
          categoryId: "",
          name: "",
          description: "",
          featured: false,
          status: "draft",
          brand: "",
          variants: [],
          options: [],
          images: [],
        });
        setCurrentVariant({
          sku: "",
          price: "",
          stock: "",
          comparePriceAt: "",
          costPrice: "",
          variantImages: [],
          optionValues: [],
        });
      } else {
        toast.error("Product submission failed");
        // You might want to set an error state here
      }
    } catch (error: any) {
      toast.error(error?.message);
      // Set error state to show user feedback
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <ProductForm
        isSubmitting={isSubmitting}
        type="add"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewProduct;

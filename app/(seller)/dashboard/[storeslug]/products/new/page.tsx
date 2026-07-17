"use client";

import { ImagePlus, LayersPlus, PackagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CustomInput from "../../../_components/CustomeInput";
import { useParams } from "next/navigation";
import { useProduct } from "@/store/product-store";
import ProductForm from "../../../_components/ProductForm";

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
        console.log("Product submitted successfully");
        setProductForm({
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
        });
        setCurrentVariant({
          sku: "",
          price: "",
          stock: "",
          option1: "",
          option1Value: "",
          option2: "",
          option2Value: "",
          option3: "",
          option3Value: "",
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Submission failed:", res.status, errorData);
        // You might want to set an error state here
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error submitting product:", error);
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

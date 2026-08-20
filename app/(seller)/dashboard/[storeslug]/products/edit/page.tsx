"use client";

import {
  addNewOptionToProduct,
  getProduct,
} from "@/app/actions/product-actions";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import ProductForm from "../../../_components/ProductForm";
import { useProduct } from "@/store/product-store";
import { useState } from "react";
import toast from "react-hot-toast";

const EditPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug); // or whatever your param is named
  const { productForm } = useProduct();
  const searchParams = useSearchParams();
  const getSearchParam = searchParams.get("product");
  const slug = getSearchParam ? String(getSearchParam) : "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isPending, data, refetch } = useQuery({
    queryKey: ["getProduct", storeslug, slug],
    queryFn: () => getProduct({ storeslug, slug }),
    enabled: !!slug, // Only run query if productId exists
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10 mt-30 text-orange-500">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (!data) return <div>No product found</div>;

  const handleEdite = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/dashboard/products/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productForm, storeslug }),
      });
      if (res.ok) {
        toast.success("Product edited successfully");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <ProductForm
        intialData={data}
        refetch={refetch}
        isSubmitting={isSubmitting}
        handleSubmit={handleEdite}
        type="edit"
      />
    </div>
  );
};

export default EditPage;

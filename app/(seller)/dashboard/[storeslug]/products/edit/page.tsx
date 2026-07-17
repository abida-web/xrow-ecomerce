"use client";

import { getProduct } from "@/app/actions/product-actions";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import ProductForm from "../../../_components/ProductForm";
import { useProduct } from "@/store/product-store";
import { useState } from "react";

const EditPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug); // or whatever your param is named
  const { productForm } = useProduct();
  const searchParams = useSearchParams();
  const getSearchParam = searchParams.get("productId");
  const productId = getSearchParam ? String(getSearchParam) : "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isPending, data } = useQuery({
    queryKey: ["getProduct", storeslug, productId],
    queryFn: () => getProduct({ storeslug, productId }),
    enabled: !!productId, // Only run query if productId exists
  });

  if (isPending) return <div>Loading...</div>;
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
        isSubmitting={isSubmitting}
        handleSubmit={handleEdite}
        type="edit"
      />
    </div>
  );
};

export default EditPage;

"use client";

import {
  deleteImageFromUploadthing,
  getVariantsList,
  removeVariant,
} from "@/app/actions/product-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Edit3, LayersPlus, Plus, Trash2Icon, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import CustomInput from "../../../_components/CustomeInput";
import { useProduct } from "@/store/product-store";
import toast from "react-hot-toast";
import { UploadButton } from "@/lib/utils/uploadthing";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = String(params.id);
  const storeslug = String(params.storeslug);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  const {
    currentVariant,
    setCurrentVariant,
    currentProductOption,
    setCurrentProductOption,
  } = useProduct();

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["variants", productId, storeslug],
    queryFn: () => getVariantsList(storeslug, productId),
    enabled: !!productId,
  });

  const handleDeleteVariant = async (variantId: string) => {
    const res = await removeVariant({ storeslug, variantId });
    if (res.success) {
      toast.success("Variant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["product"] });
    } else {
      toast.error("Failed to delete variant");
    }
  };
  const handleEditClick = (variant: any) => {
    console.log("Edit clicked, variant data:", variant); // Debug - see what's actually passed

    // Check both variantImages and images
    const images = variant.variantImages || variant.images || [];
    console.log("Images found:", images); // Debug

    setCurrentVariant({
      sku: variant.sku || "",
      price: String(variant.price || ""),
      stock: String(variant.stock || ""),
      comparePriceAt: variant.comparePriceAt || "",
      costPrice: variant.costPrice || "",
      variantImages: images.map((img: any) => ({
        url: img.url,
        filekey: img.key || img.filekey || img.fileKey || null,
        fileKey: img.key || img.filekey || img.fileKey || null,
        isPrimary: img.isPrimary || false,
      })),
      optionValues:
        variant.optionValues?.map(
          (val: any) => val.productOptionValue?.value || val.value || "",
        ) || [],
    });

    setSelectedVariantId(variant.id);
    setOpenModal(true);
    setType("edit");
  };
  const handleAddClick = () => {
    setCurrentVariant({
      sku: "",
      price: "",
      stock: "",
      comparePriceAt: "",
      costPrice: "",
      variantImages: [],
      optionValues: [],
    });

    setSelectedVariantId(null);
    setOpenModal(true);
    setType("add");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVariantId(null);
    setCurrentVariant({
      sku: "",
      price: "",
      stock: "",
      comparePriceAt: "",
      costPrice: "",
      variantImages: [],
      optionValues: [],
    });
  };

  const queryClient = useQueryClient();
  const options = data?.options;
  const createmutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/dashboard/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentVariant, storeslug, productId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create variant");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants", productId, storeslug],
      });
      toast.success("Variant created successfully");
      handleCloseModal();
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create variant");
    },
  });

  const removeImage = async (url: string) => {
    const res = await deleteImageFromUploadthing(url);
    if (res?.success) {
      toast.success("Image deleted successfully");
    } else {
      toast.error("Failed to delete image");
    }
  };

  const updatemutation = useMutation({
    mutationFn: async (varId: string) => {
      const res = await fetch(`/api/dashboard/variants/${varId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentVariant,
          storeslug,
          productId,
          currentProductOption,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update variant");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants", productId, storeslug],
      });
      toast.success("Variant updated successfully");
      handleCloseModal();
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update variant");
    },
  });

  const handleCreateVariant = (e: React.FormEvent) => {
    e.preventDefault();
    createmutation.mutate();
  };

  const handleUpdateVariant = (e: React.FormEvent, variantId: string) => {
    e.preventDefault();
    if (!variantId) {
      toast.error("No variant selected for update");
      return;
    }
    updatemutation.mutate(variantId);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-500">Loading variants...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading variants: {error.message}</p>
      </div>
    );
  }

  if (!data?.variantsList || data.variantsList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No variants found for this product.</p>
        <button
          onClick={handleAddClick}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add First Variant
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleAddClick}
        className="text-orange-500 mb-3 flex items-center gap-2 bg-white border border-orange-200 rounded-full py-1 px-3 transition-colors hover:bg-orange-50"
      >
        <Plus size={15} />
        Add Variant
      </button>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Variant</th>
              <th className="px-4 py-3 font-semibold text-gray-700">SKU</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.variantsList.map((variant) => {
              const variantName =
                variant.optionValues
                  ?.map((val) => val.productOptionValue?.value)
                  .filter(Boolean)
                  .join(", ") || "No options";

              const transformedVariant = {
                id: variant.id,
                sku: variant.sku,
                price: variant.price,
                stock: variant.stock,
                comparePriceAt: variant.comparePriceAt,
                costPrice: variant.costPrice,
                optionValues: variant.optionValues || [],
                variantImages: variant.images || [],
              };

              return (
                <tr
                  key={variant.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {variantName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {variant.sku || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ${Number(variant.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {Number(variant.stock || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(transformedVariant)}
                        className="text-xs flex gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors"
                      >
                        <Trash2Icon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold text-xl text-gray-800">
                {type === "add" ? "Add New Variant" : "Edit Variant"}
              </h1>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                type === "add"
                  ? handleCreateVariant
                  : (e) => handleUpdateVariant(e, selectedVariantId!)
              }
            >
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="grid gap-5 md:grid-cols-3 grid-cols-2">
                  <CustomInput
                    label="SKU"
                    name="sku"
                    value={currentVariant.sku}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        sku: e.target.value,
                      })
                    }
                    placeholder="SKU-123"
                    required
                  />
                  <CustomInput
                    label="Price"
                    name="price"
                    value={currentVariant.price}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        price: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    type="number"
                    required
                  />
                  <CustomInput
                    label="Stock"
                    name="stock"
                    value={currentVariant.stock}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        stock: e.target.value,
                      })
                    }
                    placeholder="0"
                    type="number"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2 grid-cols-1 mt-4">
                  <CustomInput
                    label="Compare Price At"
                    name="comparePriceAt"
                    value={currentVariant.comparePriceAt}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        comparePriceAt: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    type="number"
                  />
                  <CustomInput
                    label="Cost Price"
                    name="costPrice"
                    value={currentVariant.costPrice}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        costPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    type="number"
                  />
                </div>

                {/* Product Options */}
                {data?.options && data.options.length > 0 && (
                  <div className="mt-5">
                    <h2 className="font-semibold text-gray-800 mb-3">
                      Product Options
                      <span className="text-xs text-gray-400 ml-2">
                        (select values for this variant)
                      </span>
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2 grid-cols-1">
                      {data.options.map((opt, index) => (
                        <div key={opt.id} className="space-y-1.5">
                          <label
                            htmlFor={`option-${opt.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {opt.name}
                          </label>
                          <select
                            id={`option-${opt.id}`}
                            className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer"
                            value={currentVariant.optionValues?.[index] || ""}
                            onChange={(e) => {
                              const values = [...currentVariant.optionValues];
                              values[index] = e.target.value;
                              setCurrentVariant({
                                ...currentVariant,
                                optionValues: values,
                              });
                            }}
                          >
                            <option value="" className="bg-white text-gray-800">
                              Select {opt.name}
                            </option>
                            {opt.values?.map((val) => (
                              <option
                                key={val.id}
                                value={val.value}
                                className="bg-white text-gray-800 py-1"
                              >
                                {val.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5">
                <h2 className="font-semibold text-gray-800 mb-3">
                  Variant Images
                </h2>

                {currentVariant.variantImages &&
                currentVariant.variantImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {currentVariant.variantImages.map((img: any, i: number) => (
                      <div key={i} className="relative group">
                        <img
                          src={img.url || img.thumb}
                          alt={`Variant ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages =
                              currentVariant.variantImages.filter(
                                (_, index) => index !== i,
                              );
                            setCurrentVariant({
                              ...currentVariant,
                              variantImages: newImages,
                            });

                            if (img.url) {
                              removeImage(img.url);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} className="text-white" />
                        </button>
                        {img.isPrimary && (
                          <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                            Primary
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                          #{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-200 rounded-lg mb-4">
                    No variant images uploaded yet
                  </div>
                )}
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    const newImages = res.map((file) => ({
                      url: file.url,
                      isPrimary: currentVariant.variantImages.length === 0, // Set the first uploaded image as primary if no images exist
                      filekey: file.key,
                    }));

                    setCurrentVariant({
                      ...currentVariant,
                      variantImages: [
                        ...currentVariant.variantImages,
                        ...newImages,
                      ],
                    });

                    toast.success(
                      `${res.length} image(s) uploaded successfully`,
                    );
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
              <button
                type="submit"
                disabled={createmutation.isPending || updatemutation.isPending}
                className="mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 flex justify-center items-center gap-2 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createmutation.isPending || updatemutation.isPending ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {type === "edit" ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {type === "edit" ? <Bookmark /> : <LayersPlus />}
                    {type === "edit" ? "Save changes" : "Add variant"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

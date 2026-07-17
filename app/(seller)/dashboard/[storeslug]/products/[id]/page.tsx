"use client";

import { getVariantsList, removeVariant } from "@/app/actions/product-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Edit3, LayersPlus, Plus, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import CustomInput from "../../../_components/CustomeInput";
import { useProduct } from "@/store/product-store";

interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: string | number;
  stock: string | number;
  status: string;
  option1?: string;
  option1Value?: string;
  option2?: string;
  option2Value?: string;
  option3?: string;
  option3Value?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductDetailPage = () => {
  const params = useParams();
  const productId = String(params.id);
  const storeslug = String(params.storeslug);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  ); // ADD THIS
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["getVariants", productId, storeslug],
    queryFn: () => getVariantsList(storeslug, productId),
    enabled: !!productId,
  });

  const handleDeleteVariant = async (variantId: string) => {
    const res = await removeVariant({ storeslug, variantId });
    if (res.success) {
      refetch();
    }
  };

  const currentVariant = useProduct((state) => state.currentVariant);
  const setCurrentVariant = useProduct((state) => state.setCurrentVariant);

  const handleEditClick = (variant: any) => {
    setCurrentVariant({
      sku: variant.sku || "",
      price: String(variant.price || ""),
      stock: String(variant.stock || ""),
      option1: variant.option1 || "",
      option1Value: variant.option1Value || "",
      option2: variant.option2 || "",
      option2Value: variant.option2Value || "",
      option3: variant.option3 || "",
      option3Value: variant.option3Value || "",
    });
    setSelectedVariantId(variant.id); // ADD THIS
    setOpenModal(true);
    setType("edit");
  };
  const handleAddClick = () => {
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
    setSelectedVariantId(null); // ADD THIS
    setOpenModal(true);
    setType("add");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVariantId(null); // ADD THIS
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
  };
  const queryClient = useQueryClient();
  const createmutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/dashboard/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentVariant, storeslug, productId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getVariants", productId, storeslug],
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
      handleCloseModal();
      refetch();
    },
  });
  const updatemutation = useMutation({
    mutationFn: async (varId: string) => {
      const res = await fetch(`/api/dashboard/variants/${varId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentVariant, storeslug, productId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getVariants", productId, storeslug],
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
      handleCloseModal();
      refetch();
    },
  });
  const handleCreateVariant = (e: React.FormEvent) => {
    e.preventDefault();
    createmutation.mutate();
  };
  const handleUpdateVariant = (e: React.FormEvent, variantId: string) => {
    e.preventDefault();
    updatemutation.mutate(variantId);
  };
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-400">Loading variants...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading variants: {error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No variants found for this product.</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          handleAddClick();
          setType("add");
        }}
        className="text-green-400 mb-3 flex items-center gap-2 bg-white rounded-full py-1 px-3 transition-colors"
      >
        <Plus size={15} />
        Add
      </button>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Variant</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((variant) => {
              const variantName =
                [
                  variant.option1 &&
                    variant.option1Value &&
                    `${variant.option1}: ${variant.option1Value}`,
                  variant.option2 &&
                    variant.option2Value &&
                    `${variant.option2}: ${variant.option2Value}`,
                  variant.option3 &&
                    variant.option3Value &&
                    `${variant.option3}: ${variant.option3Value}`,
                ]
                  .filter(Boolean)
                  .join(" | ") || "Default";

              return (
                <tr
                  key={variant.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{variantName}</td>
                  <td className="px-4 py-3">{variant.sku || "N/A"}</td>
                  <td className="px-4 py-3">
                    ${Number(variant.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{Number(variant.stock || 0)}</td>

                  <td className="px-4 py-3 text-center flex items-center gap-5">
                    <button
                      onClick={() => {
                        handleEditClick(variant);
                        setType("edit");
                      }}
                      className=" text-xs flex gap-2 bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded-sm font-medium transition-colors"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant.id)}
                      className="text-red-400 hover:bg-red-500/50 rounded-full p-2 hover:text-red-300 transition-colors"
                    >
                      <Trash2Icon size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOVED MODAL OUTSIDE THE MAP FUNCTION */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-700 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold">
                Variants Price, Stock, SKU & Options
              </h1>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-5">
              <div className="bg-white/5 rounded-lg p-5">
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
                  />
                </div>

                <div className="mt-5">
                  <h2 className="font-semibold mb-3">
                    Options{" "}
                    <span className="text-xs text-gray-400">(optional)</span>
                  </h2>

                  <div className="grid gap-5 md:grid-cols-3 grid-cols-1">
                    <div className="flex flex-col gap-3">
                      <CustomInput
                        label="Option 1 (Size)"
                        name="option1"
                        value={currentVariant.option1}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option1: e.target.value,
                          })
                        }
                        placeholder="Size"
                      />
                      <CustomInput
                        label="Option 1 Value"
                        name="option1Value"
                        value={currentVariant.option1Value}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option1Value: e.target.value,
                          })
                        }
                        placeholder="M, L, XL"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <CustomInput
                        label="Option 2 (Color)"
                        name="option2"
                        value={currentVariant.option2}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option2: e.target.value,
                          })
                        }
                        placeholder="Color"
                      />
                      <CustomInput
                        label="Option 2 Value"
                        name="option2Value"
                        value={currentVariant.option2Value}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option2Value: e.target.value,
                          })
                        }
                        placeholder="Red, Blue, Green"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <CustomInput
                        label="Option 3 (Material)"
                        name="option3"
                        value={currentVariant.option3}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option3: e.target.value,
                          })
                        }
                        placeholder="Material"
                      />
                      <CustomInput
                        label="Option 3 Value"
                        name="option3Value"
                        value={currentVariant.option3Value}
                        onChange={(e) =>
                          setCurrentVariant({
                            ...currentVariant,
                            option3Value: e.target.value,
                          })
                        }
                        placeholder="Cotton, Leather"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FIXED: Using selectedVariantId instead of variant?.id */}
            <button
              onClick={
                type === "add"
                  ? handleCreateVariant
                  : (e) => handleUpdateVariant(e, selectedVariantId!)
              }
              className="mt-5 bg-orange-500 hover:bg-orange-600 py-2 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
            >
              {type === "edit" ? <Bookmark /> : <LayersPlus />}
              {type === "edit" ? "Save changes" : "Add variant"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

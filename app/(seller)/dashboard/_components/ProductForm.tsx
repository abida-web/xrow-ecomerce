"use client";
import {
  Bookmark,
  Edit,
  ImagePlus,
  LayersPlus,
  PackagePlus,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CustomInput from "./CustomeInput";
import { useProduct } from "@/store/product-store";

interface ProductFormProps {
  intialData?: any;
  type: string;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const ProductForm = ({
  intialData,
  type,
  handleSubmit,
  isSubmitting,
}: ProductFormProps) => {
  const {
    productForm,
    setProductForm,
    categories,
    uploading,
    currentVariant,
    handleAddVariant,
    removeVariant,
    handleUploadImage,
    setCurrentVariant,
    removeImage,
    fetchCategories,
  } = useProduct();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with intialData when editing
  useEffect(() => {
    if (intialData && type === "edit") {
      setProductForm({
        name: intialData.name || "",
        description: intialData.description || "",
        categoryId: intialData.categoryId || "",
        status: intialData.status || "draft",
        comparePriceAt: intialData.comparePriceAt || "",
        costPrice: intialData.costPrice || "",
        brand: intialData.brand || "",
        weight: intialData.weight || "",
        weightUnit: intialData.weightUnit || "g",
        images: intialData.images || [],
        variants: intialData.variants || [],
      });
    }
  }, [intialData, type, setProductForm, setCurrentVariant]);

  // Reset form when switching to add mode
  useEffect(() => {
    if (type === "add") {
      setProductForm({
        name: "",
        description: "",
        categoryId: "",
        status: "draft",
        comparePriceAt: "",
        costPrice: "",
        brand: "",
        weight: "",
        weightUnit: "g",
        images: [],
        variants: [],
      });
    }
  }, [type, setProductForm, setCurrentVariant]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const displayVariants = productForm.variants;

  return (
    <div>
      <div className="flex items-center gap-3">
        {type === "add" ? (
          <PackagePlus className="text-orange-500" />
        ) : (
          <Edit className="text-orange-500" />
        )}
        <span className="text-lg">
          {type === "add" ? "Add New Product" : "Edit Product"}
        </span>
      </div>

      <div className="grid lg:grid-cols-1 xl:grid-cols-[700px_1fr] gap-6">
        <div className="flex flex-col gap-5">
          {/* General Information */}
          <div className="mt-3 bg-white/5 rounded-lg p-5 flex flex-col gap-3">
            <h1 className="font-semibold">General Information</h1>

            <CustomInput
              label="Product Name"
              name="name"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              placeholder="Jaket clop"
              required
            />

            <div className="flex flex-col gap-1">
              <label
                htmlFor="description"
                className="text-[14px] text-gray-400"
              >
                Product Description
              </label>
              <textarea
                className="bg-white/20 px-5 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                rows={5}
                placeholder="Product description"
              />
            </div>

            <select
              className="bg-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  categoryId: e.target.value,
                })
              }
            >
              <option className="bg-black" value="">
                Select Category
              </option>
              {categories.map((cat: any) => (
                <option className="bg-black" key={cat?.id} value={cat?.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="bg-white/20 px-5 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              name="status"
              value={productForm.status}
              onChange={(e) =>
                setProductForm({ ...productForm, status: e.target.value })
              }
            >
              <option className="bg-black" value="draft">
                Draft
              </option>
              <option className="bg-black" value="active">
                Active
              </option>
              <option className="bg-black" value="archived">
                Archived
              </option>
            </select>

            <div className="flex sm:flex-row flex-col items-center gap-5">
              <CustomInput
                label="Compare Price At"
                name="comparePriceAt"
                value={productForm.comparePriceAt}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    comparePriceAt: e.target.value,
                  })
                }
                placeholder="0.00"
                required
                type="number"
              />
              <CustomInput
                label="Cost Price"
                name="costPrice"
                value={productForm.costPrice}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    costPrice: e.target.value,
                  })
                }
                placeholder="0.00"
                required
                type="number"
              />
            </div>

            <CustomInput
              label="Brand"
              name="brand"
              value={productForm.brand}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  brand: e.target.value,
                })
              }
              placeholder="Dior, Nike, LYS"
              required
            />

            <div className="flex items-center gap-5">
              <CustomInput
                label="Weight"
                name="weight"
                value={productForm.weight}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    weight: e.target.value,
                  })
                }
                placeholder="Enter weight"
                required
              />
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[14px] text-gray-400">Weight Unit</label>
                <select
                  className="bg-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  value={productForm.weightUnit}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      weightUnit: e.target.value,
                    })
                  }
                >
                  <option className="bg-black" value="g">
                    g (Grams)
                  </option>
                  <option className="bg-black" value="kg">
                    kg (Kilograms)
                  </option>
                  <option className="bg-black" value="lb">
                    lb (Pounds)
                  </option>
                  <option className="bg-black" value="oz">
                    oz (Ounces)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Variant Section */}
          {type === "add" && (
            <div className="bg-white/5 rounded-lg p-5">
              <h1 className="font-semibold mb-4">
                Variants Price, Stock, SKU & Options
              </h1>

              {/* Show variant form for both add and edit */}
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

              <button
                onClick={() => {
                  handleAddVariant();
                }}
                className="mt-5 bg-orange-500 hover:bg-orange-600 py-2 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
              >
                <LayersPlus />
                Add Variant
              </button>
            </div>
          )}

          {/* Display Added Variants */}
          {type === "add" && (
            <div className="bg-white/5 rounded-lg p-4">
              <h2 className="font-semibold mb-3">
                Added Variants ({displayVariants.length})
              </h2>
              {displayVariants.map((variant: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between bg-white/10 p-3 rounded-lg mt-2 cursor-pointer hover:bg-white/20 transition-colors`}
                >
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div>
                      <span className="text-xs text-gray-400">SKU</span>
                      <p className="text-white">{variant.sku || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Price</span>
                      <p className="text-white">${variant.price || "0.00"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Stock</span>
                      <p className="text-white">{variant.stock || "0"}</p>
                    </div>
                    {variant.option1 && variant.option1Value && (
                      <div>
                        <span className="text-xs text-gray-400">
                          {variant.option1}
                        </span>
                        <p className="text-white">{variant.option1Value}</p>
                      </div>
                    )}
                    {variant.option2 && variant.option2Value && (
                      <div>
                        <span className="text-xs text-gray-400">
                          {variant.option2}
                        </span>
                        <p className="text-white">{variant.option2Value}</p>
                      </div>
                    )}
                    {variant.option3 && variant.option3Value && (
                      <div>
                        <span className="text-xs text-gray-400">
                          {variant.option3}
                        </span>
                        <p className="text-white">{variant.option3Value}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the select
                      removeVariant(index);
                    }}
                    className={`ml-3 p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors `}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Summary */}
        <div className="mt-3 bg-white/5 rounded-lg p-5">
          <h1 className="font-semibold mb-4">Upload Image</h1>

          {/* Image Grid */}
          {productForm.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {productForm.images.map((img: any, i: number) => (
                <div
                  key={i}
                  className={`relative group ${i === 0 ? "col-span-3" : ""}`}
                >
                  <img
                    src={img.thumb || img.url}
                    alt={`Product ${i + 1}`}
                    className={`w-full ${i === 0 ? "h-48" : "h-32"} object-cover rounded-lg`}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X size={16} className="text-white" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className={`border-2 border-dashed my-5 rounded-lg p-6 text-center transition-all cursor-pointer
            ${
              uploading
                ? "border-gray-400 bg-gray-500/20"
                : "border-gray-600 hover:border-orange-500 hover:bg-orange-500/5"
            }`}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  Array.from(files).forEach((file) => handleUploadImage(file));
                }
              }}
              className="hidden"
              disabled={uploading}
            />

            <div className="flex flex-col items-center gap-2">
              <ImagePlus
                className={`w-8 h-8 ${uploading ? "text-gray-400 animate-pulse" : "text-gray-400"}`}
              />
              <p className="text-xs text-gray-300">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </span>
                ) : (
                  "Click to upload or drag and drop"
                )}
              </p>
              <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {productForm.images.length === 0 && !uploading && (
            <p className="text-gray-400 text-sm text-center py-4">
              No images uploaded yet
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || uploading}
        className="mt-4 bg-orange-500 hover:bg-orange-600 py-2 flex justify-center items-center gap-2 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || uploading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {uploading ? "Uploading..." : "Saving..."}
          </>
        ) : (
          <>
            {type === "add" ? <LayersPlus /> : <Bookmark />}
            {type === "add" ? "Create product" : "Save changes"}
          </>
        )}
      </button>
    </div>
  );
};

export default ProductForm;

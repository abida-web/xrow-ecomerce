"use client";
import { Bookmark, Edit, LayersPlus, PackagePlus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import CustomInput from "./CustomeInput";
import { useProduct } from "@/store/product-store";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
  addNewOptionToProduct,
  deleteImageFromUploadthing,
} from "@/app/actions/product-actions";
import toast from "react-hot-toast";
import { UploadButton } from "@/lib/utils/uploadthing";

interface ProductFormProps {
  intialData?: any;
  type: string;
  handleSubmit: () => void;
  isSubmitting: boolean;
  refetch?:
    | ((options?: RefetchOptions | undefined) => Promise<QueryObserverResult>)
    | any;
}

const ProductForm = ({
  intialData,
  type,
  handleSubmit,
  refetch,
  isSubmitting,
}: ProductFormProps) => {
  const {
    productForm,
    setProductForm,
    categories,
    currentVariant,
    handleAddVariant,
    removeVariant,
    setCurrentVariant,
    fetchCategories,
    currentProductOption,
    setCurrentProductOption,
    handleAddProductOption,
  } = useProduct();

  const [newOptionValue, setNewOptionValue] = useState({
    name: "",
    value: [""],
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Initialize form with intialData when editing
  useEffect(() => {
    if (intialData && type === "edit") {
      const options =
        intialData.options?.map((opt: any) => ({
          ...opt,
          value: Array.isArray(opt.value)
            ? opt.value
            : Array.isArray(opt.values)
              ? opt.values.map((v: any) =>
                  typeof v === "string" ? v : v.value,
                )
              : [],
        })) || [];
      setProductForm({
        name: intialData.name || "",
        description: intialData.description || "",
        categoryId: intialData.categoryId || "",
        storeCategoryId: intialData.storeCategoryId || "",
        status: intialData.status || "draft",
        featured: intialData.featured || false,
        brand: intialData.brand || "",
        images: intialData.images || [],
        options: options || [],
        variants:
          intialData.variants?.map((variant: any) => ({
            id: variant.id,
            sku: variant.sku || "",
            price: variant.price || "",
            stock: variant.stock || "",
            comparePriceAt: variant.comparePriceAt || "",
            costPrice: variant.costPrice || "",
          })) || [],
      });
    }
  }, [intialData, type, setProductForm]);

  // Reset form when switching to add mode
  useEffect(() => {
    if (type === "add") {
      setProductForm({
        name: "",
        description: "",
        categoryId: "",
        storeCategoryId: "",
        status: "draft",
        featured: false,
        brand: "",
        options: [],
        images: [],
        variants: [],
      });
    }
  }, [type, setProductForm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddNewOptionValue = async () => {
    const res = await addNewOptionToProduct(intialData.id, newOptionValue);
    if (res.success) {
      toast.success("Option added");
      setNewOptionValue({ name: "", value: [""] });
      refetch();
    }
  };
  const removeImage = async (url: string) => {
    const res = await deleteImageFromUploadthing(url);
    if (res?.success) {
      toast.success("Image deleted successfully");
    } else {
      toast.error("Failed to delete image");
    }
  };
  const displayVariants = productForm.variants;
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {type === "add" ? (
          <PackagePlus className="text-orange-500" />
        ) : (
          <Edit className="text-orange-500" />
        )}
        <span className="text-lg font-semibold text-gray-800">
          {type === "add" ? "Add New Product" : "Edit Product"}
        </span>
      </div>

      <div className="grid lg:grid-cols-1 xl:grid-cols-[700px_1fr] gap-6">
        <div className="flex flex-col gap-5">
          {/* General Information */}
          <div className="mt-3 bg-white rounded-lg border border-gray-200 p-5 shadow-sm flex flex-col gap-3">
            <h1 className="font-semibold text-gray-800">General Information</h1>

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
                className="text-[14px] text-gray-600"
              >
                Product Description
              </label>
              <textarea
                className="bg-gray-50 px-5 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
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
              className="bg-gray-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
              value={productForm.categoryId}
              onChange={(e) => {
                const categoryId = e.target.value;
                setSelectedCategoryId(categoryId);
                setProductForm({
                  ...productForm,
                  categoryId: categoryId,
                  storeCategoryId: "",
                });
              }}
            >
              <option className="bg-white" value="">
                Select Category
              </option>
              {categories.map((cat: any) => (
                <option className="bg-white" key={cat?.id} value={cat?.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="bg-gray-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
              value={productForm.storeCategoryId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  storeCategoryId: e.target.value,
                })
              }
              disabled={!selectedCategoryId}
            >
              <option className="bg-white" value="">
                Select store's category
              </option>
              {selectedCategory?.storeCategories.map((cat: any) => (
                <option className="bg-white" key={cat?.id} value={cat?.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="bg-gray-50 px-5 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
              name="status"
              value={productForm.status}
              onChange={(e) =>
                setProductForm({ ...productForm, status: e.target.value })
              }
            >
              <option className="bg-white" value="draft">
                Draft
              </option>
              <option className="bg-white" value="active">
                Active
              </option>
              <option className="bg-white" value="archived">
                Archived
              </option>
            </select>

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

            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="isDefault"
                checked={productForm.featured}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setProductForm({ ...productForm, featured: checked });
                }}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
              <label
                htmlFor="isDefault"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Add to featured products
              </label>
            </div>
          </div>

          <h1 className="font-semibold text-gray-800 mb-4">Options</h1>

          {/* Variant Options Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm mb-5">
            <div className="grid grid-cols-1 gap-3">
              <CustomInput
                label="Option Name"
                name="optionName"
                value={
                  type === "add"
                    ? currentProductOption.name
                    : newOptionValue.name
                }
                onChange={(e) =>
                  type === "add"
                    ? setCurrentProductOption({
                        ...currentProductOption,
                        name: e.target.value,
                      })
                    : setNewOptionValue({
                        ...newOptionValue,
                        name: e.target.value,
                      })
                }
                placeholder="e.g., Color, Size, Material"
              />
              {(type === "add"
                ? currentProductOption.value
                : newOptionValue.value
              ).map((val, i) => (
                <div key={i}>
                  <CustomInput
                    label={`Option ${i + 1} value`}
                    name="optionValue"
                    value={val}
                    onChange={(e) => {
                      if (type === "add") {
                        const newValues = [...currentProductOption.value];
                        newValues[i] = e.target.value;
                        setCurrentProductOption({
                          ...currentProductOption,
                          value: newValues,
                        });
                      } else {
                        const newValues = [...newOptionValue.value];
                        newValues[i] = e.target.value;
                        setNewOptionValue({
                          ...newOptionValue,
                          value: newValues,
                        });
                      }
                    }}
                    placeholder={`Value ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                type === "add"
                  ? setCurrentProductOption({
                      ...currentProductOption,
                      value: [...currentProductOption.value, ""],
                    })
                  : setNewOptionValue({
                      ...newOptionValue,
                      value: [...newOptionValue.value, ""],
                    });
              }}
              className="mt-2 text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Add Value
            </button>
            <button
              onClick={
                type === "add"
                  ? handleAddProductOption
                  : handleAddNewOptionValue
              }
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
            >
              <LayersPlus />
              Add Option
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">
              Added options ({productForm.options.length})
            </h2>
            {productForm.options.map((opt: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2 border border-gray-100"
              >
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <span className="text-xs text-gray-500">Option Name</span>
                    <p className="text-gray-800 font-medium">{opt.name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Values</span>
                    <p className="text-gray-800">
                      {opt?.value?.map((val: any, i: number) => (
                        <p key={i}>{val}</p>
                      ))}
                    </p>
                  </div>
                </div>
                {type === "add" && (
                  <button className="ml-3 p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600">
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Variant Section */}
          {type === "add" && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="mt-5">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
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
                  <div className="flex sm:flex-row flex-col items-center gap-5">
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
                      required
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
                      required
                      type="number"
                    />
                  </div>
                  {(intialData?.options || productForm.options).map(
                    (opt: any, index: number) => {
                      const optionValues = Array.isArray(opt.value)
                        ? opt.value
                        : Array.isArray(opt.values)
                          ? opt.values.map((v: any) =>
                              typeof v === "string" ? v : v.value,
                            )
                          : [];

                      return (
                        <div key={opt.id || index} className="space-y-1.5">
                          <label
                            htmlFor={`option-${opt.id || index}`}
                            className="block text-sm font-medium mt-3 text-gray-700"
                          >
                            {opt.name}
                          </label>
                          <select
                            id={`option-${opt.id || index}`}
                            className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:bg-gray-100 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            value={currentVariant.optionValues?.[index] || ""}
                            onChange={(e) => {
                              const values = [
                                ...(currentVariant.optionValues || []),
                              ];
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
                            {optionValues.map((val: any, idx: number) => {
                              const displayValue =
                                typeof val === "string"
                                  ? val
                                  : val.value || val;
                              return (
                                <option
                                  key={`${opt.id || index}-${idx}`}
                                  value={displayValue}
                                  className="bg-white text-gray-800 py-1"
                                >
                                  {displayValue}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
              {currentVariant.variantImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 my-5 ">
                  {currentVariant.variantImages.map((img: any, i: number) => (
                    <div key={i}>
                      <img
                        src={img.thumb || img.url}
                        alt={`Product ${i + 1}`}
                        className={`w-full h-48 object-cover rounded-lg border border-gray-200`}
                      />
                      <button
                        onClick={() => {
                          const newImages = currentVariant.variantImages.filter(
                            (_, index) => index !== i,
                          );
                          setCurrentVariant({
                            ...currentVariant,
                            variantImages: newImages,
                          });
                          removeImage(img.url);
                        }}
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
              ) : (
                <div className="text-gray-500">
                  Click to upload images for variants
                </div>
              )}
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
                onClick={() => {
                  handleAddVariant();
                }}
                className="mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 flex justify-center items-center gap-2 rounded-lg w-full transition-colors"
              >
                <LayersPlus />
                Add Variant
              </button>
            </div>
          )}

          {/* Display Added Variants */}
          {type === "add" && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">
                Added Variants ({displayVariants.length})
              </h2>
              {displayVariants.map((variant: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mt-2 border border-gray-100"
                >
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div>
                      <span className="text-xs text-gray-500">SKU</span>
                      <p className="text-gray-800 font-medium">
                        {variant.sku || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Price</span>
                      <p className="text-gray-800 font-medium">
                        ${variant.price || "0.00"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Stock</span>
                      <p className="text-gray-800 font-medium">
                        {variant.stock || "0"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVariant(index);
                    }}
                    className="ml-3 p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Upload Button */}
        {/* Right Sidebar - Upload Button */}
        <div className="mt-3 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h1 className="font-semibold text-gray-800 mb-4">Upload Images</h1>

          {/* Image Preview Grid */}
          {productForm.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {productForm.images.map((img: any, i: number) => (
                <div
                  key={i}
                  className={`relative group ${i === 0 ? "col-span-3" : ""}`}
                >
                  <img
                    src={img.thumb || img.url}
                    alt={`Product ${i + 1}`}
                    className={`w-full ${i === 0 ? "h-48" : "h-32"} object-cover rounded-lg border border-gray-200`}
                  />
                  <button
                    onClick={() => {
                      const newImages = productForm.images.filter(
                        (_, index) => index !== i,
                      );
                      setProductForm({
                        ...productForm,
                        images: newImages,
                      });
                      removeImage(img.url);
                    }}
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

          {/* Upload Button */}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const newImages = res.map((file) => ({
                  url: file.url,
                  thumb: file.url,
                  display_url: file.url,
                  name: file.name,
                  filekey: file.key,
                }));

                setProductForm({
                  ...productForm,
                  images: [...productForm.images, ...newImages],
                });

                toast.success(`${res.length} image(s) uploaded successfully`);
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

          {/* Image count */}
          {productForm.images.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              {productForm.images.length} image(s) uploaded
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 flex justify-center items-center gap-2 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Saving...
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

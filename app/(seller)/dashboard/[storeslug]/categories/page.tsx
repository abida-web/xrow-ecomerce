"use client";
import React, { useState } from "react";
import CustomInput from "../../_components/CustomeInput";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewStoreCategory,
  getCategories,
  removeStoreCategory,
  updateStoreCategory,
} from "@/app/actions/product-actions";
import { ChevronDown, Package, FolderTree } from "lucide-react";
import * as Icons from "lucide-react";

const CategoriesPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  const [category, setCategory] = useState({
    globalCategoryId: "",
    name: "",
    icon: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const queryClient = useQueryClient();

  // Helper function to render icons
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent: any = Icons[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  const addStoreCategory = useMutation({
    mutationFn: async () => {
      const res = await addNewStoreCategory(storeslug, category);
      if (res.success) {
        setCategory({
          globalCategoryId: "",
          name: "",
          icon: "",
        });
        setIsEditing(false);
        setEditingId("");
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateStoreCategoryMut = useMutation({
    mutationFn: async () => {
      const res = await updateStoreCategory(storeslug, editingId, category);
      if (res.success) {
        setCategory({
          globalCategoryId: "",
          name: "",
          icon: "",
        });
        setIsEditing(false);
        setEditingId("");
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const removeStoreCategoryMut = useMutation({
    mutationFn: async (catId: string) => {
      const res = await removeStoreCategory(storeslug, catId);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const handleAddCategory = () => {
    addStoreCategory.mutate();
  };

  // ✅ FIXED: Added .mutate()
  const handleUpdateCategory = () => {
    updateStoreCategoryMut.mutate();
  };

  const handleRemoveCategory = (catId: string) => {
    removeStoreCategoryMut.mutate(catId);
  };

  const handleSelectCatForEdit = (cat: any) => {
    setCategory({
      globalCategoryId: cat.globalCategoryId || "",
      name: cat.name || "",
      icon: cat.icon || "",
    });
    setIsEditing(true);
    setEditingId(cat.id);
  };

  const handleCancelEdit = () => {
    setCategory({
      globalCategoryId: "",
      name: "",
      icon: "",
    });
    setIsEditing(false);
    setEditingId("");
  };

  return (
    <div className="grid grid-cols-[650px_1fr] gap-5">
      {/* Categories List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-5">
          <FolderTree className="w-5 h-5 text-orange-500" />
          <h2 className="font-semibold text-gray-800">Categories List</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load categories</p>
          </div>
        ) : categories?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories?.map((cat, index: number) => (
              <div
                key={cat.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {cat.icon && (
                    <span className="text-orange-500">
                      {renderIcon(cat.icon)}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {cat.name}
                  </span>
                  <h1 className="bg-orange-500 text-black h-5 w-[1px]"></h1>
                  <div className="flex items-center gap-4">
                    {cat.storeCategories &&
                      cat.storeCategories.map((subCat) => (
                        <div
                          key={subCat.id}
                          className="flex items-center gap-3 bg-orange-100 px-4 py-2 rounded-md"
                        >
                          <button
                            onClick={() => handleRemoveCategory(subCat.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Icons.X className="h-3 w-3" />
                          </button>
                          {subCat.icon && (
                            <span className="text-orange-500">
                              {renderIcon(subCat.icon)}
                            </span>
                          )}
                          <span className="text-sm font-medium text-gray-700">
                            {subCat.name}
                          </span>
                          <button
                            onClick={() => handleSelectCatForEdit(subCat)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Icons.Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Category Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
        <h1 className="font-semibold text-gray-800 mb-5">
          {isEditing ? "Edit Category" : "Add New Category"}
        </h1>

        <div className="space-y-4">
          {/* Parent Category Select */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Parent Category
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 appearance-none pr-10 hover:bg-gray-100 transition-colors cursor-pointer"
              value={category.globalCategoryId}
              onChange={(e) =>
                setCategory({ ...category, globalCategoryId: e.target.value })
              }
            >
              <option value="">No Parent (Top Level)</option>
              {categories?.map((cat: any, index: number) => (
                <option key={cat.id || index} value={cat.id || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[38px] w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Category Name Input */}
          <CustomInput
            name="Category"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            placeholder="Enter category name"
            label="Category Name"
          />

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Icon
            </label>
            <div className="relative group">
              <input
                type="text"
                value={category.icon}
                onChange={(e) =>
                  setCategory({ ...category, icon: e.target.value })
                }
                placeholder="Enter icon name (e.g., ShoppingBag, Coffee, Home)"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {category.icon &&
                renderIcon(
                  category.icon,
                  "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use Lucide icon names like: ShoppingBag, Coffee, Home, Heart, etc.
            </p>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={isEditing ? handleUpdateCategory : handleAddCategory}
              disabled={
                !category.name.trim() ||
                addStoreCategory.isPending ||
                updateStoreCategoryMut.isPending
              }
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isEditing
                ? updateStoreCategoryMut.isPending
                  ? "Updating..."
                  : "Update Category"
                : addStoreCategory.isPending
                  ? "Adding category..."
                  : "Add Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

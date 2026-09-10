"use client";
import {
  createPageForStore,
  creatSectionForPage,
  getStoreRelatedPages,
  removeSection,
  updateSectionForPage,
} from "@/app/actions/individualStore";
import { SECTION_TEMPLATES_DATA } from "@/lib/constants/sections";
import { pageTypes } from "@/lib/constants/storefront";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GalleryThumbnailsIcon,
  PlusCircle,
  X,
  ChevronDown,
  LayoutTemplate,
  CirclePlus,
  CircleCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SectionsEditeBars from "./SectionsEditeBars";
import { connect } from "node:net";
import { authClient } from "@/lib/auth-client";

interface EditebarProps {
  setOpenSettings: (value: boolean) => void;
  storeslug: string;
  pagesDataList: Array<{
    id: string;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    slug: string | null;
    organizationId: string | null;
    type: string | null;
    sections: Array<{
      enabled: boolean | null;
      id: string;
      createdAt: Date | null;
      updatedAt: Date | null;
      type: string | null;
      pageId: string | null;
      position: number | null;
      defaultSettings: unknown;
      defaultContent: unknown;
    }>;
  }>;
  setSelectedPage: Dispatch<SetStateAction<{}>>;
  selectedPage: any;
  setSelectedSectionId: Dispatch<SetStateAction<string | null>>;
  selectedSectionId: string | null;
  setSections: any;
  sections: any;
  refetch: any;
}

const Editebar = ({
  setOpenSettings,
  storeslug,
  pagesDataList,
  setSelectedPage,
  selectedPage,
  setSelectedSectionId,
  selectedSectionId,
  setSections,
  sections,
  refetch,
}: EditebarProps) => {
  const [openPagesDropdown, setOpenPagesDropdown] = useState(false);
  const [pageData, setPageData] = useState({
    name: "",
    type: "",
  });
  // Find the selected section object from sections state
  const selectedSection = sections?.find(
    (sec: any) => sec?.id === selectedSectionId,
  );
  const queryClient = useQueryClient();

  const addPageMutation = useMutation({
    mutationFn: async () => {
      const res = await createPageForStore(storeslug, pageData);
      return res;
    },
    onSuccess: () => {
      setPageData({
        name: "",
        type: "",
      });
      queryClient.invalidateQueries({ queryKey: ["pages", storeslug] });
    },
    onError: (error) => {
      console.error("Failed to create page:", error);
    },
  });

  const addSectionMutation = useMutation({
    mutationFn: async ({
      template,
      pageId,
    }: {
      template: any;
      pageId: string;
    }) => {
      const res = await creatSectionForPage(storeslug, template, pageId);
      if (res.error) {
        toast.error(res.error);
      } else {
        refetch();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", storeslug] });
      refetch();
    },
    onError: (error) => {
      console.error("Failed to create section:", error);
    },
  });
  const removeSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const res = await removeSection(storeslug, sectionId);
      return res;
    },
    onSuccess: () => {
      setSelectedSectionId(null);
      queryClient.invalidateQueries({ queryKey: ["pages", storeslug] });
      refetch();
      toast.success("Section removed");
    },
    onError: (error) => {
      console.error("Failed to remove section:", error);
      toast.error("Failed to remove section");
    },
  });
  const updateSectionMutation = useMutation({
    mutationFn: async () => {
      const res = await updateSectionForPage(
        storeslug,
        selectedSection,
        selectedPage?.id,
        selectedSectionId,
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Section changes saved");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", storeslug] });
    },
    onError: (error) => {
      console.error("Failed to create section:", error);
    },
  });
  const handleCreatePage = () => {
    if (!pageData.name.trim() || !pageData.type) {
      return;
    }
    addPageMutation.mutate();
  };

  const handleAddSection = (template: any, pageId: string) => {
    addSectionMutation.mutate({ template, pageId });
  };

  const handleUpdateSection = (template: any, pageId: string) => {
    updateSectionMutation.mutate();
  };

  const updateSectionSettings = (sectionId: string, settings: any) => {
    setSections((prevSections: any[]) => {
      return prevSections.map((sec) => {
        if (sec?.id === sectionId) {
          return {
            ...sec,
            defaultSettings: {
              ...sec.defaultSettings,
              ...settings,
            },
          };
        }
        return sec;
      });
    });
  };

  const updateContent = (sectionId: string, contents: any) => {
    setSections((prevSections: any[]) => {
      return prevSections.map((sec) => {
        if (sec?.id === sectionId) {
          return {
            ...sec,
            defaultContent: {
              ...sec.defaultContent,
              ...contents,
            },
          };
        }
        return sec;
      });
    });
  };
  //update the section after adding
  useEffect(() => {
    if (selectedPage?.id && pagesDataList) {
      const updatedPage = pagesDataList.find((p) => p.id === selectedPage.id);
      if (updatedPage) {
        setSelectedPage(updatedPage);
      }
    }
  }, [pagesDataList, selectedPage?.id]);
  useEffect(() => {
    if (selectedPage?.sections) {
      setSections(selectedPage?.sections);
    }
  }, [selectedPage, setSections]);
  const [linksText, setLinksText] = useState(
    JSON.stringify(selectedSection?.defaultContent?.links, null, 2),
  );
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const templates = SECTION_TEMPLATES_DATA(activeOrganization);
  return (
    <div className="fixed left-0 top-0 bottom-0 w-70 bg-white border-r border-gray-200 shadow-sm z-50 overflow-y-auto">
      <div className="h-full p-6 flex flex-col">
        <button
          onClick={() => setOpenSettings(false)}
          className="absolute right-3 top-3 transition-all hover:bg-orange-500/10 rounded-full p-1 hover:text-orange-500"
        >
          <X size={20} />
        </button>
        <h1 className="text-xl mt-3 font-semibold border-b pb-2 border-gray-300 text-orange-500 mb-6 flex items-center gap-2">
          Set up your store
        </h1>
        <div className="flex flex-col flex-1">
          {/* Pages Dropdown Toggle */}
          <div
            onClick={() => setOpenPagesDropdown(!openPagesDropdown)}
            className="flex items-center justify-between text-sm border rounded-lg border-gray-300 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <GalleryThumbnailsIcon className="h-4 w-4" />
              <span>Pages</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {pagesDataList?.length || 0}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                openPagesDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {/* Pages List */}
          {openPagesDropdown && (
            <div className="mt-2 border-t border-gray-100 pt-3">
              {pagesDataList && pagesDataList.length > 0 && (
                <div className="py-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                  {pagesDataList.map((page) => (
                    <div key={page?.id} className="flex flex-col">
                      <div
                        onClick={() => setSelectedPage(page)}
                        className={`text-xs transition-colors py-1.5 px-3 rounded-md flex items-center justify-between cursor-pointer ${
                          selectedPage?.id === page?.id
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <span className="font-medium">{page.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            selectedPage === page.id
                              ? "bg-white/20 text-white"
                              : "bg-white text-gray-500"
                          }`}
                        >
                          {page.type || "No type"}
                        </span>
                      </div>

                      {/* Sections for selected page */}
                      {selectedPage?.id === page?.id && (
                        <div className="ml-3 mt-1 pl-3 border-l-2 border-orange-200">
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-1">
                            <LayoutTemplate className="h-3 w-3" />
                            <span>Sections</span>
                          </div>
                          <h1 className=" text-sm py-2 font-semibold text-orange-500">
                            Added
                          </h1>
                          <div className="flex flex-col gap-0.5">
                            {page.sections.map((sec: any) => (
                              <div
                                key={sec.id}
                                onClick={() => setSelectedSectionId(sec.id)}
                                className={`relative group text-xs py-1.5 px-2 text-gray-700 rounded hover:bg-orange-50 cursor-pointer transition-colors flex items-center justify-between ${
                                  selectedSectionId === sec.id &&
                                  "bg-blue-600 text-white hover:bg-blue-600"
                                }`}
                              >
                                <span className="truncate pr-1">
                                  {sec.name}
                                </span>

                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button className="text-green-500 hover:text-green-600 transition-colors px-1 py-0.5 rounded">
                                    <CircleCheck className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Small cross for removing the section */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        confirm(
                                          `Remove section "${sec.name}"? This cannot be undone.`,
                                        )
                                      ) {
                                        removeSectionMutation.mutate(sec.id);
                                      }
                                    }}
                                    disabled={removeSectionMutation.isPending}
                                    title="Remove section"
                                    className={`w-5 h-5 flex items-center justify-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                      selectedSectionId === sec.id
                                        ? "text-white/80 hover:text-white hover:bg-red-500"
                                        : "text-gray-400 hover:text-white hover:bg-red-500"
                                    }`}
                                  >
                                    <X size={12} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <h1 className=" text-sm py-2 font-semibold text-orange-500">
                            Click to add
                          </h1>
                          <div className="flex flex-col gap-0.5">
                            {templates.map((template) => (
                              <div
                                key={template.name}
                                className="text-xs py-0.5 px-2 rounded hover:bg-orange-50 cursor-pointer transition-colors flex items-center justify-between"
                              >
                                <span className="text-gray-700">
                                  {template.name}
                                </span>
                                <button
                                  onClick={() =>
                                    handleAddSection(template, page.id)
                                  }
                                  disabled={addSectionMutation.isPending}
                                  className="text-orange-500 hover:text-orange-600 transition-colors px-1.5 py-0.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <CirclePlus className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          {addSectionMutation.isError && (
                            <p className="text-[10px] text-red-500 mt-1">
                              Failed to add section
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Page Form */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex items-center gap-2 w-full">
                  <select
                    value={pageData.type}
                    onChange={(e) =>
                      setPageData({ ...pageData, type: e.target.value })
                    }
                    className="w-24 min-w-[80px] px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
                  >
                    <option value="">Type</option>
                    {pageTypes.map((type) => (
                      <option key={type.type} value={type.type}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={pageData.name}
                    onChange={(e) =>
                      setPageData({ ...pageData, name: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Page name..."
                  />
                </div>

                <button
                  onClick={handleCreatePage}
                  disabled={
                    addPageMutation.isPending ||
                    !pageData.name.trim() ||
                    !pageData.type
                  }
                  className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 disabled:cursor-not-allowed text-white text-xs px-5 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <PlusCircle className="h-4 w-4" />
                  {addPageMutation.isPending ? "Adding..." : "Add Page"}
                </button>

                {addPageMutation.isError && (
                  <p className="text-xs text-red-500 mt-1">
                    Failed to create page. Please try again.
                  </p>
                )}
              </div>
            </div>
          )}

          <SectionsEditeBars
            selectedSection={selectedSection}
            updateSectionSettings={updateSectionSettings}
            updateContent={updateContent}
            setLinksText={setLinksText}
            linksText={linksText}
            handleUpdateSection={handleUpdateSection}
          />
        </div>
      </div>
    </div>
  );
};

export default Editebar;

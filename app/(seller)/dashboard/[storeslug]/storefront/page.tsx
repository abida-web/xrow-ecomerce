"use client";

import { Edit2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editebar from "../../_components/Editebar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStoreRelatedPages,
  removeSection,
} from "@/app/actions/individualStore";
import StoreRerenderer from "@/app/(store)/[storeslug]/_components/StoreRerenderer";
import toast from "react-hot-toast";

interface PageType {
  id?: string;
  name?: string;
  sections?: any[];
  [key: string]: any;
}

const StorefrontPage = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageType | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [sections, setSections] = useState<any>([]);

  const params = useParams();
  const storeslug = String(params.storeslug);
  const queryClient = useQueryClient();

  const {
    data: pagesDataList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pages", storeslug],
    queryFn: () => getStoreRelatedPages(storeslug),
  });

  // Central remove mutation — used by StoreRerenderer's cross
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

  const handleRemoveSection = (sectionId: string) => {
    removeSectionMutation.mutate(sectionId);
  };

  useEffect(() => {
    const isLargeScreen = window.innerWidth >= 1024;
    setOpenSettings(isLargeScreen);
  }, []);

  useEffect(() => {
    setSections(selectedPage?.sections || []);
  }, [selectedPage]);

  const toggleSettings = () => {
    setOpenSettings(!openSettings);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col sm:flex-row">
      {openSettings && (
        <Editebar
          refetch={refetch}
          storeslug={storeslug}
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
          setOpenSettings={setOpenSettings}
          pagesDataList={pagesDataList || []}
          setSelectedSectionId={setSelectedSectionId}
          selectedSectionId={selectedSectionId}
          setSections={setSections}
          sections={sections}
        />
      )}

      {/* Main content */}
      <div className="min-h-screen flex-1 w-full">
        <main>
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            {isLoading ? (
              <div className="text-gray-500 p-4">Loading store content...</div>
            ) : (
              <div className="w-full overflow-hidden">
                {selectedPage && (
                  <StoreRerenderer
                    type="edite"
                    setSelectedSectionId={setSelectedSectionId}
                    selectedSectionId={selectedSectionId}
                    selectedPage={selectedPage}
                    sections={sections}
                    onRemoveSection={handleRemoveSection}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <button
        onClick={toggleSettings}
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 z-50"
        type="button"
        aria-label="Toggle settings"
      >
        <Edit2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default StorefrontPage;

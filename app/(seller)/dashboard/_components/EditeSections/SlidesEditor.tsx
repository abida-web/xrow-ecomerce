import { UploadButton } from "@/lib/utils/uploadthing";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const SlidesEditor = ({
  selectedSection,
  content,
  updateContent,
  removeImage,
}: any) => {
  const slides = content?.slides || [];

  const addSlide = () => {
    updateContent(selectedSection.id, {
      slides: [...slides, { image: null, title: "", subtitle: "" }],
    });
  };

  const updateSlide = (index: number, patch: Record<string, any>) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], ...patch };
    updateContent(selectedSection.id, { slides: updated });
  };

  return (
    <div>
      <h1 className="text-gray-400 text-sm pb-2">Slides</h1>
      {slides.length > 0 ? (
        <div className="flex flex-col gap-4 mt-2">
          {slides.map((slid: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3 w-full">
                <div className="relative border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {slid.image ? (
                    <>
                      <img
                        src={slid.image}
                        alt={`Slide ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateSlide(index, { image: null });
                          removeImage(slid.image);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X size={10} />
                      </button>
                    </>
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">Title</p>
                    <input
                      type="text"
                      className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-full"
                      value={slid.title || ""}
                      onChange={(e) =>
                        updateSlide(index, { title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">Subtitle</p>
                    <input
                      type="text"
                      className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-full"
                      value={slid.subtitle || ""}
                      onChange={(e) =>
                        updateSlide(index, { subtitle: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              {!slid.image && (
                <div className="mt-2">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.length) {
                        const imgUrl = res[0].ufsUrl || res[0].url;
                        updateSlide(index, { image: imgUrl });
                        toast.success("Image uploaded successfully");
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
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">
          No slides added yet
        </div>
      )}
      <button
        onClick={addSlide}
        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors w-full mt-2"
      >
        + Add Slide
      </button>
    </div>
  );
};

export default SlidesEditor;

import { UploadButton } from "@/lib/utils/uploadthing";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const HeroBottomAlignedEdite = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
  removeImage,
}: any) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Hero: Bottom Aligned section:
      </h1>

      {/* SETTINGS */}
      <ColorField
        label="Text color"
        value={settings.textColor || "#ffffff"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { textColor: v })
        }
      />
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#000000"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { backgroundColor: v })
        }
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#ffffff"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { titleColor: v })
        }
      />
      <ColorField
        label="Subtitle color"
        value={settings.subtitleColor || "#94a3b8"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { subtitleColor: v })
        }
      />
      <ColorField
        label="Button color"
        value={settings.buttonColor || "#f97316"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonColor: v })
        }
      />
      <ColorField
        label="Button hover color"
        value={settings.buttonHoverColor || "#ea580c"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonHoverColor: v })
        }
      />
      <ColorField
        label="Button text color"
        value={settings.buttonTextColor || "#ffffff"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonTextColor: v })
        }
      />
      <ColorField
        label="Badge color"
        value={settings.badgeColor || "#f97316"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgeColor: v })
        }
      />
      <ColorField
        label="Badge text color"
        value={settings.badgeTextColor || "#ffffff"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgeTextColor: v })
        }
      />

      <TextField
        label="Button padding"
        value={settings.buttonPadding || "12px 32px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonPadding: v })
        }
      />
      <NumberField
        label="Button radius"
        value={settings.buttonRadius}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonRadius: v })
        }
      />
      <NumberField
        label="Button font weight"
        value={settings.buttonFontWeight}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonFontWeight: v })
        }
      />
      <TextField
        label="Badge padding"
        value={settings.badgePadding || "4px 16px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgePadding: v })
        }
      />
      <NumberField
        label="Badge radius"
        value={settings.badgeRadius}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgeRadius: v })
        }
      />
      <NumberField
        label="Badge font size"
        value={settings.badgeFontSize}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgeFontSize: v })
        }
      />
      <NumberField
        label="Badge font weight"
        value={settings.badgeFontWeight}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { badgeFontWeight: v })
        }
      />
      <NumberField
        label="Title size"
        value={settings.titleSize}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { titleSize: v })
        }
      />
      <NumberField
        label="Title weight"
        value={settings.titleWeight}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { titleWeight: v })
        }
      />
      <NumberField
        label="Subtitle size"
        value={settings.subtitleSize}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { subtitleSize: v })
        }
      />
      <TextField
        label="Min height"
        value={settings.minHeight || "600px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { minHeight: v })
        }
      />
      <NumberField
        label="Padding Y"
        value={settings.paddingY}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { paddingY: v })
        }
      />
      <NumberField
        label="Padding X"
        value={settings.paddingX}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { paddingX: v })
        }
      />
      <TextField
        label="Max width"
        value={settings.maxWidth || "1280px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { maxWidth: v })
        }
      />
      <NumberField
        label="Spacing"
        value={settings.spacing}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { spacing: v })
        }
      />
      <TextField
        label="Image width"
        value={settings.imageWidth || "50%"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { imageWidth: v })
        }
      />
      <TextField
        label="Content width"
        value={settings.contentWidth || "50%"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { contentWidth: v })
        }
      />
      <AlignmentField
        label="Text alignment"
        value={settings.alignment || "center"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { alignment: v })
        }
      />
      <AlignmentField
        label="Image position"
        value={settings.imagePosition || "center"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { imagePosition: v })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <div className="mt-4 space-y-3">
        <h1 className="text-sm font-semibold text-gray-700">Image:</h1>
        {content?.image && (
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={content.image}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  updateContent(selectedSection.id, { image: "" });
                  removeImage(content.image);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Remove logo"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        {!content.image && (
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.length) {
                const imgUrl = res[0].ufsUrl || res[0].url;
                updateContent(selectedSection.id, { image: imgUrl });
                toast.success("Logo uploaded successfully");
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
        )}
      </div>

      <TextField
        label="Title"
        value={content.title || ""}
        onChange={(v: any) => updateContent(selectedSection.id, { title: v })}
      />
      <TextField
        label="Subtitle"
        value={content.subtitle || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { subtitle: v })
        }
      />
      <TextField
        label="Badge text"
        value={content.badgeText || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { badgeText: v })
        }
      />
      <TextField
        label="Button text"
        value={content.buttonText || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { buttonText: v })
        }
      />
      <TextField
        label="Button url"
        value={content.buttonUrl || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { buttonUrl: v })
        }
      />
      <TextField
        label="Image url"
        value={content.imageUrl || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { imageUrl: v })
        }
      />

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize"
      >
        Save changes
      </button>
    </div>
  );
};

export default HeroBottomAlignedEdite;

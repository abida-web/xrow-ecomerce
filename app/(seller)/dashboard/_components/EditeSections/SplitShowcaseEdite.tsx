import { UploadButton } from "@/lib/utils/uploadthing";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const SplitShowcaseEdite = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
  removeImage,
}: any) => {
  const up = (p: Record<string, any>) =>
    updateSectionSettings(selectedSection.id, p);
  const upC = (p: Record<string, any>) => updateContent(selectedSection.id, p);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Split Showcase:
      </h1>

      <TextField
        label="Min height"
        value={settings.minHeight || "500px"}
        onChange={(v: any) => up({ minHeight: v })}
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#ffffff"}
        onChange={(v: any) => up({ textColor: v })}
      />
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#000000"}
        onChange={(v: any) => up({ backgroundColor: v })}
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#ffffff"}
        onChange={(v: any) => up({ titleColor: v })}
      />
      <ColorField
        label="Subtitle color"
        value={settings.subtitleColor || "#94a3b8"}
        onChange={(v: any) => up({ subtitleColor: v })}
      />
      <TextField
        label="Shadow"
        value={settings.shadow || "0 10px 15px -3px rgb(0 0 0 / 0.1)"}
        onChange={(v: any) => up({ shadow: v })}
      />
      <TextField
        label="Divider"
        value={settings.divider || "1px solid #e5e7eb"}
        onChange={(v: any) => up({ divider: v })}
      />
      <ColorField
        label="Button color"
        value={settings.buttonColor || "#f97316"}
        onChange={(v: any) => up({ buttonColor: v })}
      />
      <ColorField
        label="Button hover color"
        value={settings.buttonHoverColor || "#ea580c"}
        onChange={(v: any) => up({ buttonHoverColor: v })}
      />
      <ColorField
        label="Button text color"
        value={settings.buttonTextColor || "#ffffff"}
        onChange={(v: any) => up({ buttonTextColor: v })}
      />
      <TextField
        label="Button padding"
        value={settings.buttonPadding || "12px 32px"}
        onChange={(v: any) => up({ buttonPadding: v })}
      />
      <NumberField
        label="Button radius"
        value={settings.buttonRadius}
        onChange={(v: any) => up({ buttonRadius: v })}
      />
      <NumberField
        label="Button font weight"
        value={settings.buttonFontWeight}
        onChange={(v: any) => up({ buttonFontWeight: v })}
      />
      <NumberField
        label="Padding Y"
        value={settings.paddingY}
        onChange={(v: any) => up({ paddingY: v })}
      />
      <NumberField
        label="Padding X"
        value={settings.paddingX}
        onChange={(v: any) => up({ paddingX: v })}
      />
      <TextField
        label="Max width"
        value={settings.maxWidth || "1280px"}
        onChange={(v: any) => up({ maxWidth: v })}
      />
      <NumberField
        label="Spacing"
        value={settings.spacing}
        onChange={(v: any) => up({ spacing: v })}
      />
      <NumberField
        label="Title size"
        value={settings.titleSize}
        onChange={(v: any) => up({ titleSize: v })}
      />
      <NumberField
        label="Title weight"
        value={settings.titleWeight}
        onChange={(v: any) => up({ titleWeight: v })}
      />
      <NumberField
        label="Subtitle size"
        value={settings.subtitleSize}
        onChange={(v: any) => up({ subtitleSize: v })}
      />
      <TextField
        label="Image width"
        value={settings.imageWidth || "50%"}
        onChange={(v: any) => up({ imageWidth: v })}
      />
      <TextField
        label="Content width"
        value={settings.contentWidth || "50%"}
        onChange={(v: any) => up({ contentWidth: v })}
      />
      <TextField
        label="Image radius"
        value={settings.imageRadius || "12px"}
        onChange={(v: any) => up({ imageRadius: v })}
      />
      <AlignmentField
        label="Text alignment"
        value={settings.alignment || "center"}
        onChange={(v: any) => up({ alignment: v })}
      />
      <AlignmentField
        label="Image position"
        value={settings.imagePosition || "right"}
        onChange={(v: any) => up({ imagePosition: v })}
      />

      <hr className="my-3 border-gray-200" />

      <TextField
        label="Title"
        value={content.title || ""}
        onChange={(v: any) => upC({ title: v })}
      />
      <TextField
        label="Subtitle"
        value={content.subtitle || ""}
        onChange={(v: any) => upC({ subtitle: v })}
      />
      <TextField
        label="Content"
        value={content.content || ""}
        onChange={(v: any) => upC({ content: v })}
      />
      <TextField
        label="Button text"
        value={content.buttonText || ""}
        onChange={(v: any) => upC({ buttonText: v })}
      />
      <TextField
        label="Button url"
        value={content.buttonUrl || ""}
        onChange={(v: any) => upC({ buttonUrl: v })}
      />

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
                upC({ image: "" });
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
              upC({ image: imgUrl });
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

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize"
      >
        Save changes
      </button>
    </div>
  );
};

export default SplitShowcaseEdite;

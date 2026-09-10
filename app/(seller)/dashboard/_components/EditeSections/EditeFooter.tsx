import React from "react";
import { ColorField, NumberField, TextField } from "../ReuseableInput";

const EditeFooter = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
}: any) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Footer section:
      </h1>

      {/* LAYOUT */}
      <NumberField
        label="Columns"
        value={settings.columns}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { columns: value })
        }
      />
      <NumberField
        label="Gap (px)"
        value={settings.gap}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { gap: value })
        }
      />
      <NumberField
        label="Link spacing (px)"
        value={settings.linkSpacing}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { linkSpacing: value })
        }
      />

      {/* COLORS */}
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#000000"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { backgroundColor: value })
        }
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { textColor: value })
        }
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleColor: value })
        }
      />
      <ColorField
        label="Link color"
        value={settings.linkColor || "#9ca3af"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { linkColor: value })
        }
      />
      <ColorField
        label="Link hover color"
        value={settings.linkHoverColor || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { linkHoverColor: value })
        }
      />
      <ColorField
        label="Brand color"
        value={settings.brandColor || "#f97316"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { brandColor: value })
        }
      />
      <ColorField
        label="Description color"
        value={settings.descriptionColor || "#9ca3af"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { descriptionColor: value })
        }
      />
      <ColorField
        label="Social icon color"
        value={settings.socialIconColor || "#9ca3af"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { socialIconColor: value })
        }
      />
      <ColorField
        label="Social hover color"
        value={settings.socialIconHoverColor || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, {
            socialIconHoverColor: value,
          })
        }
      />
      <ColorField
        label="Copyright color"
        value={settings.copyrightColor || "#6b7280"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { copyrightColor: value })
        }
      />

      {/* SPACING */}
      <NumberField
        label="Padding Y"
        value={settings.paddingY}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { paddingY: value })
        }
      />
      <NumberField
        label="Padding X"
        value={settings.paddingX}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { paddingX: value })
        }
      />
      <TextField
        label="Max width"
        value={settings.maxWidth || "1280px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { maxWidth: value })
        }
      />
      <TextField
        label="Divider"
        value={settings.divider || "1px solid #1f2937"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { divider: value })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* TYPOGRAPHY */}
      <TextField
        label="Brand size"
        value={settings.brandSize || "24px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { brandSize: value })
        }
      />
      <NumberField
        label="Brand weight"
        value={settings.brandWeight}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { brandWeight: value })
        }
      />
      <TextField
        label="Title size"
        value={settings.titleSize || "14px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleSize: value })
        }
      />
      <NumberField
        label="Title weight"
        value={settings.titleWeight}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleWeight: value })
        }
      />
      <TextField
        label="Link size"
        value={settings.linkSize || "14px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { linkSize: value })
        }
      />
      <TextField
        label="Description size"
        value={settings.descriptionSize || "14px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { descriptionSize: value })
        }
      />
      <TextField
        label="Social icon size"
        value={settings.socialIconSize || "20px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { socialIconSize: value })
        }
      />
      <TextField
        label="Copyright size"
        value={settings.copyrightSize || "12px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { copyrightSize: value })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <TextField
        label="Brand"
        value={content.brand || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { brand: value })
        }
      />

      {/* LOGO URL + LIVE PREVIEW */}
      <TextField
        label="Logo URL"
        value={content.logo || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { logo: value })
        }
      />
      {content.logo && (
        <div className="flex flex-col gap-1 border border-gray-200 rounded-md p-2 bg-gray-50">
          <span className="text-xs text-gray-500">Preview:</span>
          <div className="flex items-center justify-center bg-black rounded p-2">
            <img
              src={content.logo}
              alt={content.brand || "Logo preview"}
              style={{
                maxHeight: "64px",
                width: "auto",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      <TextField
        label="Description"
        value={content.description || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { description: value })
        }
      />
      <TextField
        label="Copyright"
        value={content.copyright || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { copyright: value })
        }
      />

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize mt-2"
      >
        Save changes
      </button>
    </div>
  );
};

export default EditeFooter;

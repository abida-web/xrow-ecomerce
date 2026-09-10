import React from "react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const TestimonialsEdite = ({
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
        Testimonials section:
      </h1>

      {/* LAYOUT */}
      <TextField
        label="Layout (grid / list)"
        value={settings.layout || "grid"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { layout: value })
        }
      />
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

      {/* COLORS */}
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { backgroundColor: value })
        }
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#000000"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { textColor: value })
        }
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#000000"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleColor: value })
        }
      />
      <ColorField
        label="Subtitle color"
        value={settings.subtitleColor || "#4b5563"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { subtitleColor: value })
        }
      />
      <ColorField
        label="Card background"
        value={settings.cardBg || "#f9fafb"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { cardBg: value })
        }
      />
      <ColorField
        label="Quote color"
        value={settings.quoteColor || "#374151"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { quoteColor: value })
        }
      />
      <ColorField
        label="Author name color"
        value={settings.authorNameColor || "#111827"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { authorNameColor: value })
        }
      />
      <ColorField
        label="Author role color"
        value={settings.authorRoleColor || "#6b7280"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { authorRoleColor: value })
        }
      />
      <ColorField
        label="Star color"
        value={settings.starColor || "#facc15"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { starColor: value })
        }
      />

      <AlignmentField
        label="Title alignment"
        value={settings.titleAlignment || "center"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleAlignment: value })
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
      <NumberField
        label="Card padding"
        value={settings.cardPadding}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { cardPadding: value })
        }
      />
      <TextField
        label="Card radius"
        value={settings.cardRadius || "8px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { cardRadius: value })
        }
      />
      <TextField
        label="Avatar size"
        value={settings.avatarSize || "48px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { avatarSize: value })
        }
      />
      <TextField
        label="Avatar radius"
        value={settings.avatarRadius || "50%"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { avatarRadius: value })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* TYPOGRAPHY */}
      <TextField
        label="Title size"
        value={settings.titleSize || "36px"}
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
        label="Subtitle size"
        value={settings.subtitleSize || "16px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { subtitleSize: value })
        }
      />
      <TextField
        label="Quote size"
        value={settings.quoteSize || "16px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { quoteSize: value })
        }
      />
      <TextField
        label="Author name size"
        value={settings.authorNameSize || "14px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { authorNameSize: value })
        }
      />
      <NumberField
        label="Author name weight"
        value={settings.authorNameWeight}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, {
            authorNameWeight: value,
          })
        }
      />
      <TextField
        label="Author role size"
        value={settings.authorRoleSize || "12px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { authorRoleSize: value })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <TextField
        label="Title"
        value={content.title || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { title: value })
        }
      />
      <TextField
        label="Subtitle"
        value={content.subtitle || ""}
        onChange={(value: any) =>
          updateContent(selectedSection.id, { subtitle: value })
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

export default TestimonialsEdite;

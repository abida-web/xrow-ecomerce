import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const HeroMarqueeEdite = ({
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
        Hero: Marquee section:
      </h1>

      <AlignmentField
        value={settings.alignment || "center"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { alignment: v })
        }
      />
      <TextField
        label="Min height"
        value={settings.minHeight || "500px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { minHeight: v })
        }
      />
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
        label="Marquee speed"
        value={settings.marqueeSpeed || "20s"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { marqueeSpeed: v })
        }
      />
      <TextField
        label="Marquee duration"
        value={settings.marqueeDuration || "20s"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { marqueeDuration: v })
        }
      />

      <hr className="my-3 border-gray-200" />

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

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize"
      >
        Save changes
      </button>
    </div>
  );
};

export default HeroMarqueeEdite;

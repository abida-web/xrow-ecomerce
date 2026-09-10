import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const HeroLargeLogoEdite = ({
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
        Hero: Large Logo:
      </h1>

      <AlignmentField
        value={settings.alignment || "center"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { alignment: v })
        }
      />
      <TextField
        label="Min height"
        value={settings.minHeight || "400px"}
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
        label="Logo background color"
        value={settings.logoBg || "#000000"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoBg: v })
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
        value={settings.maxWidth || "896px"}
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
        label="Logo width"
        value={settings.logoWidth || "128px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoWidth: v })
        }
      />
      <TextField
        label="Logo height"
        value={settings.logoHeight || "128px"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoHeight: v })
        }
      />
      <NumberField
        label="Logo padding"
        value={settings.logoPadding}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoPadding: v })
        }
      />
      <TextField
        label="Logo radius"
        value={settings.logoRadius || "50%"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoRadius: v })
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

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize"
      >
        Save changes
      </button>
    </div>
  );
};

export default HeroLargeLogoEdite;

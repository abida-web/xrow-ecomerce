import toast from "react-hot-toast";
import { ColorField, NumberField, TextField } from "../ReuseableInput";

const NavbarEdite = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
  activeOrganization,
  linksText,
  setLinksText,
}: any) => {
  function applyLinks() {
    try {
      const links = JSON.parse(linksText);
      updateContent(selectedSection.id, { links });
      toast.success("Links saved successfully");
    } catch (error) {
      toast.error("Invalid JSON format. Please check your syntax.");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Navbar section:
      </h1>

      {/* SETTINGS */}
      <ColorField
        label="Text color"
        value={settings.textColor || "#374151"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { textColor: v })
        }
      />
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#ffffff"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { backgroundColor: v })
        }
      />
      <ColorField
        label="Hover color"
        value={settings.hoverColor || "#f97316"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { hoverColor: v })
        }
      />
      <ColorField
        label="Button background"
        value={settings.buttonColor || "#f97316"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonColor: v })
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
        label="Button hover color"
        value={settings.buttonHoverColor || "#ea580c"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { buttonHoverColor: v })
        }
      />
      <TextField
        label="Shadow"
        value={settings.shadow || "0 1px 2px 0 rgb(0 0 0 / 0.05)"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { shadow: v })
        }
      />
      <TextField
        label="Border bottom"
        value={settings.borderBottom || "1px solid #e5e7eb"}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { borderBottom: v })
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
      <NumberField
        label="Logo size"
        value={settings.logoSize}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoSize: v })
        }
      />
      <NumberField
        label="Logo weight"
        value={settings.logoWeight}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { logoWeight: v })
        }
      />
      <NumberField
        label="Links size"
        value={settings.navLinkSize}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { navLinkSize: v })
        }
      />
      <NumberField
        label="Links weight"
        value={settings.navLinkWeight}
        onChange={(v: any) =>
          updateSectionSettings(selectedSection.id, { navLinkWeight: v })
        }
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <div className="mt-4 space-y-3">
        <h1 className="text-sm font-semibold text-gray-700">Logo:</h1>
        {activeOrganization?.logo && (
          <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={activeOrganization.logo}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      <TextField
        label="Button text"
        value={content.buttonText || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { buttonText: v })
        }
      />
      <TextField
        label="Button URL"
        value={content.buttonUrl || ""}
        onChange={(v: any) =>
          updateContent(selectedSection.id, { buttonUrl: v })
        }
      />

      <p className="text-xs text-gray-500 mt-2">Navigation links:</p>
      <textarea
        className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-full h-32 font-mono"
        value={linksText}
        onChange={(e) => setLinksText(e.target.value)}
        placeholder='[{"label": "Home", "href": "/"}, {"label": "About", "href": "/about"}]'
      />
      <button
        onClick={applyLinks}
        className="bg-orange-500 hover:bg-orange-600 text-white py-1 rounded-sm transition-all"
      >
        Save links
      </button>

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize"
      >
        Save changes
      </button>
    </div>
  );
};

export default NavbarEdite;

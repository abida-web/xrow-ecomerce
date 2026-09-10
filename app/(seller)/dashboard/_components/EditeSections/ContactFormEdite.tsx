import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const ContactFormEdite = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
}: any) => {
  const up = (p: Record<string, any>) =>
    updateSectionSettings(selectedSection.id, p);
  const upC = (p: Record<string, any>) => updateContent(selectedSection.id, p);

  const contactInfo = content?.contactInfo || {};

  const updateContactInfo = (patch: Record<string, any>) => {
    upC({ contactInfo: { ...contactInfo, ...patch } });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Contact form:
      </h1>

      {/* ---------------- SETTINGS ---------------- */}
      <TextField
        label="Layout"
        value={settings.layout || "two-column"}
        onChange={(v: any) => up({ layout: v })}
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#000000"}
        onChange={(v: any) => up({ textColor: v })}
      />
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#ffffff"}
        onChange={(v: any) => up({ backgroundColor: v })}
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#000000"}
        onChange={(v: any) => up({ titleColor: v })}
      />
      <ColorField
        label="Subtitle color"
        value={settings.subtitleColor || "#4b5563"}
        onChange={(v: any) => up({ subtitleColor: v })}
      />

      {/* Form container */}
      <ColorField
        label="Form background"
        value={settings.formBg || "#f9fafb"}
        onChange={(v: any) => up({ formBg: v })}
      />
      <NumberField
        label="Form padding"
        value={settings.formPadding}
        onChange={(v: any) => up({ formPadding: v })}
      />
      <TextField
        label="Form radius"
        value={settings.formRadius || "8px"}
        onChange={(v: any) => up({ formRadius: v })}
      />
      <TextField
        label="Form shadow"
        value={settings.formShadow || "0 4px 6px -1px rgb(0 0 0 / 0.1)"}
        onChange={(v: any) => up({ formShadow: v })}
      />

      {/* Inputs */}
      <ColorField
        label="Input background"
        value={settings.inputBg || "#ffffff"}
        onChange={(v: any) => up({ inputBg: v })}
      />
      <ColorField
        label="Input text color"
        value={settings.inputTextColor || "#111827"}
        onChange={(v: any) => up({ inputTextColor: v })}
      />
      <TextField
        label="Input border"
        value={settings.inputBorder || "1px solid #d1d5db"}
        onChange={(v: any) => up({ inputBorder: v })}
      />
      <ColorField
        label="Input focus border"
        value={settings.inputFocusBorder || "#f97316"}
        onChange={(v: any) => up({ inputFocusBorder: v })}
      />
      <TextField
        label="Input radius"
        value={settings.inputRadius || "8px"}
        onChange={(v: any) => up({ inputRadius: v })}
      />
      <TextField
        label="Input padding"
        value={settings.inputPadding || "12px 16px"}
        onChange={(v: any) => up({ inputPadding: v })}
      />
      <TextField
        label="Input focus ring"
        value={settings.inputFocusRing || "0 0 0 2px #f97316"}
        onChange={(v: any) => up({ inputFocusRing: v })}
      />

      {/* Labels */}
      <TextField
        label="Label size"
        value={settings.labelSize || "14px"}
        onChange={(v: any) => up({ labelSize: v })}
      />
      <NumberField
        label="Label weight"
        value={settings.labelWeight}
        onChange={(v: any) => up({ labelWeight: v })}
      />
      <ColorField
        label="Label color"
        value={settings.labelColor || "#374151"}
        onChange={(v: any) => up({ labelColor: v })}
      />

      {/* Button */}
      <ColorField
        label="Button bg color"
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
        label="Button width"
        value={settings.buttonWidth || "100%"}
        onChange={(v: any) => up({ buttonWidth: v })}
      />
      <TextField
        label="Button padding"
        value={settings.buttonPadding || "12px 0"}
        onChange={(v: any) => up({ buttonPadding: v })}
      />
      <TextField
        label="Button radius"
        value={settings.buttonRadius || "8px"}
        onChange={(v: any) => up({ buttonRadius: v })}
      />
      <NumberField
        label="Button font size"
        value={settings.buttonFontSize}
        onChange={(v: any) => up({ buttonFontSize: v })}
      />
      <NumberField
        label="Button font weight"
        value={settings.buttonFontWeight}
        onChange={(v: any) => up({ buttonFontWeight: v })}
      />

      {/* Layout / spacing */}
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
        value={settings.maxWidth || "1024px"}
        onChange={(v: any) => up({ maxWidth: v })}
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
      <NumberField
        label="Spacing"
        value={settings.spacing}
        onChange={(v: any) => up({ spacing: v })}
      />
      <AlignmentField
        value={settings.titleAlignment || "left"}
        onChange={(v: any) => up({ titleAlignment: v })}
      />

      <hr className="my-3 border-gray-200" />

      {/* ---------------- CONTENT ---------------- */}
      <h2 className="text-gray-400 text-sm pb-1">Content</h2>

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
        label="Button text"
        value={content.buttonText || ""}
        onChange={(v: any) => upC({ buttonText: v })}
      />
      <TextField
        label="Success message"
        value={content.successMessage || ""}
        onChange={(v: any) => upC({ successMessage: v })}
      />

      <hr className="my-3 border-gray-200" />

      {/* ---------------- CONTACT INFO ---------------- */}
      <h2 className="text-gray-400 text-sm pb-1">Contact info</h2>

      <TextField
        label="Phone"
        value={contactInfo.phone || ""}
        onChange={(v: any) => updateContactInfo({ phone: v })}
      />
      <TextField
        label="Email"
        value={contactInfo.email || ""}
        onChange={(v: any) => updateContactInfo({ email: v })}
      />
      <TextField
        label="Address"
        value={contactInfo.address || ""}
        onChange={(v: any) => updateContactInfo({ address: v })}
      />

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize mt-4"
      >
        Save changes
      </button>
    </div>
  );
};

export default ContactFormEdite;

import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const NewsletterSignupEdite = ({
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

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Newsletter Signup:
      </h1>

      <ColorField
        label="Text color"
        value={settings.textColor || "#ffffff"}
        onChange={(v: any) => up({ textColor: v })}
      />
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#f97316"}
        onChange={(v: any) => up({ backgroundColor: v })}
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#ffffff"}
        onChange={(v: any) => up({ titleColor: v })}
      />
      <ColorField
        label="Subtitle color"
        value={settings.subtitleColor || "#ffedd5"}
        onChange={(v: any) => up({ subtitleColor: v })}
      />
      <ColorField
        label="Button bg color"
        value={settings.buttonColor || "#000000"}
        onChange={(v: any) => up({ buttonColor: v })}
      />
      <ColorField
        label="Button hover color"
        value={settings.buttonHoverColor || "#1f2937"}
        onChange={(v: any) => up({ buttonHoverColor: v })}
      />
      <ColorField
        label="Button text color"
        value={settings.buttonTextColor || "#ffffff"}
        onChange={(v: any) => up({ buttonTextColor: v })}
      />
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
        value={settings.inputBorder || "none"}
        onChange={(v: any) => up({ inputBorder: v })}
      />
      <TextField
        label="Input radius"
        value={settings.inputRadius || "8px 0 0 8px"}
        onChange={(v: any) => up({ inputRadius: v })}
      />
      <TextField
        label="Input padding"
        value={settings.inputPadding || "12px 16px"}
        onChange={(v: any) => up({ inputPadding: v })}
      />
      <NumberField
        label="Input flex"
        value={settings.inputFlex}
        onChange={(v: any) => up({ inputFlex: v })}
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
        value={settings.maxWidth || "768px"}
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
      <TextField
        label="Button padding"
        value={settings.buttonPadding || "12px 32px"}
        onChange={(v: any) => up({ buttonPadding: v })}
      />
      <TextField
        label="Button radius"
        value={settings.buttonRadius || "0 8px 8px 0"}
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
      <TextField
        label="Form layout"
        value={settings.formLayout || "flex"}
        onChange={(v: any) => up({ formLayout: v })}
      />
      <NumberField
        label="Spacing"
        value={settings.spacing}
        onChange={(v: any) => up({ spacing: v })}
      />
      <TextField
        label="Shadow"
        value={settings.shadow || "0 20px 25px -5px rgb(0 0 0 / 0.1)"}
        onChange={(v: any) => up({ shadow: v })}
      />
      <TextField
        label="Border radius"
        value={settings.borderRadius || "8px"}
        onChange={(v: any) => up({ borderRadius: v })}
      />
      <AlignmentField
        value={settings.titleAlignment || "center"}
        onChange={(v: any) => up({ titleAlignment: v })}
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
        label="Button text"
        value={content.buttonText || ""}
        onChange={(v: any) => upC({ buttonText: v })}
      />
      <TextField
        label="Placeholder"
        value={content.placeholder || ""}
        onChange={(v: any) => upC({ placeholder: v })}
      />
      <TextField
        label="Success message"
        value={content.successMessage || ""}
        onChange={(v: any) => upC({ successMessage: v })}
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

export default NewsletterSignupEdite;

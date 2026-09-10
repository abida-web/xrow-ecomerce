import { ColorField, NumberField, TextField } from "../ReuseableInput";
import SlidesEditor from "./SlidesEditor";

const SlideshowFullFrameEdite = (props: any) => {
  const {
    selectedSection,
    settings,
    content,
    updateSectionSettings,
    updateContent,
    handleUpdateSection,
    removeImage,
  } = props;

  const up = (patch: Record<string, any>) =>
    updateSectionSettings(selectedSection.id, patch);
  const upC = (patch: Record<string, any>) =>
    updateContent(selectedSection.id, patch);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Slideshow: Full Frame:
      </h1>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-gray-400 text-sm pb-2">Colors</h1>
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
          value={settings.subtitleColor || "#ffffff"}
          onChange={(v: any) => up({ subtitleColor: v })}
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
        <ColorField
          label="Arrow color"
          value={settings.arrowColor || "rgba(0,0,0,0.5)"}
          onChange={(v: any) => up({ arrowColor: v })}
        />
        <ColorField
          label="Arrow hover color"
          value={settings.arrowHoverColor || "rgba(255,255,255,0.3)"}
          onChange={(v: any) => up({ arrowHoverColor: v })}
        />
        <ColorField
          label="Arrow text color"
          value={settings.arrowTextColor || "#ffffff"}
          onChange={(v: any) => up({ arrowTextColor: v })}
        />
        <ColorField
          label="Dots active color"
          value={settings.dotsColor || "#f97316"}
          onChange={(v: any) => up({ dotsColor: v })}
        />
        <ColorField
          label="Dots inactive color"
          value={settings.dotsInactiveColor || "#9ca3af"}
          onChange={(v: any) => up({ dotsInactiveColor: v })}
        />
        <ColorField
          label="Overlay color"
          value={settings.overlayColor || "rgba(0,0,0,0.3)"}
          onChange={(v: any) => up({ overlayColor: v })}
        />
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-gray-400 text-sm pb-2">Sizing</h1>
        <TextField
          label="Min height"
          value={settings.minHeight || "100vh"}
          onChange={(v: any) => up({ minHeight: v })}
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
          label="Subtitle weight"
          value={settings.subtitleWeight}
          onChange={(v: any) => up({ subtitleWeight: v })}
        />
        <TextField
          label="Button padding"
          value={settings.buttonPadding || "16px 40px"}
          onChange={(v: any) => up({ buttonPadding: v })}
        />
        <NumberField
          label="Button radius"
          value={settings.buttonRadius}
          onChange={(v: any) => up({ buttonRadius: v })}
        />
        <NumberField
          label="Button font size"
          value={settings.buttonFontSize}
          onChange={(v: any) => up({ buttonFontSize: v })}
        />
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-gray-400 text-sm pb-2">Autoplay</h1>
        <div className="flex items-center gap-3 justify-between">
          <label className="text-sm text-gray-700">Enable autoplay</label>
          <label className="toggle text-base-content">
            <input
              type="checkbox"
              checked={settings.autoplay || false}
              onChange={(e) => up({ autoplay: e.target.checked })}
              className="checked:bg-orange-500 toggle toggle-sm"
            />
          </label>
        </div>
        {settings.autoplay && (
          <NumberField
            label="Autoplay speed (ms)"
            value={settings.autoplaySpeed || 5000}
            onChange={(v: any) => up({ autoplaySpeed: v })}
          />
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-gray-400 text-sm pb-2">Content</h1>
        <TextField
          label="Button text"
          value={content.buttonText || ""}
          onChange={(v: any) => upC({ buttonText: v })}
        />
        <TextField
          label="Button URL"
          value={content.buttonUrl || ""}
          onChange={(v: any) => upC({ buttonUrl: v })}
        />
      </div>

      <SlidesEditor
        selectedSection={selectedSection}
        content={content}
        updateContent={updateContent}
        removeImage={removeImage}
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

export default SlideshowFullFrameEdite;

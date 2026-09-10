import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const FeaturedProductsEdite = ({
  selectedSection,
  settings,
  updateSectionSettings,
  handleUpdateSection,
}: any) => {
  const up = (p: Record<string, any>) =>
    updateSectionSettings(selectedSection.id, p);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        Featured Products:
      </h1>

      <NumberField
        label="Columns"
        value={settings.columns}
        onChange={(v: any) => up({ columns: v })}
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
        value={settings.subtitleColor || "#ffffff"}
        onChange={(v: any) => up({ subtitleColor: v })}
      />
      <ColorField
        label="ProductCard bg color"
        value={settings.productCardBg || "#ffffff"}
        onChange={(v: any) => up({ productCardBg: v })}
      />
      <ColorField
        label="Product name color"
        value={settings.productNameColor}
        onChange={(v: any) => up({ productNameColor: v })}
      />
      <ColorField
        label="Product price color"
        value={settings.productPriceColor}
        onChange={(v: any) => up({ productPriceColor: v })}
      />
      <TextField
        label="ProductCard shadow"
        value={settings.productCardShadow || "0 4px 6px -1px rgb(0 0 0 / 0.1)"}
        onChange={(v: any) => up({ productCardShadow: v })}
      />
      <TextField
        label="ProductCard hover shadow"
        value={
          settings.productCardHoverShadow || "0 20px 25px -5px rgb(0 0 0 / 0.1)"
        }
        onChange={(v: any) => up({ productCardHoverShadow: v })}
      />
      <ColorField
        label="Button bg color"
        value={settings.buttonColor}
        onChange={(v: any) => up({ buttonColor: v })}
      />
      <ColorField
        label="Button hover color"
        value={settings.buttonHoverColor}
        onChange={(v: any) => up({ buttonHoverColor: v })}
      />
      <ColorField
        label="Button text color"
        value={settings.buttonTextColor}
        onChange={(v: any) => up({ buttonTextColor: v })}
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
      <NumberField
        label="Card padding"
        value={settings.productCardPadding}
        onChange={(v: any) => up({ productCardPadding: v })}
      />
      <NumberField
        label="Card radius"
        value={settings.productCardRadius}
        onChange={(v: any) => up({ productCardRadius: v })}
      />
      <TextField
        label="Image height"
        value={settings.productImageHeight || "256px"}
        onChange={(v: any) => up({ productImageHeight: v })}
      />
      <NumberField
        label="Image radius"
        value={settings.productImageRadius}
        onChange={(v: any) => up({ productImageRadius: v })}
      />
      <NumberField
        label="Product name size"
        value={settings.productNameSize}
        onChange={(v: any) => up({ productNameSize: v })}
      />
      <NumberField
        label="Product name weight"
        value={settings.productNameWeight}
        onChange={(v: any) => up({ productNameWeight: v })}
      />
      <NumberField
        label="Product price size"
        value={settings.productPriceSize}
        onChange={(v: any) => up({ productPriceSize: v })}
      />
      <NumberField
        label="Product price weight"
        value={settings.productPriceWeight}
        onChange={(v: any) => up({ productPriceWeight: v })}
      />
      <TextField
        label="Button padding"
        value={settings.buttonPadding || "8px 0"}
        onChange={(v: any) => up({ buttonPadding: v })}
      />
      <TextField
        label="Button width"
        value={settings.buttonWidth || "100%"}
        onChange={(v: any) => up({ buttonWidth: v })}
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
      <NumberField
        label="Gap"
        value={settings.gap}
        onChange={(v: any) => up({ gap: v })}
      />
      <AlignmentField
        value={settings.titleAlignment || "center"}
        onChange={(v: any) => up({ titleAlignment: v })}
      />

      <hr className="my-3 border-gray-200" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 justify-between mt-2">
          <p className="text-xs text-gray-500">Show prices</p>
          <label>
            <input
              type="checkbox"
              checked={settings.showPrices !== false}
              onChange={(e) => up({ showPrices: e.target.checked })}
              className="checked:bg-orange-500 toggle toggle-sm"
            />
          </label>
        </div>
        <div className="flex items-center gap-3 justify-between mt-2">
          <p className="text-xs text-gray-500">Show Add to Cart</p>
          <label>
            <input
              type="checkbox"
              checked={settings.showAddToCart !== false}
              onChange={(e) => up({ showAddToCart: e.target.checked })}
              className="checked:bg-orange-500 toggle toggle-sm"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize mt-2"
      >
        Save changes
      </button>
    </div>
  );
};

export default FeaturedProductsEdite;

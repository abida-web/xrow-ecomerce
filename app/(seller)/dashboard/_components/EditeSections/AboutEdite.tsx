import React from "react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const AboutEdite = ({
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
        About / Rich Text section:
      </h1>

      {/* SETTINGS */}
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#ffffff"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            backgroundColor: value,
          });
        }}
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#000000"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            textColor: value,
          });
        }}
      />
      <ColorField
        label="Title color"
        value={settings.titleColor || "#000000"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            titleColor: value,
          });
        }}
      />
      <ColorField
        label="Content color"
        value={settings.contentColor || "#374151"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            contentColor: value,
          });
        }}
      />
      <ColorField
        label="Divider color"
        value={settings.dividerColor || "#f97316"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            dividerColor: value,
          });
        }}
      />

      <AlignmentField
        label="Alignment"
        value={settings.alignment || "center"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            alignment: value,
          });
        }}
      />
      <AlignmentField
        label="Title alignment"
        value={settings.titleAlignment || "center"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            titleAlignment: value,
          });
        }}
      />

      <NumberField
        label="Padding Y"
        value={settings.paddingY}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            paddingY: value,
          });
        }}
      />
      <NumberField
        label="Padding X"
        value={settings.paddingX}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            paddingX: value,
          });
        }}
      />
      <TextField
        label="Max width"
        value={settings.maxWidth || "896px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            maxWidth: value,
          });
        }}
      />
      <NumberField
        label="Spacing"
        value={settings.spacing}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            spacing: value,
          });
        }}
      />

      <hr className="my-3 border-gray-200" />

      {/* TYPOGRAPHY */}
      <TextField
        label="Title size"
        value={settings.titleSize || "36px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            titleSize: value,
          });
        }}
      />
      <NumberField
        label="Title weight"
        value={settings.titleWeight}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            titleWeight: value,
          });
        }}
      />
      <TextField
        label="Content size"
        value={settings.contentSize || "18px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            contentSize: value,
          });
        }}
      />
      <NumberField
        label="Content line height"
        value={settings.contentLineHeight}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            contentLineHeight: value,
          });
        }}
      />

      <hr className="my-3 border-gray-200" />

      {/* DIVIDER */}
      <TextField
        label="Divider width"
        value={settings.dividerWidth || "80px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            dividerWidth: value,
          });
        }}
      />
      <TextField
        label="Divider thickness"
        value={settings.dividerThickness || "2px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            dividerThickness: value,
          });
        }}
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <TextField
        label="Title"
        value={content.title || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { title: value });
        }}
      />
      <TextField
        label="Content (HTML)"
        value={content.content || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { content: value });
        }}
      />
      <TextField
        label="Image URL"
        value={content.image || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { image: value });
        }}
      />

      <button
        onClick={handleUpdateSection}
        className={`text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize `}
      >
        Save changes
      </button>
    </div>
  );
};

export default AboutEdite;

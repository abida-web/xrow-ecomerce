import React from "react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const AnnouncementbarEdite = ({
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
        Announcement bar section:
      </h1>

      {/* SETTINGS */}
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#000000"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            backgroundColor: value,
          });
        }}
      />
      <ColorField
        label="Text color"
        value={settings.textColor || "#ffffff"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            textColor: value,
          });
        }}
      />
      <ColorField
        label="Link color"
        value={settings.linkColor || "#ffffff"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            linkColor: value,
          });
        }}
      />
      <ColorField
        label="Link hover color"
        value={settings.linkHoverColor || "#ff6b35"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            linkHoverColor: value,
          });
        }}
      />
      <AlignmentField
        value={settings.alignment || "center"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            alignment: value,
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
      <TextField
        label="Border bottom"
        value={settings.borderBottom || "1px solid #ea580c"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            borderBottom: value,
          });
        }}
      />
      <TextField
        label="Max width"
        value={settings.maxWidth || "1280px"}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            maxWidth: value,
          });
        }}
      />
      <NumberField
        label="Font size"
        value={settings.fontSize}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            fontSize: value,
          });
        }}
      />
      <NumberField
        label="Font weight"
        value={settings.fontWeight}
        onChange={(value: any) => {
          updateSectionSettings(selectedSection.id, {
            fontWeight: value,
          });
        }}
      />

      <hr className="my-3 border-gray-200" />

      {/* CONTENT */}
      <TextField
        label="Text"
        value={content.text || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { text: value });
        }}
      />
      <TextField
        label="Link text"
        value={content.linkText || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { linkText: value });
        }}
      />
      <TextField
        label="Link URL"
        value={content.linkUrl || ""}
        onChange={(value: any) => {
          updateContent(selectedSection.id, { linkUrl: value });
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

export default AnnouncementbarEdite;

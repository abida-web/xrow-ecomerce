import React from "react";
import {
  AlignmentField,
  ColorField,
  NumberField,
  TextField,
} from "../ReuseableInput";

const FaqEdite = ({
  selectedSection,
  settings,
  content,
  updateSectionSettings,
  updateContent,
  handleUpdateSection,
}: any) => {
  const faqs = content.faqs || [];

  const updateFaq = (index: number, key: string, value: any) => {
    const updated = faqs.map((faq: any, i: number) =>
      i === index ? { ...faq, [key]: value } : faq,
    );
    updateContent(selectedSection.id, { faqs: updated });
  };

  const addFaq = () => {
    updateContent(selectedSection.id, {
      faqs: [...faqs, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    updateContent(selectedSection.id, {
      faqs: faqs.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mt-3 text-sm font-semibold text-orange-500">
        FAQ section:
      </h1>

      {/* SETTINGS */}
      <ColorField
        label="Background color"
        value={settings.backgroundColor || "#f9fafb"}
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
        label="Question color"
        value={settings.questionColor || "#111827"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { questionColor: value })
        }
      />
      <ColorField
        label="Answer color"
        value={settings.answerColor || "#4b5563"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { answerColor: value })
        }
      />
      <ColorField
        label="Icon color"
        value={settings.iconColor || "#f97316"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { iconColor: value })
        }
      />
      <ColorField
        label="Active border color"
        value={settings.activeBorder || "#f97316"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { activeBorder: value })
        }
      />
      <ColorField
        label="FAQ item background"
        value={settings.faqItemBg || "#ffffff"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { faqItemBg: value })
        }
      />

      <AlignmentField
        label="Title alignment"
        value={settings.titleAlignment || "center"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { titleAlignment: value })
        }
      />

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
        value={settings.maxWidth || "768px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { maxWidth: value })
        }
      />
      <NumberField
        label="FAQ spacing"
        value={settings.faqSpacing}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { faqSpacing: value })
        }
      />
      <NumberField
        label="FAQ item padding"
        value={settings.faqItemPadding}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { faqItemPadding: value })
        }
      />
      <TextField
        label="FAQ item radius"
        value={settings.faqItemRadius || "8px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { faqItemRadius: value })
        }
      />
      <TextField
        label="FAQ item border"
        value={settings.faqItemBorder || "1px solid #e5e7eb"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { faqItemBorder: value })
        }
      />
      <TextField
        label="Divider"
        value={settings.divider || "1px solid #e5e7eb"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { divider: value })
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
        label="Question size"
        value={settings.questionSize || "18px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { questionSize: value })
        }
      />
      <NumberField
        label="Question weight"
        value={settings.questionWeight}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { questionWeight: value })
        }
      />
      <TextField
        label="Answer size"
        value={settings.answerSize || "16px"}
        onChange={(value: any) =>
          updateSectionSettings(selectedSection.id, { answerSize: value })
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

      <hr className="my-3 border-gray-200" />

      {/* FAQ ITEMS */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-700">FAQ Items</h2>
        <button
          onClick={addFaq}
          className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all px-2 py-1 rounded"
        >
          + Add
        </button>
      </div>

      {faqs.map((faq: any, index: number) => (
        <div
          key={index}
          className="border border-gray-200 rounded-md p-2 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              #{index + 1}
            </span>
            <button
              onClick={() => removeFaq(index)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <TextField
            className={"w-10"}
            label="Question"
            value={faq.question || ""}
            onChange={(value: any) => updateFaq(index, "question", value)}
          />
          <TextField
            className={"w-10"}
            label="Answer"
            value={faq.answer || ""}
            onChange={(value: any) => updateFaq(index, "answer", value)}
          />
        </div>
      ))}

      <button
        onClick={handleUpdateSection}
        className="text-xs bg-orange-200 hover:bg-orange-500 hover:text-white transition-all duration-300 px-2 py-1.5 rounded-md capitalize mt-2"
      >
        Save changes
      </button>
    </div>
  );
};

export default FaqEdite;

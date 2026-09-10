export const ColorField = ({ label, value, onChange }: any) => (
  <div className="flex items-center justify-between">
    <p className="text-xs text-gray-500">{label}</p>
    <input
      type="color"
      value={value}
      className="w-7 cursor-pointer"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Reusable Text Input Field
export const TextField = ({ label, value, onChange, className = "" }: any) => (
  <div className="flex items-center gap-3 justify-between mt-2">
    <p className="text-xs text-gray-500">{label}</p>
    <input
      type="text"
      className={`text-sm border border-gray-300 px-2 py-1 rounded-sm flex-1 ml-2 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Reusable Number Input Field
export const NumberField = ({ label, value, onChange }: any) => (
  <div className="flex items-center gap-3 justify-between mt-2">
    <p className="text-xs text-gray-500">{label}</p>
    <input
      type="number"
      className="text-sm border border-gray-300 px-2 py-1 rounded-sm w-20"
      value={value ?? ""}
      onChange={(e) => {
        const newValue =
          e.target.value === "" ? undefined : Number(e.target.value);
        onChange(newValue);
      }}
    />
  </div>
);

// Reusable Alignment Buttons Field
export const AlignmentField = ({
  value,
  onChange,
  label = "Alignment",
}: any) => {
  const alignments = ["left", "center", "right"];
  return (
    <div className="flex items-center gap-3 justify-between mt-2">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {alignments.map((align) => (
          <button
            key={align}
            className={`text-xs bg-gray-200 px-2 py-1.5 rounded-md capitalize ${
              value === align &&
              "bg-orange-500 text-white transition-all duration-300"
            }`}
            onClick={() => onChange(align)}
          >
            {align}
          </button>
        ))}
      </div>
    </div>
  );
};

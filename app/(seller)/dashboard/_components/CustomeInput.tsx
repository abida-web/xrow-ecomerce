import React from "react";

interface CustomInputProps {
  label: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  step?: string;
  required?: boolean;
}

const CustomInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  name = "",
  step,
  required = false,
}: CustomInputProps) => {
  const inputValue = value ?? "";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-[14px] text-gray-400">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={inputValue}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        required={required}
        className="bg-white/20 px-5 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
};

export default CustomInput;

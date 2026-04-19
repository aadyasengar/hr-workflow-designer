import React from 'react';

interface DynamicParamFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DynamicParamField = ({ label, value, onChange }: DynamicParamFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 capitalize">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}...`}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default DynamicParamField;

import React, { useState } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface ReSelectableProps {
  options: Option[];
  onSelect: (value: string | number) => void;
  defaultSelected?: string | number;
}

export default function ReSelectable({ options, onSelect, defaultSelected }: ReSelectableProps) {
  const [selected, setSelected] = useState<string | number>(defaultSelected || options[0].value);

  const handleSelect = (value: string | number) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="space-4 grid grid-cols-3 gap-x-4 gap-y-6">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`rounded-md px-5 py-2 font-spaceGrotesk text-sm font-semibold transition-colors ${
            selected === option.value
              ? 'border border-primary-400 bg-primary-100 text-primary-500'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

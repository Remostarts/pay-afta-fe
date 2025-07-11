import React from 'react';

interface ReToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const ReToggle: React.FC<ReToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${checked ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span
        className={`inline-block size-7 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};

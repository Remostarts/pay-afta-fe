'use client';

import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';

type SearchableSelectTypes = {
  options: { name: string; code?: string }[];
  defaultValue?: string;
  onChange: (value: string) => void;
  loading: boolean;
  placeholder?: string;
  limit?: number; // Optional: number of banks to show initially (default: 25)
};

export const SearchableSelect = ({
  options = [],
  defaultValue = '',
  onChange,
  loading,
  placeholder = 'Select bank',
  limit = 25,
}: SearchableSelectTypes) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Efficient filtering with memoization
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options.slice(0, limit);
    return options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm, limit]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    setSearchTerm(''); // reset search
    setIsOpen(false);
    onChange(value);
  };

  const handleInputClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape' && searchTerm) {
      e.preventDefault();
      setSearchTerm('');
      inputRef.current?.focus();
    }
  };

  return (
    <Select
      onValueChange={handleSelectChange}
      value={selectedValue}
      disabled={loading}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <FormControl>
        <SelectTrigger className="w-full" onClick={() => setIsOpen(true)}>
          {/* ✅ Fix: placeholder now shows properly */}
          <SelectValue placeholder={loading ? 'Loading banks...' : selectedValue || placeholder} />
        </SelectTrigger>
      </FormControl>

      <SelectContent className="max-h-[300px] bg-white p-0" position="popper">
        {/* Search input */}
        <div className="p-2 border-b sticky top-0 bg-white z-10">
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleInputClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            placeholder="Search banks..."
            className="w-full"
          />
        </div>

        {/* Filtered list */}
        <div className="overflow-y-auto max-h-[280px]">
          {filteredOptions.length === 0 && !loading ? (
            <div className="p-2 text-center text-sm text-gray-500">
              {searchTerm ? 'No banks found.' : 'No banks available.'}
            </div>
          ) : (
            filteredOptions.map((bank, i) => (
              <SelectItem
                key={bank.code || `${bank.name}-${i}`}
                value={bank.name}
                className="cursor-pointer"
              >
                {bank.name}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

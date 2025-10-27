'use client';

import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';

type SearchableSelectTypes = {
  options: { name: string; code?: string }[];
  defaultValue?: string;
  onChange: (value: string) => void;
  loading: boolean;
  placeholder?: string;
};

export const SearchableSelect = ({
  options = [],
  defaultValue = '',
  onChange,
  loading,
  placeholder = 'Select bank',
}: SearchableSelectTypes) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOptions, setFilteredOptions] =
    useState<{ name: string; code?: string }[]>(options);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  //   console.log(selectedValue);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Focus the input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    setSearchTerm(''); // Clear search term when an option is selected
    setIsOpen(false); // Close dropdown after selection
    onChange(value);
  };

  const handleTriggerClick = () => {
    setIsOpen(true);
  };

  // Prevent dropdown from closing when clicking on search input
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle key down to prevent select from closing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    // Prevent Escape key from closing dropdown if we're searching
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
        <SelectTrigger className="w-full" onClick={handleTriggerClick}>
          <SelectValue placeholder={loading ? 'Loading banks...' : placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent className="max-h-[300px] bg-white p-0" position="popper">
        {/* Search Input inside dropdown */}
        <div className="p-2 border-b sticky top-0 bg-white z-10">
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            placeholder="Search banks..."
            className="w-full"
          />
        </div>

        {/* Options list */}
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

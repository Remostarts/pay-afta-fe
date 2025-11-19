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
import { Search, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import InviteCounterparty from '../view/dashboard/NewOrder/InviteCounterparty';
import { inviteCounterParty } from '@/lib/actions/root/user.action';

type SearchableSelectTypes = {
  type: 'counterparty' | 'bank';
  options: {
    name: string;
    code?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }[];
  defaultValue?: string;
  onChange: (value: string) => void;
  inviteCounterParty?: (email: string) => void;
  loading: boolean;
  placeholder?: string;
  limit?: number;
  value?: string;
  showRecent?: boolean; // Show recent section for counterparties
  recentOptions?: { name: string; email?: string; phone?: string; avatar?: string }[];
  onInvite?: () => void; // Callback for "Invite supplier" action
  searchPlaceholder?: string; // Custom search placeholder
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;
};

export const SearchableSelect = ({
  type,
  options = [],
  defaultValue = '',
  onChange,
  loading,
  placeholder,
  limit = 25,
  value,
  showRecent = false,
  recentOptions = [],
  onInvite,
  searchPlaceholder,
  inviteCounterParty,
  searchTerm: propSearchTerm,
  setSearchTerm: setPropSearchTerm,
}: SearchableSelectTypes) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Efficient filtering with memoization
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options.slice(0, limit);
    return options.filter((option) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        option.name.toLowerCase().includes(searchLower) ||
        (option.email && option.email.toLowerCase().includes(searchLower)) ||
        (option.phone && option.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [options, searchTerm, limit]);

  // Filter recent options
  const filteredRecent = useMemo(() => {
    if (!searchTerm || !showRecent) return recentOptions;
    return recentOptions.filter((option) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        option.name.toLowerCase().includes(searchLower) ||
        (option.email && option.email.toLowerCase().includes(searchLower)) ||
        (option.phone && option.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [recentOptions, searchTerm, showRecent]);

  // Update selectedValue when value changes
  useEffect(() => {
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
    } else if (defaultValue !== selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, value]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    setSearchTerm('');
    setIsOpen(false);
    onChange(value);

    const selectedOption = options.find((o) => o.name === value);
    if (!selectedOption) return;

    if (type === 'counterparty' && selectedOption.email) {
      onChange(selectedOption.email);
    } else {
      onChange(selectedOption.name);
    }
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

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (loading) {
      return type === 'counterparty' ? 'Loading counterparties...' : 'Loading banks...';
    }
    return type === 'counterparty' ? 'Search or add counterparty' : 'Select bank';
  };

  const getSearchPlaceholder = () => {
    if (searchPlaceholder) return searchPlaceholder;
    return type === 'counterparty'
      ? 'enter counterparty username, email address or phone number'
      : 'Search banks...';
  };

  const renderAvatar = (option: { name: string; avatar?: string }) => {
    if (option.avatar) {
      return (
        <img src={option.avatar} alt={option.name} className="w-8 h-8 rounded-full object-cover" />
      );
    }

    // Default avatar with initials
    const initials = option.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
        {initials}
      </div>
    );
  };

  const renderOption = (option: any, index: number) => (
    <SelectItem
      key={option.code || `${option.name}-${index}`}
      value={option.name}
      className="cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center gap-3 py-1">
        {type === 'counterparty' && renderAvatar(option)}
        <div className="flex flex-col flex-1">
          <span className="text-sm font-medium">{option.name}</span>
          {type === 'counterparty' && (option.email || option.phone) && (
            <span className="text-xs text-gray-500">{option.email || option.phone}</span>
          )}
        </div>
      </div>
    </SelectItem>
  );

  return (
    <Select
      onValueChange={handleSelectChange}
      value={value !== undefined ? value : selectedValue}
      disabled={loading}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <FormControl>
        <SelectTrigger className="w-full" onClick={() => setIsOpen(true)}>
          <SelectValue placeholder={getPlaceholder()}>
            {(value !== undefined ? value : selectedValue) || ''}
          </SelectValue>
        </SelectTrigger>
      </FormControl>

      <SelectContent className="max-h-[400px] bg-white p-0" position="popper">
        {/* Search input with icon */}
        <div className="p-3 border-b sticky top-0 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);

                if (type === 'counterparty' && typeof setPropSearchTerm === 'function') {
                  setPropSearchTerm(val);
                }
              }}
              onClick={handleInputClick}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              placeholder={getSearchPlaceholder()}
              className="w-full pl-9 pr-9"
            />
            {searchTerm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[320px]">
          {/* Recent section for counterparties */}
          {type === 'counterparty' && showRecent && filteredRecent.length > 0 && !searchTerm && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">Recent</div>
              {filteredRecent.map((option, i) => renderOption(option, i))}
            </div>
          )}

          {/* Main options list */}
          {filteredOptions.length === 0 && !loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchTerm
                ? type === 'counterparty'
                  ? 'No counterparty found.'
                  : 'No banks found.'
                : type === 'counterparty'
                  ? 'No counterparties available.'
                  : 'No banks available.'}
            </div>
          ) : (
            <div className={showRecent && !searchTerm ? 'border-t' : ''}>
              {filteredOptions.map((option, i) => renderOption(option, i))}
            </div>
          )}

          {/* Invite supplier button for counterparties */}
          {type === 'counterparty' && onInvite && (
            <div className="border-t p-2">
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInvite();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Invite supplier</span>
              </button> */}
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Plus width={16} height={16} />
                    Invite counterparty
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <InviteCounterparty
                    onHandleEmailChange={inviteCounterParty}
                    onSuccess={() => {
                      setIsInviteDialogOpen(false);
                      setIsOpen(false); // Close the select dropdown as well
                    }}
                    onCancel={() => {
                      setIsInviteDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

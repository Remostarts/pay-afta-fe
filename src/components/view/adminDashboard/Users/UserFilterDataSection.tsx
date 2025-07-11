'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DatePickerWithRange } from '../shared/DatePicker';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type UserFilterDataSectionProps = {
  // setSelectedStatusType: Dispatch<SetStateAction<string | null>>;
  // setSelectedDate: Dispatch<SetStateAction<string | null>>;
  handlePageChange({ pageNumber, selectedDate }: any): void;
};

export default function UserFilterDataSection({
  // setSelectedStatusType,
  // setSelectedDate,
  handlePageChange,
}: UserFilterDataSectionProps) {
  const [dateOption, setDateOption] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);

  const handleDateChange = (value: string) => {
    if (value === 'Custom Range') {
      setPopoverOpen(true);
      setDateOption(value);
    } else {
      setSelectedDateRange(null);
      setDateOption(value);
      handlePageChange({ selectedDate: value });
    }
  };

  const handleApplyDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const formattedRange = `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
      setSelectedDateRange(formattedRange);
      handlePageChange({ selectedDate: formattedRange });
    }
    setPopoverOpen(false);
  };

  const handleCancelDateRange = () => {
    setPopoverOpen(false);
    if (!selectedDateRange) {
      setDateOption(null);
    }
  };

  // const getDisplayValue = () => {
  //   if (dateOption === 'Custom Range' && selectedDateRange) {
  //     return selectedDateRange;
  //   }
  //   return dateOption || 'Select a Date';
  // };

  return (
    <div className="mb-2 flex flex-col rounded-md bg-white p-4">
      <div className="flex items-center justify-end">
        {/* date section  */}
        <div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div>
                <Select
                  value={dateOption || undefined}
                  onValueChange={handleDateChange}
                  defaultValue="Today"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Date</SelectLabel>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="Last Week">Last Week</SelectItem>
                      <SelectItem value="This Month">This Month</SelectItem>
                      <SelectItem value="Last Month">Last Month</SelectItem>
                      <SelectItem value="Custom Range" className="text-[#1F7EAD]">
                        Custom Range
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
              <DatePickerWithRange
                onApply={handleApplyDateRange}
                onCancel={handleCancelDateRange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

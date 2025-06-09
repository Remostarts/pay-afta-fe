import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DatePickerWithRange } from '../shared/DatePicker';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

type TabType = 'Role' | 'Team Members';

type FilterProps = {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
  onStatusChange: (status: string | null) => void;
};

export default function FilterSection({ selectedTab, onTabChange, onStatusChange }: FilterProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);
  const [dateOption, setDateOption] = useState<string | null>(null);

  console.log(selectedDateRange);
  // console.log(dateOption);

  // Handle date filter change
  const handleDateChange = (value: string) => {
    if (value === 'Custom Range') {
      setPopoverOpen(true);
      setDateOption(value);
    } else {
      setSelectedDateRange(null);
      setDateOption(value);
    }
  };

  // Handle custom date range selection
  const handleApplyDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const formattedRange = `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
      setSelectedDateRange(formattedRange);
    }
    setPopoverOpen(false);
  };

  // Handle cancel date range
  const handleCancelDateRange = () => {
    setPopoverOpen(false);
    if (!selectedDateRange) {
      setDateOption(null);
    }
  };

  return (
    <div className="mb-2 flex flex-col gap-4 rounded-md bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Tabs section  */}
      <div className="w-full lg:w-auto">
        <Tabs defaultValue="Team Members" className="w-full rounded-[4px] p-1 lg:h-[56] lg:w-[408]">
          <TabsList className="grid w-full grid-cols-2 rounded-lg border-2 border-[#A9D8EF] bg-[#E9F5FB]">
            {(['Team Members', 'Role'] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={() => onTabChange(tab)}
                className="rounded-lg font-inter text-[#7EC4E7] data-[state=active]:bg-[#1F7EAD] data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        {/* date section  */}
        <div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div>
                <Select
                  value={dateOption || undefined}
                  onValueChange={handleDateChange}
                  // defaultValue={defaultValue}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={'Select Date'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Date</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="last_week">Last Week</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
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

        {/* state section  */}
        {/* <div className="w-full sm:w-auto">
          <Select onValueChange={(e) => onStatusChange(e !== 'All' ? e : null)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select a State" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>State</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        {/* export button  */}
        <div className="w-full sm:w-auto">
          <button className="flex w-full items-center justify-center gap-1 rounded-md bg-[#1F7EAD] px-4 py-2 text-white sm:w-auto">
            <Image
              src="/assets/admin-dashboard/users/export-icon.svg"
              width={20}
              height={20}
              alt="export"
            />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

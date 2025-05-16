'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DatePickerWithRange } from '../shared/DatePicker';

import { ReHeading } from '@/components/re-ui/ReHeading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const data = [
  {
    month: 'May',
    debit: 10,
    credit: 0,
  },
];

interface transactionChartProps {
  changeDate: Dispatch<SetStateAction<string>>;
}

export default function TransactionsChart({ changeDate }: transactionChartProps) {
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
      changeDate(value);
    }
  };

  const handleApplyDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const formattedRange = `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
      setSelectedDateRange(formattedRange);
      changeDate(formattedRange);
    }
    setPopoverOpen(false);
  };

  const handleCancelDateRange = () => {
    setPopoverOpen(false);
    if (!selectedDateRange) {
      setDateOption(null);
    }
  };

  return (
    <div className="mt-5 rounded-md bg-white p-5">
      <div className="flex items-center justify-between">
        <ReHeading heading="Transactions" size={'lg'} />
        <div className="relative">
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
            <PopoverContent
              className="w-auto bg-white p-0 shadow-lg"
              align="start"
              sideOffset={5}
              style={{ zIndex: 50 }}
            >
              <DatePickerWithRange
                onApply={handleApplyDateRange}
                onCancel={handleCancelDateRange}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
        <p className="font-inter text-sm text-gray-500">Total Transaction</p>
        <span className="font-inter text-xl font-semibold">₦19000</span>
      </div>
      <div className="mt-3 h-[400px] rounded-md border-2 border-gray-200 bg-white md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="debit" stroke="#D42620" activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="credit" stroke="#0F973C" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

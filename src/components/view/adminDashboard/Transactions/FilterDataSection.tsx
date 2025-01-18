import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

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

type FilterDataSectionProps = {
  setSelectedStatusType: Dispatch<SetStateAction<string | null>>;
};

export default function FilterDataSection({ setSelectedStatusType }: FilterDataSectionProps) {
  return (
    <div className="mb-2 flex flex-col gap-4 rounded-md bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Tabs section  */}
      <div className="w-full lg:w-auto">
        <Tabs defaultValue="Transaction" className="w-full rounded-[4px] p-1 lg:h-[56] lg:w-[408] ">
          <TabsList className="grid w-full grid-cols-2 rounded-lg border-2 border-[#A9D8EF] bg-[#E9F5FB]">
            <TabsTrigger
              value="Transaction"
              className="rounded-lg font-inter text-[#7EC4E7] data-[state=active]:bg-[#1F7EAD] data-[state=active]:text-white"
            >
              Transaction
            </TabsTrigger>
            <TabsTrigger
              value="Withdrawal Request"
              className="rounded-lg font-inter text-[#7EC4E7] data-[state=active]:bg-[#1F7EAD] data-[state=active]:text-white"
            >
              Withdrawal Request
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        {/* date section  */}
        <div className="w-full sm:w-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select a Date" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Date</SelectLabel>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last Week">Last Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* state section  */}
        <div className="w-full sm:w-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Successful</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* state section  */}
        <div className="w-full sm:w-auto">
          <Select onValueChange={(e) => setSelectedStatusType(e !== 'All' ? e : null)}>
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
        </div>

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

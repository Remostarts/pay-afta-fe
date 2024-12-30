import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

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
    <div className="mb-2 flex items-center justify-end rounded-md bg-white p-4">
      {/* date section  */}
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
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
      <div className="ml-4">
        <Select onValueChange={(e) => setSelectedStatusType(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a State" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>State</SelectLabel>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* export button  */}
      <div>
        <button className="ml-4 flex items-center gap-1 rounded-md bg-[#1F7EAD] px-4 py-2 text-white">
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
  );
}

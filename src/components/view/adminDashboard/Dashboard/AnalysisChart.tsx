'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import { ReHeading } from '@/components/re-ui/ReHeading';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function AnalysisChart() {
  return (
    <div className="mt-5 rounded-md bg-white p-5">
      <div className="flex items-center justify-between">
        <ReHeading heading="Analysis" size={'lg'} />
        <div>
          <Select>
            <SelectTrigger className="w-[180px] bg-[#E9F5FB]">
              <SelectValue placeholder="Select a Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Last Week">Last Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Users</p>
          <p className="font-inter text-xl font-semibold">500.00</p>
          <p>
            <span className="text-sm text-[#FF3347]">-0.5%</span>from the last week
          </p>
        </div>
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Payment Orders</p>
          <p className="font-inter text-xl font-semibold">₦709,500.00</p>
          <p>
            <span className="text-sm text-[#FF3347]">-0.5%</span>from the last week
          </p>
        </div>
      </div>
      <div className="mt-3 h-[360px] rounded-md border-2 border-gray-200 bg-white md:p-4">
        <ReHeading heading="New Customers" size={'lg'} />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

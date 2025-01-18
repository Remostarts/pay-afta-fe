'use client';

import React from 'react';
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
    Credit: 4000,
    Debit: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    Credit: 3000,
    Debit: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    Credit: 2000,
    Debit: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    Credit: 2780,
    Debit: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    Credit: 1890,
    Debit: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    Credit: 2390,
    Debit: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    Credit: 3490,
    Debit: 4300,
    amt: 2100,
  },
];

export default function TransactionsChart() {
  return (
    <div className="mt-5 rounded-md bg-white p-5">
      <div className="flex items-center justify-between">
        <ReHeading heading="Transactions" size={'lg'} />
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
      <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
        <p className="font-inter text-sm text-gray-500">Total Transaction</p>
        <span className="font-inter text-xl font-semibold">₦709,500.00</span>
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Debit" stroke="#D42620" activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Credit" stroke="#0F973C" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

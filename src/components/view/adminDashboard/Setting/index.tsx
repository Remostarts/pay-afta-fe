'use client';

import { useState } from 'react';

import Compliance from './Compliance';
import Profile from './Profile';
import Security from './Security';
import SettlementAccount from './SettlementAccount';
import Social from './Social';
import Notification from './Notification';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TABS = [
  { label: 'Profile Information', key: 'profile' },
  { label: 'Social', key: 'social' },
  { label: 'Notification', key: 'notification' },
  { label: 'Settlement Account', key: 'settlement' },
  { label: 'Security', key: 'security' },
  { label: 'Compliance', key: 'compliance' },
];

export default function Setting() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen w-full rounded-md bg-white p-5">
      <h2 className="mb-4 text-2xl font-semibold">Settings</h2>
      <div className="mb-6 border-b">
        <nav className="hidden gap-6 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`border-b-2 p-2 transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-[#03045B] font-semibold text-[#03045B]'
                  : 'border-transparent text-gray-600'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <nav className="flex md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue className="bg-white">
                {TABS.find((tab) => tab.key === activeTab)?.label || 'Select'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="bg-white">
                {TABS.map((tab) => (
                  <SelectItem
                    key={tab.key}
                    value={tab.key}
                    className={`border-b-2 p-2 transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'border-[#03045B] font-semibold text-[#03045B]'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </nav>
      </div>
      <div className="">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'social' && <Social />}
        {activeTab === 'notification' && <Notification />}
        {activeTab === 'settlement' && <SettlementAccount />}
        {activeTab === 'security' && <Security />}
        {activeTab === 'compliance' && <Compliance />}
      </div>
    </div>
  );
}

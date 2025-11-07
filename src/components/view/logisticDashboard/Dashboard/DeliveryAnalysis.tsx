'use client';

import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatsObject {
  pending: number;
  ongoing: number;
  completed: number;
  failed: number;
}

interface DeliveryAnalysisProps {
  stats: StatsObject; // backend object
}

export default function DeliveryAnalysis({ stats }: DeliveryAnalysisProps) {
  const statsArray = [
    { label: 'Pending', value: stats?.pending, border: 'bg-[#0a0a3c]', text: 'text-[#0a0a3c]' },
    { label: 'Ongoing', value: stats?.ongoing, border: 'bg-[#7dcefb]', text: 'text-[#0a0a3c]' },
    { label: 'Completed', value: stats?.completed, border: 'bg-[#7d7dfb]', text: 'text-[#0a0a3c]' },
    { label: 'Failed Attempt', value: stats?.failed, border: 'bg-[#ff4d4f]' },
  ];

  return (
    <div className="mb-8 mt-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Delivery Analysis</div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectLabel>Today</SelectLabel>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        {statsArray.map((s) => (
          <div
            key={s.label}
            className="relative flex min-w-[220px] flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-white px-6 py-5 shadow-sm"
            style={{ boxShadow: '0 1px 2px #0001' }}
          >
            <div
              className={`absolute left-0 top-0 h-full w-2 rounded-l-2xl bg-gradient-to-b ${s.border}`}
            ></div>
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-[#222]">{s.label}</span>
              <ChevronRight className="ml-2 inline text-gray-400" />
            </div>
            <div className={`mt-4 text-2xl font-bold ${s.text || 'text-[#0a0a3c]'}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

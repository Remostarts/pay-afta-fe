'use client';

import React from 'react';

const stats = [
  { label: 'Pending Order', value: 0 },
  { label: 'In Progress', value: 0 },
  { label: 'Completed', value: 0 },
];

const DeliveryStats = () => (
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {stats.map((stat, idx) => (
      <div key={stat.label} className="flex flex-col gap-2 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {stat.label}
          <span className="text-xs">ⓘ</span>
        </div>
        <div className="text-3xl font-semibold">{stat.value.toString().padStart(2)}</div>
      </div>
    ))}
  </div>
);

export default DeliveryStats;

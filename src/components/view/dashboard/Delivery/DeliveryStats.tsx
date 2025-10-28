'use client';

import React from 'react';

const DeliveryStats = ({ stat }: any) => {
  const stats = [
    { label: 'Pending', value: stat?.pending ?? 0 },
    { label: 'In Progress', value: stat?.inProgress ?? 0 },
    { label: 'Completed', value: stat?.completed ?? 0 },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2 rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {item?.label}
            <span className="text-xs">ⓘ</span>
          </div>
          <div className="text-3xl font-semibold text-gray-800">
            {item?.value?.toString().padStart(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryStats;

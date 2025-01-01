'use client';

import { useState } from 'react';

import FilterDataSection from './FilterDataSection';

export default function Transactions() {
  const [selectedStatusType, setSelectedStatusType] = useState<string | null>(null);

  return (
    <div>
      <FilterDataSection setSelectedStatusType={setSelectedStatusType} />
    </div>
  );
}

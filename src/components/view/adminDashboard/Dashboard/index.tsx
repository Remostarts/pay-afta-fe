'use client';

import { useState } from 'react';

import AnalysisChart from './AnalysisChart';
import StatsSection from './StatsSection';
import TransactionsChart from './TransactionsChart';

export default function Dashboard() {
  const [selectedTransactionsDate, setSelectedTransactionsDate] = useState('');
  const [selectedAnalysisDate, setSelectedAnalysisDate] = useState('');

  console.log(selectedTransactionsDate);

  console.log(selectedAnalysisDate);

  return (
    <div>
      <StatsSection />
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <TransactionsChart changeDate={setSelectedTransactionsDate} />
        </div>
        <div>
          <AnalysisChart changeDate={setSelectedAnalysisDate} />
        </div>
      </div>
    </div>
  );
}

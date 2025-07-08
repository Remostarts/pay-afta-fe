import React from 'react';

import TopCards from './TopCards';
import DeliveryAnalysis from './DeliveryAnalysis';
import AwaitingConfirmation from './AwaitingConfirmation';

export default function Dashboard() {
  return (
    <section className="min-h-screen p-4 font-sans">
      <TopCards />
      <DeliveryAnalysis />
      <AwaitingConfirmation />
    </section>
  );
}

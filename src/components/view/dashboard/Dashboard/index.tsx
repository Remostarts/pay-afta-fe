'use client';

import { useState } from 'react';

import NewOrder from './NewOrder';
import RecentTrackLink from './RecentTrackLink';
import RecentTransactions from './RecentTransactions';
import StatsSection from './StatsSection';
import WalletServices from './WalletServices';

export default function Dashboard() {
  const [showNewOrder, setShowNewOrder] = useState<boolean>(false);

  if (showNewOrder) {
    return (
      <section>
        <div>
          <NewOrder onBack={() => setShowNewOrder(false)} />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="lg:m-4">
        <StatsSection />
      </div>
      <div className="lg:m-6">
        <WalletServices setShowNewOrder={setShowNewOrder} />
      </div>
      <div className="grid lg:m-6 lg:grid-cols-2 lg:gap-2">
        <RecentTrackLink />
        <RecentTransactions />
      </div>
    </section>
  );
}

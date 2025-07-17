'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import NewOrder from './NewOrder';
import RecentTrackLink from './RecentTrackLink';
import RecentTransactions from './RecentTransactions';
import StatsSection from './StatsSection';
import WalletServices from './WalletServices';

import { ReHeading } from '@/components/re-ui/ReHeading';

export default function Dashboard() {
  // const [showNewOrder, setShowNewOrder] = useState<boolean>(false);

  // if (showNewOrder) {
  //   return (
  //     <div className="min-h-full w-full">
  //       <NewOrder onBack={() => setShowNewOrder(false)} />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-full w-full">
      <div className="flex items-center justify-between lg:mx-4">
        <ReHeading heading="Dashboard" className="font-inter font-semibold text-[#333333]" />
        <Link
          href="/dashboard/new-order"
          className="flex items-center gap-1 rounded-md border-2 border-[#E6E6E6] bg-white p-4 font-inter font-medium text-[#333333]"
        >
          <Image
            alt="new order"
            src="assets/dashboard/Dashboard/newOrderIcon.svg"
            width={25}
            height={25}
          />
          New Order
        </Link>
      </div>
      <div className="lg:m-4">
        <StatsSection />
      </div>
      {/* <div className="lg:m-6">
        <WalletServices setShowNewOrder={setShowNewOrder} />
      </div> */}
      <div className="grid lg:m-6 lg:grid-cols-2 lg:gap-2">
        <RecentTrackLink />
        <RecentTransactions />
      </div>
    </div>
  );
}

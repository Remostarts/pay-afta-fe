import React from 'react';

const TopCards = () => (
  <div className="mb-8 flex flex-wrap gap-4">
    <div className="min-w-[220px] flex-1 rounded-xl bg-[#0a0a3c] p-6 text-white">
      <div className="text-sm opacity-80">
        Wallet Balance <span className="ml-1 text-xs">ⓘ</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="my-2 text-2xl font-bold">₦0.00</div>
        <button className="mt-2 rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-[#0a0a3c]">
          Withdraw
        </button>
      </div>
    </div>
    <div className="min-w-[220px] flex-1 rounded-xl bg-[#7d7dfb] p-6 text-white">
      <div className="text-sm opacity-80">Pending Payment</div>
      <div className="my-2 text-2xl font-bold">₦0.00</div>
    </div>
    <div className="min-w-[220px] flex-1 rounded-xl border border-gray-200 bg-white p-6 text-[#0a0a3c]">
      <div className="text-sm opacity-80">
        Earnings this week <span className="ml-1 text-xs">ⓘ</span>
      </div>
      <div className="my-2 text-2xl font-bold">₦0.00</div>
    </div>
  </div>
);

export default TopCards;

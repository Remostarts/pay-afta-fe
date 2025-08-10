'use client';

import Image from 'next/image';
import React from 'react';

const TopCards = () => (
  <div className="mt-5 grid gap-4 lg:grid-cols-3">
    {/* Wallet Balance Card */}

    <div className="relative ml-2 mt-2 overflow-hidden rounded-xl bg-[#03045B] p-8 shadow-lg">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-auto bg-repeat opacity-10"
          style={{
            backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 items-center justify-between sm:flex">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="font-inter text-sm text-[#FFFFFF]">Wallet Balance</p>
            {/* <div className="rounded-full bg-white/20 p-1">
                <div className="size-2 rounded-full bg-white"></div>
              </div> */}
          </div>
          <p className="font-inter text-2xl font-bold text-white">₦ 0.00</p>
        </div>
      </div>
    </div>

    {/* Pending Payment  */}

    <div className="relative ml-2 mt-2 overflow-hidden rounded-xl bg-[#6B6DFA] p-8 shadow-lg">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-auto bg-repeat opacity-10"
          style={{
            backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 items-center justify-between sm:flex">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="font-inter text-sm text-[#FFFFFF]">Pending Payment</p>
            {/* <div className="rounded-full bg-white/20 p-1">
                <div className="size-2 rounded-full bg-white"></div>
              </div> */}
          </div>
          <p className="font-inter text-2xl font-bold text-white">₦ 0.00</p>
        </div>
      </div>
    </div>

    {/* Earnings this week  */}
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-[#1A1A1A]">
      <div className="text-sm opacity-80">
        Earnings this week <span className="ml-1 text-xs">ⓘ</span>
      </div>
      <div className="my-2 text-2xl font-bold">₦0.00</div>
    </div>
  </div>
);

export default TopCards;

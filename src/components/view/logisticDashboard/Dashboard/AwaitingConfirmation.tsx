import React from 'react';
import Link from 'next/link';

const orders = [1, 2, 3].map((id) => ({
  id: `D 01`,
  amount: '₦2,000',
  pickup: '11856 E Washington Street, Olathe 91763',
  date: '23/7/2024',
  destination: '11856 E Washington Street, Olathe 91763',
}));

const AwaitingConfirmation = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-1 text-lg font-semibold">Awaiting Confirmation</div>
      <Link href="" className="text-sm font-medium text-[#0a0a3c]">
        VIEW ALL
      </Link>
    </div>
    <div className="flex flex-wrap gap-4">
      {orders.map((order, idx) => (
        <div
          key={idx}
          className="mb-3 flex min-w-[260px] flex-1 flex-col justify-between rounded-lg bg-[#F9F9F9] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="mb-1 text-sm font-semibold text-[#7d7dfb]">Order ID {order.id}</div>
            <div className="mb-2 text-lg font-bold text-[#0a0a3c]">{order.amount}</div>
          </div>
          <div className="mb-1 text-sm">
            <b>Pickup:</b> {order.pickup}
          </div>
          <div className="mb-1 text-xs text-gray-500">{order.date}</div>
          <div className="mb-3 text-sm">
            <b>Destination:</b> {order.destination}
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-full border border-[#03045B] bg-white py-3 font-semibold text-[#03045B]">
              Reject
            </button>
            <button className="flex-1 rounded-full bg-[#03045B] py-3 font-semibold text-white">
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AwaitingConfirmation;

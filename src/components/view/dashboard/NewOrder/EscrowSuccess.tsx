'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EscrowSuccessProps {
  orderId: string;
  amount: string;
  trackUrl: string;
  buyerName?: string;
}

const EscrowSuccess: React.FC<EscrowSuccessProps> = ({
  orderId = '1234567',
  amount = '₦301,050.00',
  trackUrl = 'www.getpayafta.com/track/ord-123456ABC',
  buyerName = 'John Doe',
}) => {
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex justify-center bg-white py-12 px-4">
      <div className="w-full max-w-lg flex flex-col items-center text-center">
        {/* Animated Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
            <Image
              src="/assets/dashboard/Dashboard/payment-checked.svg"
              alt="Payment successful icon"
              width={110}
              height={110}
              className="relative z-10 drop-shadow-md"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-semibold mt-6">
          Escrow Order Created Successfully
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Your escrow order with {buyerName} has been created.
        </p>

        {/* Order Details */}
        <div className="w-full mt-8 space-y-4">
          <DetailRow label="Order ID" value={orderId} />
          <DetailRow label="Amount" value={amount} />
        </div>

        {/* Tracking URL Box */}
        <div className="w-full mt-6 flex items-center bg-blue-50 border border-blue-100 rounded-lg overflow-hidden">
          <div className="flex-1 px-3 py-3 text-left text-sm text-gray-700 truncate">
            {trackUrl}
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-10">
          <button className="w-full py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
            View Order
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-full bg-black text-white font-medium hover:bg-gray-900"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowSuccess;

/* ----------------- Sub Component ----------------- */

interface RowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<RowProps> = ({ label, value }) => (
  <div className="flex justify-between text-sm sm:text-base">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

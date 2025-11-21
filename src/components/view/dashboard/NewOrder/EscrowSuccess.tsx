'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';

interface EscrowSuccessProps {
  orderId: string;
  transactionType: string;
  amount: string;
  trackUrl: string;
  buyerName?: string;
  onViewOrder?: () => void;
}

export default function EscrowSuccess({
  orderId,
  transactionType,
  amount,
  trackUrl,
  buyerName = 'the counterparty',
  onViewOrder,
}: EscrowSuccessProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  console.log('Transaction type', transactionType);

  const handleViewOrder = () => {
    router.push(`track-links/${transactionType}/${orderId}`);
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full flex justify-center bg-white py-12 px-4">
      <div className="w-full max-w-lg flex flex-col items-center text-center">
        {/* Success Icon with Animation */}
        <div className="flex items-center justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75" />
            <Image
              src="/assets/dashboard/Dashboard/payment-checked.svg"
              alt="Payment successful"
              width={110}
              height={110}
              className="relative z-10 drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-semibold mt-6 text-gray-900">
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

        {/* Tracking URL */}
        <div className="w-full mt-6">
          <label className="block text-left text-sm font-medium text-gray-700 mb-2">
            Tracking URL
          </label>
          <div className="flex items-center bg-blue-50 border border-blue-100 rounded-lg overflow-hidden">
            <div className="flex-1 px-3 py-3 text-left text-sm text-gray-700 truncate">
              {trackUrl}
            </div>
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm transition-colors flex items-center gap-2"
              aria-label={copied ? 'Copied' : 'Copy tracking URL'}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={handleViewOrder}
            className="w-full py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            View Order
          </button>

          <button
            onClick={handleReturnToDashboard}
            className="w-full py-3 rounded-full bg-black text-white font-medium hover:bg-gray-900 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* Detail Row Component */
interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between items-center text-sm sm:text-base py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

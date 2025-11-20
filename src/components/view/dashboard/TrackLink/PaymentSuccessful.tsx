'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface PaymentSuccessfulProps {
  label?: string;
  amount?: number;
  bankName?: string;
  onComplete?: () => void;
}

export default function PaymentSuccessful({
  label = 'Transfer Successful',
  amount,
  bankName,
  onComplete,
}: PaymentSuccessfulProps) {
  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getMessage = () => {
    switch (label) {
      case 'Withdrawal Successful':
      case 'Transfer Successful':
        return `You sent ₦${amount?.toLocaleString() ?? 0} to ${bankName || 'recipient'}.`;
      case 'Agreement Accepted':
        return 'Proceed to the next stage of the transaction.';
      case 'Payment Successful':
        return `Your payment of ₦${amount?.toLocaleString() ?? 0} has been successfully secured in escrow, ensuring a safe and smooth transaction process.`;
      default:
        return 'Transaction completed successfully.';
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 transition-transform duration-500 hover:scale-[1.02]">
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

        {/* Title */}
        <h2 className="mb-3 text-center font-inter text-2xl font-bold text-gray-800 animate-fade-in">
          {label}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 leading-relaxed animate-fade-in delay-100">
          {getMessage()}
        </p>
      </div>
    </section>
  );
}

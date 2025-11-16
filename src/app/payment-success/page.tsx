'use client';

import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
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

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>

        <p className="text-gray-600 mb-8">
          Your payment has been processed successfully. You'll receive a confirmation email shortly.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-[#03045B] text-white py-3 px-6 rounded-lg font-medium inline-block hover:bg-blue-900 transition-colors"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.print()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

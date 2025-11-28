'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  // Get query parameters
  const urlParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const orderId = urlParams.get('orderId');
  const status = urlParams.get('status') || 'success';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <CheckCircle size={16} className="mr-2" />
            Payment Confirmed
          </div>
        );
      case 'processing':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            <CheckCircle size={16} className="mr-2" />
            Processing
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <CheckCircle size={16} className="mr-2" />
            Completed
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-30"></div>
              <div className="relative bg-white rounded-full p-4">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your payment has been processed successfully.</p>
          <div className="mt-4 flex justify-center">{getStatusBadge()}</div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Summary</h2>

            <div className="space-y-4">
              {/* Order ID */}
              {orderId && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <span className="text-sm font-medium text-gray-900">{orderId}</span>
                </div>
              )}

              {/* Payment Date */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Payment Date</span>
                <span className="text-sm text-gray-900">{getCurrentDate()}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <p className="text-sm text-blue-800">
              Your payment is being processed. The funds will be held in escrow until delivery is
              confirmed. You'll be notified of any updates.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium inline-block text-center hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium inline-block text-center hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>

              <button
                onClick={() => window.print()}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

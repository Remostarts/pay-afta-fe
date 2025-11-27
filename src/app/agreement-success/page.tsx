'use client';

import React from 'react';
import { CheckCircle, ArrowLeft, Calendar, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface OrderData {
  id: string;
  orderId: string;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  orderValue: number;
  createdAt: string;
  agreedAt?: string;
}

export default function AgreementSuccessPage() {
  const searchParams = useSearchParams();

  // Parse orderData from search params
  const orderDataStr = searchParams.get('orderData');
  const orderData: OrderData | null = orderDataStr
    ? JSON.parse(decodeURIComponent(orderDataStr))
    : null;

  // Parse other params
  const userRole = (searchParams.get('userRole') as 'buyer' | 'seller') || 'buyer';
  const isGuest = searchParams.get('isGuest') === 'true';
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">No order data available.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNextActionUrl = () => {
    if (userRole === 'buyer') {
      return `/finalize-payment?orderId=${orderData?.orderId || ''}`;
    }
    return `/dashboard/orders?status=agreed`;
  };

  const getNextActionText = () => {
    if (userRole === 'buyer') {
      return 'Proceed to Payment';
    }
    return 'View Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden">
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

          <h1 className="text-2xl font-bold mb-2">Agreement Successful!</h1>
          <p className="text-green-100">
            {userRole === 'seller'
              ? 'The buyer has agreed to your terms'
              : "You have agreed to the seller's terms"}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="text-sm font-medium text-gray-900">{orderData.orderId}</span>
              </div>

              {/* Order Value */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Order Value</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(orderData.orderValue)}
                </span>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} />
                  Created
                </span>
                <span className="text-sm text-gray-900">{formatDate(orderData.createdAt)}</span>
              </div>

              {/* Agreed Date */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Agreement Completed
                </span>
                <span className="text-sm text-gray-900">
                  {orderData.agreedAt ? formatDate(orderData.agreedAt) : 'Recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Counterparty */}
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                {userRole === 'seller' ? 'Buyer' : 'Seller'}
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {userRole === 'seller' ? orderData.buyer.name : orderData.seller.name}
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Mail size={12} />
                {userRole === 'seller' ? orderData.buyer.email : orderData.seller.email}
              </p>
            </div>

            {/* Current User */}
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">You</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {userRole === 'seller' ? orderData.seller.name : orderData.buyer.name}
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Mail size={12} />
                {userRole === 'seller' ? orderData.seller.email : orderData.buyer.email}
              </p>
            </div>
          </div>

          {/* Guest Notice */}
          {isGuest && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-orange-900 mb-2">Guest Account Notice</h4>
              <p className="text-sm text-orange-800">
                You're using a guest account. To track this order and receive updates, consider
                creating a PayAfta account.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <p className="text-sm text-blue-800">
              {userRole === 'seller'
                ? "The buyer will now proceed to make payment. You'll be notified once the payment is completed. The order funds will be held in escrow until delivery is confirmed."
                : 'You can now proceed to make payment for this order. Once payment is confirmed, the funds will be held in escrow until delivery is confirmed.'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {userRole === 'buyer' && (
              <Link
                href={getNextActionUrl()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium inline-block text-center hover:bg-blue-700 transition-colors"
              >
                {getNextActionText()}
              </Link>
            )}

            <div className="flex gap-3">
              <Link
                href={userRole === 'seller' ? '/dashboard' : '/'}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium inline-block text-center hover:bg-gray-50 transition-colors"
              >
                {userRole === 'seller' ? 'Go to Dashboard' : 'Home'}
              </Link>

              <button
                onClick={() => window.print()}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Print Receipt
              </button>
            </div>

            {isGuest && (
              <Link
                href="/auth/signup"
                className="block w-full text-center text-blue-600 text-sm hover:underline py-2"
              >
                Create PayAfta Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

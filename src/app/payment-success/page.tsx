'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, Calendar, User, Mail, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { orderAPI, OrderData } from '@/lib/actions/order/order-api-functions';
import { getAuthContext } from '@/lib/utils/guest-auth-utils';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authContext, setAuthContext] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    } else {
      setError('Order ID not provided');
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);

      const auth = await getAuthContext(searchParams);
      setAuthContext(auth);

      if (!auth.isAuthenticated) {
        throw new Error('Authentication required');
      }

      if (orderId) {
        const order = await orderAPI.getOrderById(orderId);
        setOrderData(order);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load order data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Payment</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadOrderData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600">No payment data available.</p>
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
    if (authContext?.isGuest) {
      return `/dashboard?guest=true`;
    }
    return '/dashboard';
  };

  const getNextActionText = () => {
    if (authContext?.isGuest) {
      return 'Continue to Dashboard';
    }
    return 'Go to Dashboard';
  };

  const getStatusBadge = () => {
    switch (orderData.status) {
      case 'paid':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <CheckCircle size={16} className="mr-2" />
            Payment Confirmed
          </div>
        );
      case 'finalized':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <CheckCircle size={16} className="mr-2" />
            Order Completed
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            <CheckCircle size={16} className="mr-2" />
            Processing
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

          <h1 className="text-2xl font-bold mb-2">
            {orderData.status === 'finalized' ? 'Order Completed!' : 'Payment Successful!'}
          </h1>
          <p className="text-green-100">
            {orderData.status === 'finalized'
              ? 'Your order has been successfully completed.'
              : 'Your payment has been processed successfully.'}
          </p>
          <div className="mt-4 flex justify-center">{getStatusBadge()}</div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Payment Summary
            </h2>

            <div className="space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="text-sm font-medium text-gray-900">{orderData.orderId}</span>
              </div>

              {/* Amount Paid */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(orderData.orderValue)}
                </span>
              </div>

              {/* Payment Date */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} />
                  Payment Date
                </span>
                <span className="text-sm text-gray-900">{formatDate(orderData.updatedAt)}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Parties */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Seller */}
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Seller</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">{orderData.seller.name}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Mail size={12} />
                {orderData.seller.email}
              </p>
            </div>

            {/* Buyer */}
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Buyer</p>
              <p className="text-sm font-semibold text-gray-900 mb-1">{orderData.buyer.name}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Mail size={12} />
                {orderData.buyer.email}
              </p>
            </div>
          </div>

          {/* Guest Notice */}
          {authContext?.isGuest && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-orange-900 mb-2">Guest Account Notice</h4>
              <p className="text-sm text-orange-800">
                You're using a guest account. To track this order and receive future updates,
                consider creating a PayAfta account.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <p className="text-sm text-blue-800">
              {orderData.status === 'finalized'
                ? "The order has been completed successfully. You'll receive a confirmation email shortly."
                : "Your payment is being processed. The funds will be held in escrow until delivery is confirmed. You'll be notified of any updates."}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={getNextActionUrl()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium inline-block text-center hover:bg-blue-700 transition-colors"
            >
              {getNextActionText()}
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

            {authContext?.isGuest && (
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

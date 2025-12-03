'use client';
import React from 'react';
import { BuyerActions } from './BuyerActions';
import { SellerActions } from './SellerActions';
import InvoiceOrderDetails from './InvoiceOrderDetails';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';

interface InvoicePreviewProps {
  orderId: string;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ orderId }) => {
  const { order, loading, error, viewer, userRole } = useOrder(orderId);

  console.log(order);

  // console.log(userRole);

  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Viewer Badge */}
        <div className="mb-4 flex justify-end">
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Viewing as: {userRole.replace('_', ' ')}
          </div>
        </div>
        <InvoiceOrderDetails order={order} userRole={userRole} />

        {/* Buyer Actions */}
        <BuyerActions orderId={orderId} />

        {/* Seller Actions */}
        <SellerActions orderId={orderId} />
      </div>
    </div>
  );
};

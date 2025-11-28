'use client';

import React from 'react';
import { OrderDetails } from '@/types/order';
import { UserRole } from './TransactionsSummaryBase';

interface OrderShippingProps {
  userRole: UserRole;
  order: OrderDetails | null;
}

export default function OrderShipping({ userRole, order }: OrderShippingProps) {
  // Buyer-friendly message
  const isBuyer = userRole === 'buyer';
  const trackingNumber = order?.delivery?.trackingNumber;
  // const orderId = order?.id;
  // console.log(order?.id);

  return (
    <section>
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">Shipping Details</h1>
          {isBuyer ? (
            <p className="font-inter text-gray-600">
              Great news! Your order is on the way. You can track it in real-time{' '}
              {trackingNumber ? (
                <a
                  href={`/tracking/order/${trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  here
                </a>
              ) : (
                'once the tracking number is available'
              )}
              .
            </p>
          ) : (
            <p className="font-inter text-gray-600">
              Track the shipping status of this order handled by your logistic partner.
            </p>
          )}
        </div>

        <div className="space-y-2 font-inter">
          {order?.delivery ? (
            <>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Tracking Number:</span>{' '}
                {trackingNumber || 'Not assigned'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Status:</span> {order.delivery.status ?? 'Pending'}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">Logistic partner not yet assigned.</p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500 font-inter">
            *Shipping updates are automatically synchronized from the logistic partner system.
          </p>
        </div>
      </div>
    </section>
  );
}

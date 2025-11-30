'use client';

import React, { useState } from 'react';
import { OrderDetails } from '@/types/order';
import { UserRole } from './TransactionsSummaryBase';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { toast } from 'sonner';
import { ReButton } from '@/components/re-ui/ReButton';

interface OrderShippedProps {
  userRole: UserRole;
  order: OrderDetails | null;
  userId: string;
}

export default function OrderShipped({ userRole, order, userId }: OrderShippedProps) {
  const isBuyer = userRole === 'buyer';
  const trackingNumber = order?.delivery?.trackingNumber;

  const [loading, setLoading] = useState(false);

  const handleConfirmShipping = async () => {
    if (!order) return;

    try {
      setLoading(true);
      const res = await updateOrderProgress(
        {
          status: 'SHIPPED',
          step: 3,
          notes: 'Seller shipped the order.',
          userId,
        } as UpdateOrderProgressDTO,
        order.id
      );
      if (res.success) {
        toast.success('Shipping confirmed!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to confirm shipping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">Shipping Details</h1>

          {isBuyer ? (
            <p className="font-inter text-gray-600">
              {order?.delivery ? (
                <>
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
                </>
              ) : (
                'Great news! Seller has shipped your order. They can deliver it soon. Thank you for choosing us.'
              )}
            </p>
          ) : (
            <>
              <p className="font-inter text-gray-600">
                {order?.delivery
                  ? 'Track the shipping status of this order.'
                  : 'No logistic partner assigned. You can ship this order yourself.'}
              </p>

              {!order?.delivery && (
                <ReButton
                  disabled={loading}
                  className="w-2/5 rounded-full"
                  onClick={handleConfirmShipping}
                >
                  {loading ? 'Processing...' : 'Confirm Shipping'}
                </ReButton>
              )}
            </>
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
                <span className="font-semibold">Status:</span> {order.status ?? 'Pending'}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              {!isBuyer && 'You can ship this order yourself.'}
            </p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500 font-inter">
            {order?.delivery
              ? '*Shipping updates are automatically synchronized from the logistic partner system.'
              : '*Shipping updates will be available once you confirm shipping.'}
          </p>
        </div>
      </div>
    </section>
  );
}

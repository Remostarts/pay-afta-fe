'use client';

import React, { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';
import { UserRole } from './TransactionsSummaryForProduct';
import { toast } from 'sonner';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import { OrderDetails } from '@/types/order';

interface ConfirmShippingProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
  showActions?: boolean;
  userRole: UserRole;
  order: OrderDetails | null;
  loadOrder: () => void; // passed from parent
}

export default function ConfirmShipping({
  handleCurrentStepChange,
  currentStepChange,
  showActions = false,
  userRole,
  order,
  loadOrder,
}: ConfirmShippingProps) {
  const [loading, setLoading] = useState(false);

  // const handleConfirmShipping = async () => {
  //   if (!order) return;
  //   setLoading(true);
  //   try {
  //     const response = await updateOrderProgress(
  //       {
  //         step: 3,
  //         status: 'SHIPPING',
  //         notes: 'Seller confirmed shipping',
  //       },
  //       order.id
  //     );

  //     if (response?.success) {
  //       toast.success('Shipping confirmed!');
  //       handleCurrentStepChange(currentStepChange + 1);
  //     } else {
  //       toast.error(response?.error || 'Failed to confirm shipping');
  //     }
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : 'Failed to confirm shipping');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!showActions) {
    return (
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-[#eeeeee] p-5">
        <h2 className="mb-2 text-lg font-medium font-inter">On the way</h2>
        <p className="text-sm text-gray-600 font-inter">Your product/service is now on its way.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">Shipping Details</h1>
          <p className="font-inter text-gray-600">
            Track the shipping status of this order handled by your logistic partner.
          </p>
        </div>

        {/* Seller shipping info */}
        {order?.delivery ? (
          <div className="space-y-2 font-inter">
            {order.delivery.trackingNumber ? (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Tracking Number:</span>{' '}
                {order.delivery.trackingNumber}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Shipment pending pickup by logistic partner.</p>
            )}

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Status:</span> {order.delivery.status ?? 'Pending'}
            </p>
          </div>
        ) : (
          <div className="font-inter text-sm text-gray-600">
            ❌ Logistic partner not yet assigned.
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs text-gray-500 font-inter">
            *Shipping updates are automatically synchronized from the logistic partner system.
          </p>
        </div>
      </div>
    </section>
  );
}

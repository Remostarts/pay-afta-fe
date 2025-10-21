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

  const handleConfirmShipping = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const response = await updateOrderProgress(
        {
          step: 3,
          status: 'SHIPPING',
          notes: 'Seller confirmed shipping',
        },
        order.id
      );

      if (response?.success) {
        toast.success('Shipping confirmed!');
        handleCurrentStepChange(currentStepChange + 1);
      } else {
        toast.error(response?.error || 'Failed to confirm shipping');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to confirm shipping');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="font-inter text-xl font-bold text-gray-800">Confirm Shipping</h1>
          <p className="font-inter text-gray-600">
            Verify shipment of the requested product/service.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ReButton
            className="w-2/5 rounded-full"
            onClick={handleConfirmShipping}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </ReButton>
        </div>
      </div>
    </section>
  );
}

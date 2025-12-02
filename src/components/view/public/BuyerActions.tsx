'use client';

import React, { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';
import { useOrder } from './useOrderHook';
import { useRouter } from 'next/navigation';

interface BuyerActionsProps {
  orderId: string;
}

export const BuyerActions: React.FC<BuyerActionsProps> = ({ orderId }) => {
  const { order, userRole, performAction } = useOrder(orderId);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const router = useRouter();

  if (userRole !== 'REAL_BUYER' && userRole !== 'GUEST_BUYER') return null;
  if (!order) return null;

  const handleAction = async (action: 'ACCEPT' | 'REJECT') => {
    if (submittingAction) return;
    setSubmittingAction(action);
    try {
      await performAction(action);
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleMakePayment = () => {
    if (userRole === 'REAL_BUYER') router.push(`/finalize-payment?orderId=${order.id}`);
    else if (userRole === 'GUEST_BUYER') router.push(`/finalize-payment?orderId=${order.id}`);
  };

  // Determine if buyer can act
  const canAct = !order.buyerAgreed && !['CANCELED', 'REJECTED'].includes(order.status);

  // Determine if buyer needs to make payment
  const needsPayment =
    order.buyerAgreed && (!order.Payment || order.Payment.status !== 'COMPLETED');

  return (
    <div className="flex gap-2 mt-4">
      {canAct && (
        <>
          <ReButton onClick={() => handleAction('ACCEPT')} disabled={submittingAction !== null}>
            {submittingAction === 'ACCEPT' ? 'Submitting...' : 'Accept'}
          </ReButton>
          <ReButton
            variant="destructive"
            onClick={() => handleAction('REJECT')}
            disabled={submittingAction !== null}
          >
            {submittingAction === 'REJECT' ? 'Submitting...' : 'Reject'}
          </ReButton>
        </>
      )}

      {needsPayment && <ReButton onClick={handleMakePayment}>Make Payment</ReButton>}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';
import { useOrder } from './useOrderHook';

interface SellerActionsProps {
  orderId: string;
}

export const SellerActions: React.FC<SellerActionsProps> = ({ orderId }) => {
  const { order, userRole, performAction } = useOrder(orderId);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  if (userRole !== 'REAL_SELLER' && userRole !== 'GUEST_SELLER') return null;
  if (!order) return null;

  const handleAction = async (action: 'ACCEPT' | 'REJECT' | 'SHIP' | 'DELIVER') => {
    if (submittingAction) return;
    setSubmittingAction(action);
    try {
      await performAction(action);
    } finally {
      setSubmittingAction(null);
    }
  };

  const canAct = !order.sellerAgreed && !['CANCELED', 'REJECTED'].includes(order.status);

  return (
    <div className="flex gap-2 mt-4">
      {canAct ? (
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
      ) : order.sellerAgreed ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          You have already agreed to this order. No further action is required.
        </div>
      ) : ['CANCELED', 'REJECTED'].includes(order.status) ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          Action cannot be performed. Order is {order.status.toLowerCase()}.
        </div>
      ) : null}
      {/* 
        {order.buyerAgreed && !order.currentStep && (
            <ReButton onClick={() => handleAction('SHIP')} disabled={submittingAction !== null}>
            {submittingAction === 'SHIP' ? 'Submitting...' : 'Ship'}
            </ReButton>
        )} */}

      {/* {order.currentStep === 1 && (
            <ReButton onClick={() => handleAction('DELIVER')} disabled={submittingAction !== null}>
            {submittingAction === 'DELIVER' ? 'Submitting...' : 'Mark Delivered'}
            </ReButton>
        )} */}
    </div>
  );
};

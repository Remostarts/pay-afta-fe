'use client';

import React, { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';
import RejectOrderModal from '@/components/view/dashboard/TrackLink/RejectOrderModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useOrder } from '@/hooks/useOrder';

interface SellerActionsProps {
  orderId: string;
}

export const SellerActions: React.FC<SellerActionsProps> = ({ orderId }) => {
  const { order, userRole, performAction, refreshOrder } = useOrder(orderId);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (userRole !== 'REAL_SELLER' && userRole !== 'GUEST_SELLER') return null;
  if (!order) return null;

  const handleAction = async (action: 'ACCEPT' | 'REJECT' | 'SHIP' | 'DELIVER') => {
    if (submittingAction) return;

    // For reject action, open the modal instead of directly performing the action
    if (action === 'REJECT') {
      setShowRejectModal(true);
      return;
    }

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

      {/* Reject Order Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {order && (
            <RejectOrderModal
              orderId={order.id || ''}
              onClose={() => setShowRejectModal(false)}
              onSuccess={() => {
                refreshOrder();
                setShowRejectModal(false);
              }}
              orderDetails={
                order
                  ? {
                      orderNumber: order.id,
                      transactionType: order.transactionType,
                      amount: order.amount.toString(),
                    }
                  : undefined
              }
              userRole="seller"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

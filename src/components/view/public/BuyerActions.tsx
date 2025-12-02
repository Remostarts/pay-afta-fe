'use client';

import React, { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';
import { useOrder } from './useOrderHook';
import { useRouter } from 'next/navigation';
import RejectOrderModal from '@/components/view/dashboard/TrackLink/RejectOrderModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface BuyerActionsProps {
  orderId: string;
}

export const BuyerActions: React.FC<BuyerActionsProps> = ({ orderId }) => {
  const { order, userRole, performAction, refreshOrder } = useOrder(orderId);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const router = useRouter();

  if (userRole !== 'REAL_BUYER' && userRole !== 'GUEST_BUYER') return null;
  if (!order) return null;

  const handleAction = async (action: 'ACCEPT' | 'REJECT') => {
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

  const handleMakePayment = () => {
    if (userRole === 'REAL_BUYER') router.push(`/finalize-payment?orderId=${order.id}`);
    else if (userRole === 'GUEST_BUYER') router.push(`/finalize-payment?orderId=${order.id}`);
  };

  // Determine if buyer can act
  const canAct = !order.buyerAgreed && !['CANCELED', 'REJECTED'].includes(order.status);

  // Determine if buyer needs to make payment (both parties must agree)
  const needsPayment =
    order.buyerAgreed &&
    order.sellerAgreed &&
    (!order.Payment || order.Payment.status !== 'COMPLETED');

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
            {submittingAction === 'CANCEL' ? 'Submitting...' : 'Cancel'}
          </ReButton>
        </>
      )}

      {/* Show note if buyer has agreed but seller hasn't yet */}
      {order.buyerAgreed && !order.sellerAgreed && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>
            You have accepted the agreement. Please wait for the seller to also accept before you
            can make the payment.
          </span>
        </div>
      )}

      {needsPayment && <ReButton onClick={handleMakePayment}>Make Payment</ReButton>}

      {/* Reject/Cancel Order Modal */}
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
              userRole="buyer"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

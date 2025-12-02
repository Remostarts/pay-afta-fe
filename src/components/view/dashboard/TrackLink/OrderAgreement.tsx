'use client';

import React, { useState } from 'react';
import { Download, Loader2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderDetails, UserProfile } from '@/types/order';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import PaymentSuccessful from './PaymentSuccessful';
import EditOrderModal from './EditOrderModal';
import RejectOrderModal from './RejectOrderModal';
import {
  GeneratePendingAgreementPdf,
  GenerateSignedAgreementPdf,
} from '@/helpers/utils/pdfCreation';
import { UserRole } from './TransactionsSummaryBase';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
  showActions?: boolean;
  userRole: UserRole;
  order: OrderDetails | null;
  loadOrder?: () => Promise<void>;
  userId: string;
}

// Helper function to get user display name
const getUserDisplayName = (user: UserProfile | undefined): string => {
  if (!user || (!user.firstName && !user.lastName)) {
    return 'Guest User';
  }
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest User';
};

export default function OrderAgreement({
  handleCurrentStepChange,
  currentStepChange,
  showActions = false,
  userRole,
  order,
  loadOrder,
  userId,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Use the direct boolean fields from order
  const buyerHasConfirmed = order?.buyerAgreed || false;
  const sellerHasConfirmed = order?.sellerAgreed || false;
  const bothPartiesConfirmed = buyerHasConfirmed && sellerHasConfirmed;
  const currentUserHasConfirmed = userRole === 'buyer' ? buyerHasConfirmed : sellerHasConfirmed;

  // Check if user can accept agreement (hasn't accepted yet)
  const canAcceptAgreement = !currentUserHasConfirmed;

  // Get display names
  const buyerName = getUserDisplayName(order?.buyer);
  const sellerName = getUserDisplayName(order?.seller);

  console.log(order);
  console.log(userRole);

  const handleAcceptOrder = () => {
    if (!isAgreed) return;
    setIsOpen(true);
  };

  const handleConfirmTransaction = async () => {
    setIsLoading(true);
    try {
      // Determine the correct status based on user role
      const agreementStatus = userRole === 'buyer' ? 'BUYER_AGREED' : 'SELLER_AGREED';

      const response = await updateOrderProgress(
        {
          status: agreementStatus,
          step: 1,
          notes: 'Agreement signed',
          userId,
        } as UpdateOrderProgressDTO,
        order?.id as string
      );

      if (response?.success) {
        toast.success('Order agreement accepted successfully!');
        if (loadOrder) await loadOrder();

        setTimeout(() => setIsOpen(false), 500);
      } else {
        toast.error(response?.error || 'Failed to update order progress history');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update order progress history'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectModalSuccess = () => {
    if (loadOrder) {
      loadOrder();
    }
    handleCurrentStepChange(currentStepChange - 1);
  };

  const handleDownload = (version: 'pending' | 'signed') => {
    if (!order) {
      toast.error('Unable to generate agreement – order not found.');
      return;
    }

    try {
      if (version === 'pending') {
        GeneratePendingAgreementPdf(order);
      } else if (version === 'signed') {
        GenerateSignedAgreementPdf(order);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate agreement PDF.');
    }
  };

  const canRejectOrder = (order: OrderDetails | null): boolean => {
    if (!order) return false;
    const nonRejectableStatuses = ['SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELED'];

    return !nonRejectableStatuses.includes(order.status);
  };

  // Confirmation Status Component (reusable for both buyer and seller)
  const ConfirmationStatus = () => (
    <div className="mb-6 p-4 bg-white rounded-lg border">
      <h3 className="font-inter text-sm font-medium mb-3">Confirmation Status:</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Buyer: {buyerName}</span>
          <span
            className={`text-sm font-medium ${buyerHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
          >
            {buyerHasConfirmed ? '✓ Confirmed' : '⏳ Pending'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Seller: {sellerName}</span>
          <span
            className={`text-sm font-medium ${sellerHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
          >
            {sellerHasConfirmed ? '✓ Confirmed' : '⏳ Pending'}
          </span>
        </div>
      </div>

      {!bothPartiesConfirmed && (
        <p className="mt-3 text-xs text-gray-500">
          {currentUserHasConfirmed
            ? '✅ You have confirmed. Waiting for the other party to confirm the agreement before proceeding to payment.'
            : 'Please confirm the agreement to proceed.'}
        </p>
      )}

      {bothPartiesConfirmed && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>✓ Both parties
            have confirmed! Advancing to payment step...
          </p>
        </div>
      )}
    </div>
  );

  // Main content rendering
  let mainContent = null;

  if (
    order?.status === 'PENDING' ||
    order?.status === 'BUYER_AGREED' ||
    order?.status === 'SELLER_AGREED'
  ) {
    mainContent = (
      <section className="mt-5 rounded-xl border-2 border-gray-200 bg-[#E6E6E6] p-5">
        <div className="mb-5">
          <h1 className="mb-4 font-inter text-2xl font-semibold text-gray-900">Escrow Agreement</h1>
          <p className="font-inter mb-6 leading-relaxed text-gray-600">
            This agreement confirms that the buyer, {buyerName}, has created an escrow transaction
            for {order?.transactionType}. This transaction is governed by an escrow agreement
            automatically generated by PayAfta based on the details provided by both parties. Please
            review the agreement carefully before proceeding.
          </p>
        </div>

        <button
          onClick={() => handleDownload(currentUserHasConfirmed ? 'signed' : 'pending')}
          className="mb-8 flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Escrow Agreement (PDF)
        </button>

        {/* Show Edit button only for buyer when order is PENDING */}
        {userRole === 'buyer' && order?.status === 'PENDING' && (
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="mb-8 flex items-center gap-2 text-orange-600 transition-colors hover:text-orange-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Order
          </button>
        )}

        <div className="mb-8 flex items-start gap-3">
          <Checkbox
            id="agreement"
            checked={currentUserHasConfirmed ? true : isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            className="mt-1"
            disabled={currentUserHasConfirmed}
          />
          <label
            htmlFor="agreement"
            className="cursor-pointer text-sm leading-relaxed text-gray-700"
          >
            I have read and agree to the Escrow Agreement. I understand that proceeding confirms my
            acceptance of the terms stated within.
          </label>
        </div>

        <ConfirmationStatus />

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <ReButton
                className={`w-full sm:w-2/5 rounded-full ${
                  isAgreed && canAcceptAgreement
                    ? 'bg-[#03045B] hover:bg-[#03045B] text-white transition-all'
                    : 'cursor-not-allowed bg-gray-300 text-gray-600'
                }`}
                onClick={handleAcceptOrder}
                disabled={!isAgreed || !canAcceptAgreement}
              >
                {currentUserHasConfirmed ? 'Agreement Accepted' : 'Accept Order'}
              </ReButton>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agreement Accepted</DialogTitle>
              </DialogHeader>

              <PaymentSuccessful label="Agreement Accepted" />

              <DialogFooter>
                <ReButton
                  onClick={handleConfirmTransaction}
                  disabled={isLoading}
                  className={`rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
                    isLoading
                      ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                      : 'bg-[#03045B] hover:bg-[#03045B] text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Done'
                  )}
                </ReButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ReButton
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={!canRejectOrder(order) || currentUserHasConfirmed}
            className={`w-full sm:w-2/5 rounded-full border-2 border-[#03045B] transition-all duration-300 ${
              canRejectOrder(order) && !currentUserHasConfirmed
                ? 'bg-white text-[#03045B] hover:bg-gray-50'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            {!canRejectOrder(order)
              ? userRole === 'buyer'
                ? 'Cannot Cancel Order'
                : 'Cannot Reject'
              : userRole === 'buyer'
                ? 'Cancel Order'
                : 'Reject Order'}
          </ReButton>
        </div>
      </section>
    );
  }

  return (
    <>
      {mainContent}

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {order && (
            <EditOrderModal
              order={order}
              onClose={() => setIsEditDialogOpen(false)}
              onSuccess={loadOrder || (() => {})}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {order && (
            <RejectOrderModal
              orderId={order?.id || ''}
              onClose={() => setIsRejectDialogOpen(false)}
              onSuccess={handleRejectModalSuccess}
              orderDetails={
                order
                  ? {
                      orderNumber: order.id,
                      transactionType: order.transactionType,
                      amount: order.amount.toString(),
                    }
                  : undefined
              }
              userRole={userRole}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

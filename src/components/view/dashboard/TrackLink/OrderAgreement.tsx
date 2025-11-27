'use client';

import React, { useState } from 'react';
import { Download, Loader2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGeneral } from '@/context/generalProvider';

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
import { UserRole } from './TransactionsSummaryForProduct';
import { OrderDetails } from '@/types/order';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import PaymentSuccessful from './PaymentSuccessful';
import EditOrderModal from './EditOrderModal';
import RejectOrderModal from './RejectOrderModal';
import {
  GeneratePendingAgreementPdf,
  GenerateSignedAgreementPdf,
} from '@/helpers/utils/pdfCreation';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
  showActions?: boolean;
  userRole: UserRole;
  order: OrderDetails | null;
  loadOrder?: () => Promise<void>;
}

// Helper function to check if a specific user has confirmed agreement
const hasUserConfirmedAgreement = (order: OrderDetails | null, userRole: UserRole): boolean => {
  if (!order?.progressHistory) return false;

  // Check if this specific user has a BUYER_AGREED or SELLER_AGREED progress entry
  const expectedStatus = userRole === 'buyer' ? 'BUYER_AGREED' : 'SELLER_AGREED';

  const userConfirmation = order.progressHistory.find(
    (progress) => progress.status === expectedStatus && progress.notes.includes('Agreement signed')
  );

  return !!userConfirmation;
};

// Helper function to check if buyer has confirmed
const hasBuyerConfirmedAgreement = (order: OrderDetails | null): boolean => {
  if (!order?.progressHistory || !order.buyerId) return false;

  return order.progressHistory.some(
    (progress) => progress.status === 'BUYER_AGREED' && progress.notes.includes('Agreement signed')
  );
};

// Helper function to check if seller has confirmed
const hasSellerConfirmedAgreement = (order: OrderDetails | null): boolean => {
  if (!order?.progressHistory || !order.sellerId) return false;

  return order.progressHistory.some(
    (progress) => progress.status === 'SELLER_AGREED' && progress.notes.includes('Agreement signed')
  );
};

export default function OrderAgreement({
  handleCurrentStepChange,
  currentStepChange,
  showActions = false,
  userRole,
  order,
  loadOrder,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { user } = useGeneral();

  const totalAgreementConfirmations =
    order?.progressHistory?.filter(
      (progress) =>
        (progress.status === 'BUYER_AGREED' || progress.status === 'SELLER_AGREED') &&
        progress.notes.includes('Agreement signed')
    ).length || 0;

  const bothPartiesConfirmed = totalAgreementConfirmations >= 2;
  const currentUserHasConfirmed = hasUserConfirmedAgreement(order ?? null, userRole);
  const buyerHasConfirmed = hasBuyerConfirmedAgreement(order ?? null);
  const sellerHasConfirmed = hasSellerConfirmedAgreement(order ?? null);

  // Check if user can accept agreement (hasn't accepted yet)
  const canAcceptAgreement = !currentUserHasConfirmed;

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
        } as UpdateOrderProgressDTO,
        order?.id as string
      );

      if (response?.success) {
        toast.success('Order agreement accepted successfully!');
        if (loadOrder) await loadOrder();

        // Note: We can't check both parties confirmed immediately because we need to wait for the data to refresh
        // The step advancement will happen automatically when loadOrder() updates the state
        // and getStep() detects both parties have confirmed in the progressHistory

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
    const nonRejectableStatuses = ['SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

    return !nonRejectableStatuses.includes(order.status);
  };

  // Main content rendering
  let mainContent = null;

  if (
    userRole === 'seller' &&
    (order?.status === 'PENDING' ||
      order?.status === 'BUYER_AGREED' ||
      order?.status === 'SELLER_AGREED')
  ) {
    mainContent = (
      <section className="mt-5 rounded-xl border-2 border-gray-200 bg-[#E6E6E6] p-5">
        <div className="mb-5">
          <h1 className="mb-4 font-inter text-2xl font-semibold text-gray-900">Escrow Agreement</h1>
          <p className="font-inter mb-6 leading-relaxed text-gray-600">
            This agreement confirms that the buyer, {order?.buyer?.firstName}{' '}
            {order?.buyer?.lastName}, has created an escrow transaction for {order?.transactionType}
            . This transaction is governed by an escrow agreement automatically generated by PayAfta
            based on the details provided by both parties. Please review the agreement carefully
            before proceeding.
          </p>
        </div>

        <button
          onClick={() => handleDownload(currentUserHasConfirmed ? 'signed' : 'pending')}
          className="mb-8 flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Escrow Agreement (PDF)
        </button>

        {order?.status === 'PENDING' && (
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
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="agreement"
            className="cursor-pointer text-sm leading-relaxed text-gray-700"
          >
            I have read and agree to the Escrow Agreement. I understand that proceeding confirms my
            acceptance of the terms stated within.
          </label>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg border">
          <h3 className="font-inter text-sm font-medium mb-3">Confirmation Status:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {userRole === 'seller'
                  ? `Buyer: ${order?.buyer?.firstName} ${order?.buyer?.lastName}`
                  : `Seller: ${order?.seller?.firstName} ${order?.seller?.lastName}`}
              </span>
              <span
                className={`text-sm font-medium ${buyerHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
              >
                {buyerHasConfirmed ? '✓ Confirmed' : '⏳ Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {userRole === 'seller' ? 'Seller:' : 'Buyer:'} (
                {userRole === 'seller' ? order?.seller?.firstName : order?.buyer?.firstName}{' '}
                {userRole === 'seller' ? order?.seller?.lastName : order?.buyer?.lastName})
              </span>
              <span
                className={`text-sm font-medium ${userRole === 'seller' ? sellerHasConfirmed : buyerHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
              >
                {userRole === 'seller'
                  ? sellerHasConfirmed
                    ? '✓ Confirmed'
                    : '⏳ Pending'
                  : buyerHasConfirmed
                    ? '✓ Confirmed'
                    : '⏳ Pending'}
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
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>✓ Both
                parties have confirmed! Advancing to payment step...
              </p>
            </div>
          )}
        </div>

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
            disabled={!canRejectOrder(order)}
            className={`w-full sm:w-2/5 rounded-full border-2 border-[#03045B] transition-all duration-300 ${
              canRejectOrder(order)
                ? 'bg-white text-[#03045B] hover:bg-gray-50'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            {!canRejectOrder(order) ? 'Cannot Reject' : 'Reject Order'}
          </ReButton>
        </div>
      </section>
    );
  }

  if (
    userRole === 'buyer' &&
    (order?.status === 'PENDING' ||
      order?.status === 'BUYER_AGREED' ||
      order?.status === 'SELLER_AGREED')
  ) {
    mainContent = (
      <section className="mt-5 rounded-xl border-2 border-gray-200 bg-[#E6E6E6] p-5">
        <div className="mb-5">
          <h1 className="mb-4 font-inter text-2xl font-semibold text-gray-900">Escrow Agreement</h1>
          <p className="font-inter mb-6 leading-relaxed text-gray-600">
            This agreement confirms that the buyer, {order?.buyer?.firstName}{' '}
            {order?.buyer?.lastName}, has created an escrow transaction for {order?.transactionType}
            . This transaction is governed by an escrow agreement automatically generated by PayAfta
            based on the details provided by both parties. Please review the agreement carefully
            before proceeding.
          </p>
        </div>

        <button
          onClick={() => handleDownload(currentUserHasConfirmed ? 'signed' : 'pending')}
          className="mb-8 flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Escrow Agreement (PDF)
        </button>

        {order?.status === 'PENDING' && (
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
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="agreement"
            className="cursor-pointer text-sm leading-relaxed text-gray-700"
          >
            I have read and agree to the Escrow Agreement. I understand that proceeding confirms my
            acceptance of the terms stated within.
          </label>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg border">
          <h3 className="font-inter text-sm font-medium mb-3">Confirmation Status:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {userRole === 'buyer'
                  ? `Buyer: ${order?.buyer?.firstName} ${order?.buyer?.lastName}`
                  : `Seller: ${order?.seller?.firstName} ${order?.seller?.lastName}`}
              </span>
              <span
                className={`text-sm font-medium ${currentUserHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
              >
                {currentUserHasConfirmed ? '✓ Confirmed' : '⏳ Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {userRole === 'buyer' ? 'Seller:' : 'Buyer:'} (
                {userRole === 'buyer' ? order?.seller?.firstName : order?.buyer?.firstName}{' '}
                {userRole === 'buyer' ? order?.seller?.lastName : order?.buyer?.lastName})
              </span>
              <span
                className={`text-sm font-medium ${userRole === 'buyer' ? sellerHasConfirmed : buyerHasConfirmed ? 'text-green-600' : 'text-orange-600'}`}
              >
                {userRole === 'buyer'
                  ? sellerHasConfirmed
                    ? '✓ Confirmed'
                    : '⏳ Pending'
                  : buyerHasConfirmed
                    ? '✓ Confirmed'
                    : '⏳ Pending'}
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
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>✓ Both
                parties have confirmed! Advancing to payment step...
              </p>
            </div>
          )}
        </div>

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
            disabled={!canRejectOrder(order)}
            className={`w-full sm:w-2/5 rounded-full border-2 border-[#03045B] transition-all duration-300 ${
              canRejectOrder(order)
                ? 'bg-white text-[#03045B] hover:bg-gray-50'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            {!canRejectOrder(order) ? 'Cannot Cancel Order' : 'Cancel Order'}
          </ReButton>
        </div>
      </section>
    );
  }

  // if (order?.status === 'AGREEMENT' && currentStepChange === 1) {
  //   mainContent = (
  //     <div className="mt-5 rounded-xl border-2 border-green-200 bg-green-50 p-5">
  //       <h2 className="mb-2 font-inter text-lg font-medium text-green-800">Agreement Completed</h2>
  //       <p className="font-inter text-sm text-green-700">
  //         The escrow agreement has been signed and accepted by both parties. The transaction is now
  //         ready to proceed to the payment stage.
  //       </p>
  //     </div>
  //   );
  // }

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
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

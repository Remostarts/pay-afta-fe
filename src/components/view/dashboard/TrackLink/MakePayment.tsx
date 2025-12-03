'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import PaymentSuccessful from './PaymentSuccessful';
import BankTransferModal from './BankTransferModal';
import PaymentSummary from './PaymentSummary';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';
import { OrderDetails, TWalletData } from '@/types/order';
import { createOneTimeUseWallet, makeWalletPayment } from '@/lib/actions/order/order.actions';
import { TOneTimeUseWallet, TPersonalWalletPaymentInput } from '@/lib/validations/order';
import { useGeneral } from '@/context/generalProvider';
import MilestoneDialog from './MilestoneDialog';
import { UserRole } from './TransactionsSummaryBase';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  isProduct?: boolean;
  currentStepChange: number;
  showActions?: boolean;
  userRole: UserRole;
  order?: OrderDetails | null;
  userId: string;
  loadOrder?: () => Promise<void>;
}

export default function MakePayment({
  handleCurrentStepChange,
  isProduct = false,
  currentStepChange,
  showActions = false,
  userRole,
  userId,
  order,
  loadOrder,
}: OrderAgreementProps) {
  const { loadUserData, user } = useGeneral();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<
    'summary' | 'successful' | 'bankTransfer'
  >('summary');
  const [localLoading, setLocalLoading] = useState(false);
  const [oneTimeUseWallet, setOneTimeUseWallet] = useState<TWalletData | null>(null);

  const totalAmount = Number(order?.amount);

  // If payment already completed, show message instead of payment form
  if (order?.status === 'PAID' && order?.currentStep >= 2) {
    return (
      <div className="mt-5 rounded-xl border-2 border-green-200 bg-green-50 p-5">
        <h2 className="mb-2 text-lg font-semibold text-green-700">Payment Completed</h2>
        <p className="text-sm text-gray-700">
          Your payment has been successfully processed. The seller will now proceed with product
          shipping. You’ll be notified once it’s on the way.
        </p>
      </div>
    );
  }

  // If user can't take action (not buyer)
  if (!showActions) {
    return (
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-[#eeeeee] p-5">
        <h2 className="mb-2 text-lg font-medium font-inter">Awaiting Payment</h2>
        <p className="text-sm text-gray-600 font-inter">
          Kindly note that the payment for the product/service is pending. You will receive a
          notification once the transaction is completed.
        </p>
      </div>
    );
  }

  console.log(order);

  //  Open payment summary modal
  const handleAcceptOrder = () => {
    setIsOpen(true);
    setCurrentComponent('summary');
  };

  //  Wallet payment handler
  const handleWalletPayment = async () => {
    if (!order) return;
    if (!user?.id) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }
    setLocalLoading(true);

    const data: TPersonalWalletPaymentInput = {
      buyerId: order.buyerId,
      amount: Number(order.amount),
      sellerId: order.sellerId,
      orderId: order.id,
      milestoneId: order.milestones?.[0]?.id,
    };

    try {
      const response = await makeWalletPayment(data);
      console.log('🌼 handleWalletPayment response:', response);

      if (response?.success) {
        toast.success('Payment successful!');
        setCurrentComponent('successful');
        // Auto progress to next step after success
        setTimeout(() => {
          handleCurrentStepChange(currentStepChange + 1);
        }, 2000);
      } else {
        toast.error(response?.error || 'Failed to make payment');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to make payment');
    } finally {
      setLocalLoading(false);
    }
  };

  //  Bank transfer handler
  const handleBankTransferSelect = async () => {
    if (!order) return;

    setLocalLoading(true);
    const data: TOneTimeUseWallet = {
      amount: Number(order.amount),
      orderId: order.id,
      userId,
    };

    try {
      console.log(data);

      const response = await createOneTimeUseWallet(data);

      console.log(response);

      if (response?.success) {
        setOneTimeUseWallet(response?.data);
        setCurrentComponent('bankTransfer');
      } else {
        toast.error(response?.error || 'Failed to create bank transfer wallet');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create bank transfer wallet');
    } finally {
      setLocalLoading(false);
    }
  };

  //  When bank transfer confirmed
  const handleBankTransferSuccess = () => {
    setCurrentComponent('successful');
    setTimeout(() => {
      setIsOpen(false);
      handleCurrentStepChange(currentStepChange + 1);
    }, 2000);
  };

  //  Close / navigate back
  const handleBackToSummary = () => {
    setCurrentComponent('summary');
  };

  // Close modal
  const handleCloseDialog = () => {
    setIsOpen(false);
    setCurrentComponent('summary');
  };

  // After success modal complete
  const handleSuccessComplete = () => {
    if (isProduct) {
      setTimeout(() => {
        setIsOpen(false);
        handleCurrentStepChange(currentStepChange + 1);
      }, 2000);
      return;
    }
  };

  //  Render Payment UI
  return (
    <section>
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">Make Payment</h1>
          <p className="font-inter text-gray-600">
            Kindly process your payment to kickstart your secure escrow transaction, ensuring a
            smooth and trustworthy exchange of product or services.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
                Make Payment
              </ReButton>
            </DialogTrigger>

            <DialogContent>
              {currentComponent === 'summary' && (
                <PaymentSummary
                  onWalletPayment={handleWalletPayment}
                  onBankTransferSelect={handleBankTransferSelect}
                  onClose={handleCloseDialog}
                  progressLoading={localLoading}
                  amount={order ? Number(order.amount) : 0}
                  order={order ?? null}
                />
              )}

              {currentComponent === 'bankTransfer' && (
                <BankTransferModal
                  isOpen={true}
                  onClose={handleBackToSummary}
                  amount={totalAmount}
                  onSuccess={handleBankTransferSuccess}
                  oneTimeUseWallet={oneTimeUseWallet ?? undefined}
                />
              )}

              {/* MilestoneDialog commented out - requires handleMilestoneNext implementation */}
              {/*
              {currentComponent === 'milestone' && isProduct === false && (
                <MilestoneDialog
                  isInTransactionSummary={true}
                  onNext={handleMilestoneNext} // TODO: Implement handleMilestoneNext function
                  onClose={handleCloseDialog}
                />
              )}
              */}

              {currentComponent === 'successful' && (
                <PaymentSuccessful
                  label={'Payment Successful'}
                  amount={totalAmount}
                  onComplete={handleSuccessComplete}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

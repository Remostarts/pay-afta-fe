'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PaymentSuccessful from './PaymentSuccessful';
import BankTransferModal from './BankTransferModal';
import MilestoneDialog from './MilestoneDialog';
import PaymentSummary from './PaymentSummary';
import TransactionSummary from './TransactionSummary';

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';
import { UserRole } from './TransactionsSummaryForProduct';
import { OrderDetails, TWalletData } from '@/types/order';
import { toast } from 'sonner';
import { createOneTimeUseWallet, makeWalletPayment } from '@/lib/actions/order/order.actions';
import { TOneTimeUseWallet, TPersonalWalletPaymentInput } from '@/lib/validations/order';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  isProduct?: boolean;
  currentStepChange: number;
  showActions?: boolean;
  userRole: UserRole;
  order?: OrderDetails | null;
  loadOrder?: () => Promise<void>;
}

export default function MakePayment({
  handleCurrentStepChange,
  isProduct = false,
  currentStepChange,
  showActions = false,
  userRole,
  order,
  loadOrder,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<
    'summary' | 'milestone' | 'successful' | 'bankTransfer'
  >('summary');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const totalAmount = 335050.0;
  const router = useRouter();
  const [oneTimeUseWallet, setOneTimeUseWallet] = useState<TWalletData | null>(null);

  const handleAcceptOrder = () => {
    setIsOpen(true);
    setCurrentComponent('summary');
  };

  const handleWalletPayment = async () => {
    setLocalLoading(true);
    const data = {
      buyerId: order?.buyerId,
      amount: Number(order?.milestones[0]?.amount),
      sellerId: order?.sellerId,
      orderId: order?.id,
      milestoneId: order?.milestones[0]?.id,
    } as TPersonalWalletPaymentInput;
    try {
      const response = await makeWalletPayment(data);
      console.log('🌼 🔥🔥 handleWalletPayment 🔥🔥 response🌼', response);

      if (response?.success) {
        setCurrentComponent('successful');
      } else {
        toast.error(response?.error || 'failed to make payment');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'failed to make payment');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleBankTransferSelect = async () => {
    setLocalLoading(true);
    const data = {
      amount: Number(order?.milestones[0]?.amount),
      orderId: order?.id,
    } as TOneTimeUseWallet;
    try {
      const response = await createOneTimeUseWallet(data);
      console.log('🌼 🔥🔥 handleBankTransferSelect 🔥🔥 response🌼', response);

      if (response?.success) {
        setOneTimeUseWallet(response?.data);
        setCurrentComponent('bankTransfer');
      } else {
        toast.error(response?.error || 'failed to make payment');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'failed to make payment');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleBankTransferSuccess = () => {
    // Called when bank transfer process is complete
    setCurrentComponent('successful');
  };

  const handleBackToSummary = () => {
    setCurrentComponent('summary');
  };

  const handleMilestoneNext = () => {
    setCurrentComponent('successful');
    setTimeout(() => {
      setIsOpen(false);
      handleCurrentStepChange(currentStepChange + 1);
    }, 2000);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setCurrentComponent('summary');
  };

  const handleSuccessComplete = () => {
    if (isProduct) {
      setTimeout(() => {
        setIsOpen(false);
        handleCurrentStepChange(currentStepChange + 1);
      }, 2000);
      return;
    }

    // For service transactions, go to milestone
    setCurrentComponent('milestone');
  };

  if (!showActions) {
    return (
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-[#eeeeee] p-5">
        <h2 className="mb-2 text-lg font-medium font-inter">Awaiting Payment</h2>
        <p className="text-sm text-gray-600 font-inter">
          Kindly note that the payment for the product/service is pending. You well receive a
          notification once the transaction is completed.
        </p>
      </div>
    );
  }

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
                  amount={order?.milestones ? Number(order.milestones[0]?.amount) : 0}
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

              {/* {currentComponent === 'milestone' && (
                <MilestoneDialog
                  isInTransactionSummary={true}
                  onNext={handleMilestoneNext}
                  onClose={handleCloseDialog}
                />
              )} */}

              {currentComponent === 'successful' && (
                <PaymentSuccessful
                  label={isProduct ? 'Payment Successful' : 'Transaction confirmed!'}
                  amount={totalAmount}
                  onComplete={handleSuccessComplete}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* <div>
        <TransactionSummary />
      </div> */}
    </section>
  );
}

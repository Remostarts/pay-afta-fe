'use client';

import { useState } from 'react';

import PaymentSuccessful from './PaymentSuccessful';
import MilestoneDialog from './MilestoneDialog';
import BankTransferModal from './BankTransferModal';
import PaymentSummaryForService from './PaymentSummaryForService';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';

interface MakePaymentInServiceProps {
  handleCurrentStepChange: (step: number) => void;
  showActions?: boolean;
  isProduct: boolean;
  currentStepChange: number;
}

export default function MakePaymentInService({
  handleCurrentStepChange,
  showActions = true,
  currentStepChange,
  isProduct,
}: MakePaymentInServiceProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<
    'summary' | 'milestone' | 'successful' | 'bankTransfer'
  >('summary');
  const totalAmount = 335050.0;

  const handleOpenPayment = () => {
    setIsOpen(true);
  };

  const handleBankTransferSelect = () => {
    setCurrentComponent('milestone');
  };

  const handleBackToSummary = () => {
    setCurrentComponent('summary');
  };

  const handleBankTransferSuccess = () => {
    // Called when bank transfer process is complete
    setCurrentComponent('successful');
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

  const handleConfirmTransaction = () => {
    if (currentComponent === 'summary') {
      setCurrentComponent('milestone');
    } else if (currentComponent === 'milestone') {
      setCurrentComponent('successful');
      setTimeout(() => {
        setIsOpen(false);
        handleCurrentStepChange(currentStepChange + 1);
      }, 2000);
    }
  };

  if (!showActions) {
    return (
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <h2 className="mb-2 text-lg font-medium">Awaiting Payment</h2>
        <p className="text-sm text-gray-600">
          Kindly note that the payment for the product/service is pending. You&apos;ll receive a
          notification once the transaction is completed!
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
              <ReButton className="w-2/5 rounded-full" onClick={handleOpenPayment}>
                Make Payment
              </ReButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {currentComponent === 'summary' && (
                <PaymentSummaryForService
                  onWalletPayment={() => {}}
                  onBankTransferSelect={handleBankTransferSelect}
                />
              )}

              {currentComponent === 'bankTransfer' && (
                <BankTransferModal
                  isOpen={true}
                  onClose={handleBackToSummary}
                  amount={totalAmount}
                  onSuccess={handleBankTransferSuccess}
                />
              )}

              {currentComponent === 'milestone' && (
                <MilestoneDialog
                  isInTransactionSummary={true}
                  onNext={handleMilestoneNext}
                  onClose={handleCloseDialog}
                />
              )}

              {currentComponent === 'successful' && (
                <PaymentSuccessful
                  label={'Transaction confirmed!'}
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

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

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  isProduct?: boolean;
  currentStepChange: number;
  showActions?: boolean;
  userRole: 'buyer' | 'seller';
}

export default function MakePayment({
  handleCurrentStepChange,
  isProduct = false,
  currentStepChange,
  showActions = false,
  userRole,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<
    'summary' | 'milestone' | 'successful' | 'bankTransfer'
  >('summary');
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const totalAmount = 335050.0;
  const router = useRouter();

  const handleAcceptOrder = () => {
    setIsOpen(true);
    setCurrentComponent('summary');
  };

  const handleWalletPayment = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/payment-initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            paymentMethod: 'wallet',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create invoice. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invoice created successfully:', data);

      if (data?.data?.paymentUrl && typeof window !== 'undefined') {
        window.open(data?.data?.paymentUrl, '_blank', 'noopener,noreferrer');
      }

      // Show success component after wallet payment
      setCurrentComponent('successful');
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleBankTransferSelect = () => {
    setCurrentComponent('bankTransfer');
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

'use client';

import { useState } from 'react';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import MilestoneDialog from './MilestoneDialog';
import PaymentSummary from './PaymentSummary';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
}

export default function MakePayment({ handleCurrentStepChange }: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<'summary' | 'milestone' | 'successful'>(
    'summary'
  );

  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

  const handleConfirmTransaction = () => {
    if (currentComponent === 'summary') {
      setCurrentComponent('milestone');
    } else if (currentComponent === 'milestone') {
      setCurrentComponent('successful');
    } else {
      handleCurrentStepChange(3);
      setIsOpen(false);
    }
  };

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Make Payment</h1>
        <p className="font-inter text-gray-600">
          Kindly process your payment to kickstart your secure escrow transaction, ensuring a smooth
          and trustworthy exchange of product or services.
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
            {currentComponent === 'summary' ? (
              <PaymentSummary />
            ) : currentComponent === 'milestone' ? (
              <MilestoneDialog
                isInTransactionSummary={true}
                onNext={handleConfirmTransaction}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              <PaymentSuccessful label={'Transaction confirmed!'} />
            )}
            {currentComponent === 'summary' && (
              <DialogFooter>
                <ReButton onClick={handleConfirmTransaction} className="rounded-full">
                  Pay with Wallet Balance
                </ReButton>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

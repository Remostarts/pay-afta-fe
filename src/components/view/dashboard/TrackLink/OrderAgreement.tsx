'use client';

import React, { useState } from 'react';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
}

export default function OrderAgreement({
  handleCurrentStepChange,
  currentStepChange,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

  const handleConfirmTransaction = () => {
    handleCurrentStepChange(2);
    setIsOpen(false);
  };

  const handleRejectOrder = () => {
    // Add rejection logic here
    console.log('Order rejected');
    handleCurrentStepChange(currentStepChange - 1);
  };

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Order Agreement</h1>
        <p className="font-inter text-gray-600">
          The Buyer/Seller has created a payment. Make sure you inspect the details before
          approving.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
              Accept Order
            </ReButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Confirmation</DialogTitle>
            </DialogHeader>
            <PaymentSuccessful label={'Transaction confirmed!'} />
            <DialogFooter>
              <ReButton onClick={handleConfirmTransaction} className="rounded-full">
                Done
              </ReButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ReButton
          className="w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-white"
          onClick={handleRejectOrder}
        >
          Reject
        </ReButton>
      </div>
    </section>
  );
}

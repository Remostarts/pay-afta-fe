'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import RejectDelivery from './RejectDelivery';

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
  handleShowRiseDispute: (showRiseDispute: boolean) => void;
  handleIsRequestRefund: (isRequestRefund: boolean) => void;
  currentStepChange: number;
}

export default function Delivery({
  handleCurrentStepChange,
  handleShowRiseDispute,
  handleIsRequestRefund,
  currentStepChange,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const route = useRouter();

  const handleAcceptOrder = () => {
    // setIsOpen(true);
    // route.push('/dashboard');
    handleCurrentStepChange(currentStepChange + 1);
  };

  const handleConfirmTransaction = () => {
    // handleCurrentStepChange(5);
    setIsOpen(false);
  };

  const handleRejectOrder = () => {
    // Add rejection logic here
    setIsOpen(true);
    // handleCurrentStepChange(5);
  };

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">
          Is the delivery satisfactory?
        </h1>
        <p className="font-inter text-gray-600">
          Your feedback matters! Take a moment to review the delivery and let us know if you&apos;re
          satisfied. If everything looks good, feel free to accept. If not, no worries – you can
          easily dispute any issues here.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton
              className="w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-white"
              onClick={handleRejectOrder}
            >
              Reject
            </ReButton>
          </DialogTrigger>
          <DialogContent>
            <RejectDelivery
              handleClosed={setIsOpen}
              handleCurrentStepChange={handleCurrentStepChange}
              handleShowRiseDispute={handleShowRiseDispute}
              handleIsRequestRefund={handleIsRequestRefund}
              currentStepChange={currentStepChange}
            />
          </DialogContent>
        </Dialog>
        <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
          Accept
        </ReButton>
      </div>
      <p className="mt-4 font-inter text-gray-600">
        Confirm product delivery within <span className="text-green-600">24:00:00</span> hours. If
        no action is taken, the transaction auto-completes.
      </p>
    </section>
  );
}

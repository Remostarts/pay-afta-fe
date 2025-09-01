'use client';

import React, { useState } from 'react';

import TransactionSummary from './TransactionSummary';

import { ReButton } from '@/components/re-ui/ReButton';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
  showActions?: boolean;
  userRole: 'buyer' | 'seller';
}

export default function ConfirmShipping({
  handleCurrentStepChange,
  currentStepChange,
  showActions = false,
  userRole,
}: OrderAgreementProps) {
  const handleAcceptOrder = () => {
    handleCurrentStepChange(currentStepChange + 1);
  };

  if (!showActions) {
    return (
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-[#eeeeee] p-5">
        <h2 className="mb-2 text-lg font-medium font-inter">On the way</h2>
        <p className="text-sm text-gray-600 font-inter">
          Your product or service is now on its way. Expect delivery soon, and feel free to track
          the progress using the provided details. Thank you for your purchase.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">Confirm Shipping</h1>
          <p className="font-inter text-gray-600">
            Please verify the shipment or provision of the requested product/service to the buyer
            for confirmation.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
            Confirm
          </ReButton>
        </div>
      </div>
      {/* <TransactionSummary /> */}
    </section>
  );
}

'use client';

import React, { useState } from 'react';

import { ReButton } from '@/components/re-ui/ReButton';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
}

export default function ConfirmShipping({
  handleCurrentStepChange,
  currentStepChange,
}: OrderAgreementProps) {
  const handleAcceptOrder = () => {
    handleCurrentStepChange(currentStepChange + 1);
  };

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Confirm Shipping</h1>
        <p className="font-inter text-gray-600">
          Please verify the shipment or provision of the requested product/service to the buyer for
          confirmation.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
          Confirm
        </ReButton>
      </div>
    </section>
  );
}

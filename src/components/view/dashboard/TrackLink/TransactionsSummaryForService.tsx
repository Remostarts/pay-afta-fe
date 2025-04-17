'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import Summary from './Summary';
import MakePaymentInService from './MakePaymentInService';
import Delivery from './Delivery';
import TransactionsDispute from './TransactionsDispute';
import OrderAgreement from './OrderAgreement';
import StepperForService from './StepperForService';
import TransactionApproval from './TransactionApproval';

import { Button } from '@/components/ui/button';

interface TransactionsSummaryProps {
  onBack: () => void;
}

export default function TransactionsSummaryForService({ onBack }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDisputed, setIsDisputed] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleShowRiseDispute = () => {
    setIsDisputed(true);
  };

  const handleIsRequestRefund = () => {
    setIsReturn(true);
  };

  return (
    <section className="grid grid-rows-2 rounded-md bg-white p-4 lg:flex lg:items-center lg:gap-10">
      <div className="w-full rounded-md">
        <Button variant="outline" onClick={onBack} className="ml-4">
          <ChevronLeft />
        </Button>
        <h1 className="font-inter text-xl font-bold text-gray-700">Transactions Summary</h1>
        <div className="mb-5 grid grid-cols-2">
          <p className="font-inter text-gray-500">Transactions ID: 123456789</p>
          <p className="font-inter text-gray-500">November3, 2024, 18:25</p>
        </div>
        <StepperForService currentStep={currentStep} isDisputed={isDisputed} isReturn={isReturn} />
        {currentStep === 1 ? (
          <TransactionApproval showActions={true} handleCurrentStepChange={handleStepChange} />
        ) : currentStep === 2 ? (
          <MakePaymentInService handleCurrentStepChange={handleStepChange} />
        ) : currentStep === 3 ? (
          <Delivery
            handleCurrentStepChange={handleStepChange}
            handleShowRiseDispute={handleShowRiseDispute}
            handleIsRequestRefund={handleIsRequestRefund}
          />
        ) : (
          currentStep === 4 && <TransactionsDispute />
        )}
      </div>
      <div>
        <Summary
          name="Paul Simeon"
          paymentMethod="Milestone Payment"
          deliveryDate="November 24, 2023"
          item="Lorem ipsum dolor sit amet consectetur. Id scelerisque condimentum sagittis accumsan viverra est scelerisque volutpat eleifend. Non placerat viverra hac mi in lorem."
          quantity={70}
          price={300000}
        />
      </div>
    </section>
  );
}

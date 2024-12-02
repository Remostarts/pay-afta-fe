'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import OrderAreement from './OrderAgreement';
import Summary from './Summary';
import MakePayment from './MakePayment';
import ConfirmShipping from './ConfirmShipping';
import Delivery from './Delivery';
import TransactionsDispute from './TransactionsDispute';

import Stepper from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';

const steps = [
  { number: 1, label: 'Agreement' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Shipping' },
  { number: 4, label: 'Delivery' },
  { number: 5, label: 'Closed' },
];

interface TransactionsSummaryProps {
  onBack: () => void;
}

export default function TransactionsSummary({ onBack }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <section className="grid grid-rows-2 lg:flex lg:items-center lg:gap-10">
      <div className="w-full rounded-md">
        <Button variant="outline" onClick={onBack} className="ml-4">
          <ChevronLeft />
        </Button>
        <h1 className="font-inter text-xl font-bold text-gray-700">Transactions Summary</h1>
        <div className="mb-5 grid grid-cols-2">
          <p className="font-inter text-gray-500">Transactions ID: 123456789</p>
          <p className="font-inter text-gray-500">November3, 2024, 18:25</p>
        </div>
        <Stepper totalSteps={5} currentStep={currentStep} steps={steps} />
        {currentStep === 1 ? (
          <OrderAreement handleCurrentStepChange={setCurrentStep} />
        ) : currentStep === 2 ? (
          <MakePayment handleCurrentStepChange={setCurrentStep} />
        ) : currentStep === 3 ? (
          <ConfirmShipping handleCurrentStepChange={setCurrentStep} />
        ) : currentStep === 4 ? (
          <Delivery handleCurrentStepChange={setCurrentStep} />
        ) : (
          currentStep === 5 && <TransactionsDispute />
        )}
      </div>
      <div>
        <Summary
          name="Paul Simeon"
          paymentMethod="One Time Payment"
          deliveryDate="November 24, 2023"
          item="Lorem ipsum dolor sit amet consectetur. Id scelerisque condimentum sagittis accumsan viverra est scelerisque volutpat eleifend. Non placerat viverra hac mi in lorem."
          quantity={70}
          price={300000}
        />
      </div>
    </section>
  );
}

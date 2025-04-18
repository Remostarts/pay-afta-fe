'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import Summary from './Summary';
import MakePayment from './MakePayment';
import ConfirmShipping from './ConfirmShipping';
import Delivery from './Delivery';
import TransactionsDispute from './TransactionsDispute';
import OrderAgreement from './OrderAgreement';
import StepperForProduct from './StepperForProduct';

import { Button } from '@/components/ui/button';

interface TransactionsSummaryProps {
  onBack: () => void;
}

export default function TransactionsSummaryForProduct({ onBack }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showRiseDispute, setShowRiseDispute] = useState<boolean>(false);
  const [isRequestRefund, setIsRequestRefund] = useState<boolean>(false);

  // console.log(isRequestRefund);

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
        <StepperForProduct
          currentStep={currentStep}
          isDisputed={showRiseDispute}
          isReturn={isRequestRefund}
        />
        {currentStep === 1 ? (
          <OrderAgreement
            handleCurrentStepChange={setCurrentStep}
            currentStepChange={currentStep}
          />
        ) : currentStep === 2 ? (
          <MakePayment handleCurrentStepChange={setCurrentStep} currentStepChange={currentStep} />
        ) : currentStep === 3 ? (
          <ConfirmShipping
            handleCurrentStepChange={setCurrentStep}
            currentStepChange={currentStep}
          />
        ) : currentStep === 4 ? (
          <Delivery
            handleCurrentStepChange={setCurrentStep}
            handleShowRiseDispute={setShowRiseDispute}
            handleIsRequestRefund={setIsRequestRefund}
            currentStepChange={currentStep}
          />
        ) : currentStep === 5 ? (
          showRiseDispute === true ? (
            <TransactionsDispute />
          ) : (
            <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-semibold">Transaction Completed</h2>
              <p className="text-sm font-medium text-gray-700">
                Congratulations! Transaction complete, product/service delivered & accepted. Payment
                released, marking a successful and seamless process.
              </p>
            </div>
          )
        ) : (
          <p>NULL</p>
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

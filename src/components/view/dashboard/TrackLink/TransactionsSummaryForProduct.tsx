'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import Summary from './Summary';
import TransactionSummary from './TransactionSummary';
import MakePayment from './MakePayment';
import ConfirmShipping from './ConfirmShipping';
import Delivery from './Delivery';
import ReturnProduct from './ReturnProduct';
import TransactionsDispute from './TransactionsDispute';
import OrderAgreement from './OrderAgreement';
import StepperForProduct from './StepperForProduct';

import { Button } from '@/components/ui/button';

interface TransactionsSummaryProps {
  onBack: () => void;
  id: string;
  userRole: 'buyer' | 'seller';
}

export default function TransactionsSummaryForProduct({
  onBack,
  id,
  userRole,
}: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showRiseDispute, setShowRiseDispute] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false); // Tracks if product is in return stage
  const [isRefunded, setIsRefunded] = useState<boolean>(false); // Tracks if refund is processed

  // Handler for Accept button in Delivery
  const handleAcceptDelivery = () => {
    setCurrentStep(5); // Move to Completed stage
  };

  // Handler for Reject button in Delivery - starts return process
  const handleRejectDelivery = () => {
    setIsReturn(true); // Move to Return stage
    // Stay on step 4 but show return component instead
  };

  // Handler for refund request from RequestRefund component
  const handleRefundRequested = () => {
    setIsReturn(true); // Set return state to true
    // Stay on current step but show ReturnProduct component
  };

  // Handler for completing the return process
  const handleReturnCompleted = () => {
    setIsRefunded(true); // Mark as refunded
    setCurrentStep(5); // Move to Refunded stage
  };

  return (
    <section
      className={currentStep === 1 ? 'grid grid-rows-2 lg:flex lg:gap-10' : 'flex flex-col gap-4'}
    >
      <div className={`rounded-md bg-white p-4 max-w-3xl`}>
        <div className="flex items-center ">
          <ChevronLeft onClick={onBack} />
          <h1 className="font-inter text-xl font-bold text-gray-700"> Escrow Summary</h1>
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="font-inter text-gray-500">Transactions ID: {id}</p>
          <p className="font-inter text-gray-500">November 3, 2024, 18:25</p>
        </div>
        <StepperForProduct
          currentStep={currentStep}
          isDisputed={showRiseDispute}
          isReturn={isReturn}
          isRefunded={isRefunded}
        />
        {currentStep === 1 ? (
          <OrderAgreement
            handleCurrentStepChange={setCurrentStep}
            currentStepChange={currentStep}
            userRole={userRole}
            showActions={true}
          />
        ) : currentStep === 2 ? (
          <MakePayment
            handleCurrentStepChange={setCurrentStep}
            currentStepChange={currentStep}
            userRole={userRole}
            isProduct={true}
            showActions={true}
          />
        ) : currentStep === 3 ? (
          <ConfirmShipping
            handleCurrentStepChange={setCurrentStep}
            currentStepChange={currentStep}
            userRole={userRole}
            showActions={true}
          />
        ) : currentStep === 4 ? (
          isReturn ? (
            <ReturnProduct
              handleCurrentStepChange={setCurrentStep}
              handleShowRiseDispute={setShowRiseDispute}
              handleReturnCompleted={handleReturnCompleted} // Handle return completion
              handleIsRequestRefund={() => {}} // TODO: Implement logic if needed
              currentStepChange={currentStep}
              userRole={userRole}
              showActions={true}
            />
          ) : (
            <Delivery
              handleCurrentStepChange={setCurrentStep}
              handleShowRiseDispute={setShowRiseDispute}
              handleAcceptDelivery={handleAcceptDelivery} // Handle Accept
              handleRejectDelivery={handleRejectDelivery} // Handle Reject
              handleIsRequestRefund={() => {}} // Add empty handler for now
              handleRefundRequested={handleRefundRequested} // Updated handler for refund requests
              currentStepChange={currentStep}
              userRole={userRole}
              showActions={true}
            />
          )
        ) : currentStep === 5 ? (
          showRiseDispute ? (
            <TransactionsDispute />
          ) : isRefunded ? (
            <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-semibold">Transaction Refunded</h2>
              <p className="text-sm font-medium text-gray-700">
                Refund processed successfully! The product has been returned and payment has been
                refunded to the buyer account.
              </p>
            </div>
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
      <div className="rounded-md max-w-xl bg-white p-4">
        {currentStep === 1 ? (
          <Summary
            userRole={userRole}
            showActions={true}
            name="Paul Simeon"
            paymentMethod="One Time Payment"
            deliveryDate="November 24, 2023"
            item="Lorem ipsum dolor sit amet consectetur. Id scelerisque condimentum sagittis accumsan viverra est scelerisque volutpat eleifend. Non placerat viverra hac mi in lorem."
            quantity={70}
            price={300000}
          />
        ) : (
          <TransactionSummary />
        )}
      </div>
    </section>
  );
}

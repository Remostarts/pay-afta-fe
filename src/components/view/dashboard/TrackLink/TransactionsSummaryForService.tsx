'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Summary from './Summary';
import MakePaymentInService from './MakePaymentInService';
import Delivery from './Delivery';
import TransactionsDispute from './TransactionsDispute';
import OrderAgreement from './OrderAgreement';
import StepperForService from './StepperForService';
import TransactionApproval from './TransactionApproval';
import MilestoneTransaction from './MilestoneTransaction';

import { Button } from '@/components/ui/button';
import { useGeneral } from '@/context/generalProvider';
import { TOrder } from '@/types/trackLink';

// const sampleMilestones: {
//   date: string;
//   amount: number;
//   description: string;
//   status?: 'pending' | 'paid' | 'disputed';
// }[] = [
//   {
//     date: 'November 24, 2023',
//     amount: 150000,
//     description:
//       'Lorem ipsum dolor sit amet consectetur. Sed sed purus quis hendrerit sagittis neque ridiculus pellentesque ultrices. Eleifend fames quis mattis in non id.',
//     status: 'pending',
//   },
//   {
//     date: 'November 31, 2023',
//     amount: 150000,
//     description:
//       'Lorem ipsum dolor sit amet consectetur. Sed sed purus quis hendrerit sagittis neque ridiculus pellentesque ultrices. Eleifend fames quis mattis in non id.',
//     status: 'paid',
//   },
// ];

interface TransactionsSummaryProps {
  onBack: () => void;
  id: string;
}

export default function TransactionsSummaryForService({ onBack, id }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDisputed, setIsDisputed] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const router = useRouter();
  const { session } = useGeneral();
  const [order, setOrder] = useState<TOrder | null>(null);
  console.log('🌼 🔥🔥 TransactionsSummaryForService 🔥🔥 order🌼', order);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleShowRiseDispute = () => {
    setIsDisputed(true);
  };

  const handleIsRequestRefund = () => {
    setIsReturn(true);
  };

  useEffect(() => {
    handleLoadOrder();
  }, []);

  const handleLoadOrder = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.accessToken, // Replace with your actual token logic
        },
        // body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create invoice. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🌼 🔥🔥 handleLoadOrder 🔥🔥 data🌼', data?.data);
      setOrder(data?.data);
      if (data?.data) setCurrentStep(order?.currentStep || 1);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <section className="grid grid-rows-2 rounded-md bg-white p-4 lg:flex lg:items-center lg:gap-10">
      <div className="w-full rounded-md">
        <Button variant="outline" onClick={onBack} className="ml-4">
          <ChevronLeft />
        </Button>
        <h1 className="font-inter text-xl font-bold text-gray-700">Order Summary</h1>
        <div className="mb-5 grid grid-cols-2">
          <p className="font-inter text-gray-500">Transactions ID: {id}</p>
          <p className="font-inter text-gray-500">November3, 2024, 18:25</p>
        </div>
        <StepperForService currentStep={currentStep} isDisputed={isDisputed} isReturn={isReturn} />
        {currentStep === 1 ? (
          <TransactionApproval
            showActions={true}
            handleCurrentStepChange={handleStepChange}
            currentStepChange={currentStep}
          />
        ) : currentStep === 2 ? (
          <MakePaymentInService
            handleCurrentStepChange={handleStepChange}
            currentStepChange={currentStep}
          />
        ) : currentStep === 3 ? (
          <MilestoneTransaction
            userType="seller"
            handleShowRiseDispute={handleShowRiseDispute}
            handleCurrentStepChange={handleStepChange}
            currentStepChange={currentStep}
            handleIsDisputed={setIsDisputed}
          />
        ) : currentStep === 4 ? (
          isDisputed === true ? (
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

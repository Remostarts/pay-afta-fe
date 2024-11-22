'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import PersonalKycForm from './PersonalKycForm';
import SettlementKycForm from './SettlementKycForm';
import TransactionPin from './TransactionPin';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const steps = [
  {
    id: 0,
    title: 'Personal KYC',
    description: 'Additional details about you',
    status: 'current',
    Form: PersonalKycForm,
  },
  {
    id: 1,
    title: 'Settlement KYC',
    description: 'Add bank account for payout',
    status: 'pending',
    Form: SettlementKycForm,
  },
  {
    id: 2,
    title: 'Transaction PIN',
    description: 'Set transaction PIN',
    status: 'pending',
    Form: TransactionPin,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const route = useRouter();

  // console.log(currentStep);

  function manageCurrentStep() {
    setCompletedSteps((prev) => [...prev, currentStep]);
    setCurrentStep(currentStep + 1);
  }

  function handleClick() {
    route.push('/dashboard');
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Onboarding</h1>
        <span className="font-inter text-gray-600">{currentStep}/3 Complete</span>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const StepForm = step?.Form; // Create component reference
          const isStepCompleted = completedSteps.includes(step?.id);
          return (
            <Card
              key={step?.id}
              className="border border-gray-200 p-6 shadow-none transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="font-inter text-lg font-medium text-gray-900">{step?.title}</h2>
                  <p className="font-inter text-sm text-gray-500">{step?.description}</p>
                </div>
                {isStepCompleted ? (
                  <Image
                    src="/assets/auth/onboarding/check 1.svg"
                    alt="Check"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="min-w-[120px] rounded-full bg-[#03045B] px-6 font-inter text-white hover:bg-[#03045B]/90"
                        disabled={step?.id > currentStep}
                      >
                        Submit
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <StepForm manageCurrentStep={manageCurrentStep} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Complete Onboarding Button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="secondary"
          className="w-[70%] rounded-full bg-[#03045B] py-6 font-inter text-base font-medium text-white hover:bg-[#03045B]/90"
          disabled={currentStep < 3}
          onClick={handleClick}
        >
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
}

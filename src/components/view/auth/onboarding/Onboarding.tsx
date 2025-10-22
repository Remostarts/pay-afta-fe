'use client';

import { useEffect, useState } from 'react';
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
import { useGeneral } from '@/context/generalProvider';
import { toast } from 'sonner';

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
  const { user } = useGeneral();

  // console.log(currentStep);

  function manageCurrentStep() {
    setCompletedSteps((prev) => [...prev, currentStep]);
    console.log('🌼 🔥🔥 manageCurrentStep 🔥🔥 prev', currentStep);
    setCurrentStep((prev) => prev + 1);
    console.log('🌼 🔥🔥 manageCurrentStep 🔥🔥 later', currentStep);
  }

  function handleClick() {
    if (currentStep >= 3) {
      route.push('/dashboard');
    }
  }

  useEffect(() => {
    if (user?.profile?.personalKycStatus) {
      setCompletedSteps((prev) => [...prev, 0]);
      setCurrentStep(1);
    }
    if (user?.profile?.settlementKycStatus) {
      setCompletedSteps((prev) => [...prev, 1]);
      setCurrentStep(2);
    }
    if (user?.profile?.pinSet) {
      setCompletedSteps((prev) => [...prev, 2]);
      setCurrentStep(3);
    }
  }, [user?.profile?.personalKycStatus, user?.profile?.settlementKycStatus, user?.profile?.pinSet]);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-inter text-xl font-semibold text-[#010101]">Onboarding</h1>
        <span className="font-inter text-gray-700">{currentStep}/3 Complete</span>
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
                  <h2 className="font-inter text-lg font-medium text-gray-700">{step?.title}</h2>
                  <p className="font-inter text-sm text-gray-600">{step?.description}</p>
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
                      <StepForm
                        onComplete={(result) => {
                          // Mark this step as completed
                          setCompletedSteps((prev) => [...prev, step.id]);

                          // Move to the next step
                          setCurrentStep((prev) => prev + 1);

                          // Optional: show a success message
                          toast.success(`${step.title} completed!`);

                          console.log('Step result:', result);
                        }}
                      />
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

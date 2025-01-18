'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import SetNewPassword from '../sign-in/SetNewPassword';
import BackToLogin from '../sign-in/BackToLogin';

import FillEmail from '@/components/view/auth/forget-pass/FillEmail';

export default function ForgetPassword() {
  const searchParams = useSearchParams();
  // const currentStep = Number(searchParams.get('step'));
  const [currentStep, setCurrentStep] = useState<number>(1);

  function handleCurrentStep() {
    setCurrentStep(currentStep + 1);
  }

  return (
    <section className="flex grow">
      <div className="grow">
        {currentStep === 1 && <FillEmail handleCurrentStep={handleCurrentStep} />}
        {currentStep === 2 && (
          <div className="px-8">
            <SetNewPassword handleCurrentStep={handleCurrentStep} />
          </div>
        )}
        {currentStep === 3 && (
          <div className=" px-8 py-12">
            <BackToLogin />
          </div>
        )}
      </div>
    </section>
  );
}

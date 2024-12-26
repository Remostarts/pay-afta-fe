'use client';

import { useSearchParams } from 'next/navigation';

import SetNewPassword from '../sign-in/SetNewPassword';
import BackToLogin from '../sign-in/BackToLogin';

import FillEmail from '@/components/view/auth/forget-pass/FillEmail';

export default function ForgetPassword() {
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get('step'));

  return (
    <section className="flex grow">
      <div className="grow">
        {currentStep === 1 && <FillEmail />}
        {currentStep === 2 && (
          <div className="px-8">
            <SetNewPassword />
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

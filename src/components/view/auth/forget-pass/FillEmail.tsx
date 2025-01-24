'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
// import { useOtp } from '@/context/OtpProvider';
import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
import { sendResetPassLink } from '@/lib/actions/auth/signup.actions';
// import { sendForgetPasswordOtp } from '@/lib/actions/auth/signup.actions';

interface IFillEmailProps {
  handleCurrentStep(): void;
}

export default function FillEmail({ handleCurrentStep }: IFillEmailProps) {
  const [email, setEmail] = useState('');
  // const { setEmail: setEmailOtp } = useOtp();
  const handleSendCode = useSearchParamsHandler();

  const handleSubmit = async () => {
    if (email.trim() === '') {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    try {
      const response = await sendResetPassLink(email);

      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        toast({
          title: 'Code Sent',
          description: 'A verification code has been sent to your email address.',
        });
        handleCurrentStep();
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Image src="/Logo.svg" alt="logo" width={175.96} height={36} />
      </div>
      <div className="mb-6">
        <h2 className="mb-1 text-center font-spaceGrotesk text-2xl font-bold lg:text-3xl">
          Forget password?
        </h2>
        <p className="text-center font-inter text-gray-600">
          Enter the Email Address used to register this account.
        </p>
      </div>

      <div className="px-8 py-12">
        <h2 className="mb-4 font-spaceGrotesk text-xl font-bold lg:text-2xl">Email</h2>
        <form>
          <div className="mb-8">
            <Input
              name="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // setEmailOtp(e.target.value);
              }}
              className="mt-2 border-gray-300 py-8"
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className={`w-full rounded-xl bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg`}
          >
            Send Recovery Link
          </Button>
          <div className="mt-10 text-center">
            <p>
              You do not have a account?{' '}
              <Link href="/sign-up" className="font-inter font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

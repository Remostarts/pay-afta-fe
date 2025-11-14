'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { useForm, FormProvider } from 'react-hook-form';

export default function InviteCounterparty() {
  const methods = useForm();
  const { watch } = methods;

  const email = watch('email');
  const phone = watch('number');

  const handleInvite = () => {};

  return (
    <FormProvider {...methods}>
      <section className="mx-auto w-full max-w-md">
        <div className="flex items-start justify-between">
          <h1 className="font-inter text-xl font-bold text-gray-900">Invite Counterparty</h1>
        </div>

        <p className="mt-1 font-inter text-sm text-gray-600 leading-relaxed">
          We need their contact information to send them a secure invitation.
        </p>

        {/* Email */}
        <div className="mt-3">
          <ReInput name="email" label="Email Address" placeholder="example@gmail.com" />
        </div>

        {/* <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="font-inter text-sm text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="mt-3">
          <ReInput name="number" label="Phone Number" placeholder="Enter phone number!" />
        </div> */}

        {/* Buttons */}
        <div className="flex justify-between gap-2">
          <Button className="mt-5 w-full border border-[#CCCCCC] rounded-full">Cancel</Button>
          <Button className="mt-5 w-full bg-black text-white rounded-full" onClick={handleInvite}>
            Send Invite & Continue
          </Button>
        </div>
      </section>
    </FormProvider>
  );
}

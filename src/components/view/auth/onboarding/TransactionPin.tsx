'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import ReOtp from '@/components/re-ui/ReOtp';
import { Form } from '@/components/ui/form';
import { TTransactionPin, transactionPinSchema } from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';

export default function TransactionPin({ manageCurrentStep = () => {} }) {
  const [finalPin, setFinalPin] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePinChange = (newPin: string): void => {
    // Ensure only numeric input is allowed
    const numericPin = newPin.replace(/\D/g, '');
    setPin(numericPin);
  };

  const handleConfirmPinChange = (confirmPin: string): void => {
    const numericPin = confirmPin.replace(/\D/g, '');
    setConfirmPin(numericPin);
  };

  function handleSubmit(data: any): void {
    // console.log(data);
    if (pin === confirmPin) {
      setFinalPin(confirmPin);
    } else {
      setError('Enter Pin does not match.');
    }
    console.log(finalPin);
    manageCurrentStep();
  }

  return (
    <section>
      <h1 className="text-center font-inter text-3xl font-semibold text-gray-800">
        Transaction Pin
      </h1>
      <div>
        <p className="my-5 text-center font-inter text-xl font-semibold">Enter Verification Code</p>
        <ReOtp
          count={4}
          name="verificationCode"
          onChange={handlePinChange}
          className="mb-4 gap-2 sm:gap-4"
        />
      </div>
      <div>
        <p className="my-5 text-center font-inter text-xl font-semibold">
          Confirm Verification Code
        </p>
        <ReOtp
          count={4}
          name="confirmVerificationCode"
          onChange={handleConfirmPinChange}
          className="mb-4 gap-2 sm:gap-4"
        />
      </div>
      <p className="my-5 text-center font-inter font-semibold text-red-500">{error}</p>
      <div className="mt-3 flex justify-end">
        <button
          className="w-2/5 rounded-full bg-[#03045B] py-3 font-inter text-white sm:py-3"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </section>
  );
}

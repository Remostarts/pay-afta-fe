'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import { ReButton } from '@/components/re-ui/ReButton';
import RePin from '@/components/re-ui/RePin';

type PaymentConfirmationProps = {
  amount: number;
  bankName: string;
  accountNumber: string;
  bankCode: string;
  onAuthorize: (pin: string) => Promise<boolean>; // 🔹 new prop
};

const PaymentConfirmation = ({
  amount,
  bankName,
  accountNumber,
  bankCode,
  onAuthorize,
}: PaymentConfirmationProps) => {
  const [isShowTranscationPin, setIsShowTranscationPin] = useState(false);
  const [isShowTranscationDone, setIsShowTranscationDone] = useState(false);
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTranscationPin() {
    try {
      setIsSubmitting(true);
      const success = await onAuthorize(pin);
      if (success) setIsShowTranscationDone(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      {!isShowTranscationPin && (
        <div className="mx-auto max-w-md rounded-lg bg-white">
          <h2 className="mb-2 text-center text-2xl font-bold">Review & Confirm Payment</h2>
          <p className="mb-4 text-center text-gray-600">
            Verify the details below before completing the payment.
          </p>
          <div className="mb-4 flex justify-between">
            <p>Amount</p>
            <p className="text-xl">₦{amount.toLocaleString()}</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Bank Name</p>
            <p>{bankName}</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Account Number</p>
            <p>{accountNumber}</p>
          </div>
          <div className="mb-4 flex justify-between">
            {/* <p>Bank Code</p>
            <p>{bankCode}</p> */}
          </div>
          <ReButton className="w-full rounded-full" onClick={() => setIsShowTranscationPin(true)}>
            Authorize Payment
          </ReButton>
        </div>
      )}

      {isShowTranscationPin && !isShowTranscationDone && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6">
          <h2 className="mb-2 text-2xl font-bold">Enter Transaction PIN</h2>
          <Link href="#" className="mb-4 text-blue-600">
            Forgot PIN?
          </Link>
          <RePin count={4} onChange={setPin} />
          <ReButton
            className="mt-5 w-full rounded-full"
            onClick={handleTranscationPin}
            disabled={pin.length !== 4 || isSubmitting}
            isSubmitting={isSubmitting}
          >
            Authorize Payment
          </ReButton>
        </div>
      )}

      {isShowTranscationDone && (
        <PaymentSuccessful label="Withdrawal Successful" amount={amount} bankName={bankName} />
      )}
    </section>
  );
};

export default PaymentConfirmation;

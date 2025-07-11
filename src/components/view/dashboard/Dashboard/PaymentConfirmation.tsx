'use client';

import React, { useState } from 'react';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import { ReButton } from '@/components/re-ui/ReButton';
import RePin from '@/components/re-ui/RePin';

type PaymentConfirmationProps = {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

const PaymentConfirmation = ({
  amount,
  bankName,
  accountNumber,
  accountName,
}: PaymentConfirmationProps) => {
  const [isShowTranscationPin, setIsShowTranscationPin] = useState<boolean>(false);
  const [isShowTranscationDone, setIsShowTranscationDone] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');

  function handleChange(data: any) {
    setPin(data);
  }

  function handleClick() {
    setIsShowTranscationPin(true);
  }

  function handleTranscationPin() {
    setIsShowTranscationDone(true);
  }

  return (
    <section>
      {!isShowTranscationPin && (
        <div className="mx-auto max-w-md rounded-lg bg-white">
          <h2 className="mb-2 text-center font-inter text-2xl font-bold">
            Review & Confirm Payment
          </h2>
          <p className="mb-4 text-center font-inter text-gray-600">
            Verify the details below before completing the payment.
          </p>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-inter font-medium text-gray-700">Amount</p>
            <p className="text-xl text-gray-900">₦{amount?.toLocaleString()}</p>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-inter font-medium text-gray-700">Bank Name</p>
            <p className="font-inter text-gray-900">{bankName}</p>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-inter font-medium text-gray-700">Account Number</p>
            <p className="font-inter text-gray-900">{accountNumber}</p>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-inter font-medium text-gray-700">Account Name</p>
            <p className="font-inter text-gray-900">{accountName}</p>
          </div>
          <ReButton className="w-full rounded-full font-inter" onClick={handleClick}>
            Authorize Payment
          </ReButton>
        </div>
      )}
      {isShowTranscationPin && !isShowTranscationDone && (
        <div className="mx-auto max-w-md rounded-lg bg-white p-6">
          <h2 className="mb-2 text-center font-inter text-2xl font-bold">Enter Transaction Pin</h2>
          <p className="mb-4 text-center font-inter text-gray-600">Protect your payment</p>
          <RePin count={4} onChange={handleChange} />
          <ReButton
            className="mt-5 w-full rounded-full font-inter"
            onClick={handleTranscationPin}
            disabled={pin.length !== 4}
          >
            Authorize Payment
          </ReButton>
        </div>
      )}
      {isShowTranscationDone && (
        <PaymentSuccessful label={'Withdrawal Successful'} amount={amount} bankName={bankName} />
      )}
    </section>
  );
};

export default PaymentConfirmation;

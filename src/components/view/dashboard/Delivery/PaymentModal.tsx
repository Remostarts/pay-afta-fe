'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ReHeading } from '@/components/re-ui/ReHeading';

// Step 1: Payment Summary
const PaymentSummaryModal = ({
  onProceed,
  onClose,
}: {
  onProceed: () => void;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState('walletBalance');

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      {/* <button className="absolute right-4 top-4 text-2xl" onClick={onClose} aria-label="Close">
      &times;
    </button> */}
      <ReHeading heading="Payment Summary" size="2xl" />
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-gray-500">
          <span>Transaction Amount</span>
          <span>₦334,000.00</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Escrow fee @2.5%</span>
          <span>₦1,050.00</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₦335,050.00</span>
        </div>
      </div>
      <div className="mb-6">
        <ReHeading heading="Select Payment Method" />

        <div className="mb-6 mt-2 space-y-3">
          <button
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${selected === 'walletBalance' ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelected('walletBalance')}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-5 items-center justify-center rounded-full border border-gray-300`}
              >
                {selected === 'walletBalance' && (
                  <span className="block size-3 rounded-full bg-[#12BA4A]" />
                )}
              </span>
              <span className="font-inter">Wallet Balance</span>
            </div>
            {/* <ChevronRight /> */}
          </button>
          <button
            className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${selected === 'bankTransfer' ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelected('bankTransfer')}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-5 items-center justify-center rounded-full border border-gray-300`}
              >
                {selected === 'bankTransfer' && (
                  <span className="block size-3 rounded-full bg-[#12BA4A]" />
                )}
              </span>
              <span className="font-inter">Bank Transfer</span>
            </div>
            {/* <ChevronRight /> */}
          </button>
        </div>
      </div>
      <button
        className="w-full rounded-full bg-[#03045B] py-2 font-semibold text-white"
        onClick={onProceed}
      >
        Pay Now
      </button>
    </div>
  );
};

// Step 2: Payment Transfer
const PaymentTransferModal = ({
  onProceed,
  onClose,
}: {
  onProceed: () => void;
  onClose: () => void;
}) => (
  <div className="relative w-full max-w-md rounded-xl bg-white p-8">
    <h2 className="mb-4 text-lg font-semibold">Transfer ₦335,100.00 to PayAfta</h2>
    <div className="mb-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Bank Name</span>
        <span>Wema Bank</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Account Number</span>
        <span>
          001223344 <button className="ml-2 text-xs text-blue-700">📋</button>
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Amount</span>
        <span>
          ₦335,100.00 <button className="ml-2 text-xs text-blue-700">📋</button>
        </span>
      </div>
    </div>
    <div className="mb-4 rounded bg-red-50 p-2 text-xs text-red-500">
      * This account details provided to you, will be used to verify this transaction.
      <br />* Send exact amount to checkout successfully
    </div>
    <div className="mb-4 text-xs text-gray-500">
      Expires in <span className="text-red-500">24:59 minutes</span>
    </div>
    <button
      className="w-full rounded-full bg-[#E53935] py-2 font-semibold text-white"
      onClick={onProceed}
    >
      I&apos;ve sent the money
    </button>
  </div>
);

// Step 3: Payment Waiting
const PaymentWaitingModal = ({
  onProceed,
  onClose,
}: {
  onProceed: () => void;
  onClose: () => void;
}) => (
  <div className="relative flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8">
    <h2 className="mb-4 text-lg font-semibold">
      Your transfer is on the way, it can take up to a minute to confirm
    </h2>
    <div className="mb-4 flex w-full flex-col items-center">
      <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 w-1/2 rounded-full bg-[#12BA4A]"></div>
      </div>
      <div className="flex w-full justify-between text-xs text-gray-500">
        <span>Sent</span>
        <span>Received</span>
      </div>
    </div>
    <div className="text-xs text-gray-500">
      Please wait for <span className="text-blue-700">19:50 minutes</span>
    </div>
    <button
      className="mt-6 w-full rounded-full bg-[#03045B] py-2 font-semibold text-white"
      onClick={onProceed}
    >
      Continue
    </button>
  </div>
);

// Step 4: Payment Success
const PaymentSuccessModal = ({ onClose }: { onClose: () => void }) => (
  <div className="relative flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8">
    <div className="mb-4">
      <Image
        src="/assets/dashboard/Dashboard/payment-checked.svg"
        alt="payment-checked"
        width={120}
        height={120}
      />
    </div>
    <div className="mb-6 text-center">
      <div className="mb-2 text-lg font-semibold">Payment Successful</div>
      <div className="text-sm text-gray-500">
        Your delivery payment of ₦2,000 has been successfully made
      </div>
    </div>
    <button
      onClick={onClose}
      className="rounded-full bg-[#03045B] px-8 py-2 font-semibold text-white"
    >
      Done
    </button>
  </div>
);

const PaymentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const handleProceed = () => setStep((s) => s + 1);
  const handleReset = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none">
        {step === 1 && <PaymentSummaryModal onProceed={handleProceed} onClose={handleReset} />}
        {step === 2 && <PaymentTransferModal onProceed={handleProceed} onClose={handleReset} />}
        {step === 3 && <PaymentWaitingModal onProceed={handleProceed} onClose={handleReset} />}
        {step === 4 && <PaymentSuccessModal onClose={handleReset} />}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;

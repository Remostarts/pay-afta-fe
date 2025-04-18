'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import RaiseDispute from './RaiseDispute';
import RequestRefund from './RequestRefund';

interface RejectDeliveryProps {
  handleClosed: (e: boolean) => void;
  handleCurrentStepChange: (e: number) => void;
  handleShowRiseDispute: (showRiseDispute: boolean) => void;
  handleIsRequestRefund: (isRequestRefund: boolean) => void;
  currentStepChange: number;
}

export default function RejectDelivery({
  handleClosed,
  handleCurrentStepChange,
  handleShowRiseDispute,
  handleIsRequestRefund,
  currentStepChange,
}: RejectDeliveryProps) {
  const [isShowRiseDispute, setIsShowRiseDispute] = useState<boolean>(false);
  const [isShowRequestRefund, setIsShowRequestRefund] = useState<boolean>(false);

  function handleRiseDispute() {
    setIsShowRiseDispute(true);
  }

  function handleRequestRefund() {
    setIsShowRequestRefund(true);
  }

  return (
    <section>
      {isShowRiseDispute ? (
        <RaiseDispute
          handleClosed={handleClosed}
          handleCurrentStepChange={handleCurrentStepChange}
          handleShowRiseDispute={handleShowRiseDispute}
          currentStepChange={currentStepChange}
        />
      ) : isShowRequestRefund ? (
        <RequestRefund
          handleClosed={handleClosed}
          handleCurrentStepChange={handleCurrentStepChange}
          handleIsRequestRefund={handleIsRequestRefund}
          currentStepChange={currentStepChange}
        />
      ) : (
        <>
          <div className="mb-5">
            <h1 className="font-inter text-xl font-bold text-gray-800">Reject Delivery</h1>
            <p className="font-inter text-gray-600">
              Kindly proceed by raising a dispute or requesting a refund to address your concerns.
            </p>
          </div>
          <div>
            <button
              className="mb-3 flex w-full items-center justify-between rounded-md bg-gray-50 p-2"
              onClick={handleRiseDispute}
            >
              <Image
                src="/assets/dashboard/Transactions/warning-icon.svg"
                alt="Raise a Dispute"
                width={40}
                height={40}
              />
              <span className="font-inter">Raise a Dispute</span>
              <ChevronRight />
            </button>
            <button
              className="-2 mb-3 flex w-full items-center justify-between rounded-md bg-gray-50"
              onClick={handleRequestRefund}
            >
              <Image
                src="/assets/dashboard/Transactions/wallet with cash.svg"
                alt="Raise a Dispute"
                width={40}
                height={40}
              />
              <span className="font-inter">Request Refund</span>
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </section>
  );
}

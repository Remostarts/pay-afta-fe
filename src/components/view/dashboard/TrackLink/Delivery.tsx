'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import RejectDelivery from './RejectDelivery';
import RaiseDispute from './RaiseDispute';

import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UserRole } from './TransactionsSummaryForProduct';

interface DeliveryProps {
  handleCurrentStepChange: (step: number) => void;
  handleShowRiseDispute: (showRiseDispute: boolean) => void;
  handleIsRequestRefund: (isRequestRefund: boolean) => void;
  handleRefundRequested: (refundRequested: boolean) => void;
  currentStepChange: number;
  userRole: UserRole;
  showActions?: boolean;
  handleAcceptDelivery: () => void;
  handleRejectDelivery: () => void;
}

export default function Delivery({
  handleCurrentStepChange,
  handleShowRiseDispute,
  handleIsRequestRefund,
  handleRefundRequested,
  currentStepChange,
  userRole,
  showActions = false,
  handleAcceptDelivery,
  handleRejectDelivery,
}: DeliveryProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAcceptDeliveryLoading, setIsAcceptDeliveryLoading] = useState<boolean>(false);
  const route = useRouter();

  const handleAccept = () => {
    if (userRole !== 'buyer') return;
    handleAcceptDelivery();
    setIsAcceptDeliveryLoading(true);
  };

  const handleReject = () => {
    if (userRole !== 'buyer') return;
    setIsOpen(true);
  };

  const handleRequestRefundFlow = () => {
    setIsOpen(false);
    handleRefundRequested(true);
    // Don't advance step yet, wait for refund process
  };

  if (!showActions) {
    return (
      <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
        <div className="mb-5">
          <h1 className="font-inter text-xl font-bold text-gray-800">
            Have you delivered this order?
          </h1>
          <p className="font-inter text-gray-600">
            Please be informed that the buyer is currently in the process of reviewing the delivered
            product/service. Once you receive the release code from the buyer, please enter it to
            complete the transaction.
          </p>
        </div>
        {userRole === 'seller' && (
          <div className="flex items-center gap-5">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <ReButton
                  className="w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-white"
                  onClick={handleReject}
                >
                  Dispute
                </ReButton>
              </DialogTrigger>
              <DialogContent>
                <RaiseDispute
                  handleClosed={setIsOpen}
                  handleCurrentStepChange={handleCurrentStepChange}
                  handleShowRiseDispute={handleShowRiseDispute}
                  currentStepChange={currentStepChange}
                  userRole={userRole}
                />
              </DialogContent>
            </Dialog>
            <ReButton className="w-2/5 rounded-full">Confirm Delivery</ReButton>
          </div>
        )}
        <p className="mt-4 font-inter text-gray-600">
          Confirm product delivery within <span className="text-green-600">24:00:00</span> hours. If
          no action is taken, the transaction auto-completes.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">
          Is the delivery satisfactory?
        </h1>
        <p className="font-inter text-gray-600">
          Your feedback matters! Take a moment to review the delivery and let us know if you are
          satisfied. If everything looks good, feel free to accept. If not, no worries you can
          easily dispute any issues here.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton
              disabled={isAcceptDeliveryLoading}
              className="w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-white"
              onClick={handleReject}
            >
              Reject
            </ReButton>
          </DialogTrigger>
          <DialogContent>
            <RejectDelivery
              handleClosed={setIsOpen}
              handleCurrentStepChange={handleCurrentStepChange}
              handleShowRiseDispute={handleShowRiseDispute}
              handleIsRequestRefund={handleIsRequestRefund}
              handleRequestRefundFlow={handleRequestRefundFlow}
              currentStepChange={currentStepChange}
              userRole={userRole}
            />
          </DialogContent>
        </Dialog>
        <ReButton
          disabled={isAcceptDeliveryLoading}
          className="w-2/5 rounded-full"
          onClick={handleAccept}
        >
          {isAcceptDeliveryLoading ? 'Accepting...' : 'Accept'}
        </ReButton>
      </div>
      <p className="mt-4 font-inter text-gray-600">
        Confirm product delivery within <span className="text-green-600">24:00:00</span> hours. If
        no action is taken, the transaction auto-completes.
      </p>
    </section>
  );
}

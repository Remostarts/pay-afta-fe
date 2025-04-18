import React, { useState } from 'react';

import RaiseDispute from './RaiseDispute';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MilestoneTransactionProps {
  userType?: 'buyer' | 'seller';
  onDispute?: () => void;
  onReleasePayment?: () => void;
  handleCurrentStepChange?: (step: number) => void;
  handleShowRiseDispute?: () => void;
  currentStepChange?: number;
  handleIsDisputed?: (isDisputed: boolean) => void;
}

function MilestoneTransaction({
  userType = 'buyer',
  onDispute,
  onReleasePayment,
  handleCurrentStepChange,
  currentStepChange,
  handleShowRiseDispute,
  handleIsDisputed,
}: MilestoneTransactionProps) {
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);

  const handleDisputeClick = () => {
    setIsDisputeDialogOpen(true);
  };

  const handleDisputeClose = () => {
    setIsDisputeDialogOpen(false);
  };
  function onConfirmDelivery() {
    if (currentStepChange !== undefined) {
      handleCurrentStepChange?.(currentStepChange + 1);
    }
  }

  return (
    <>
      <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Milestone State</h2>
        <div className="flex flex-col gap-3">
          {userType === 'seller' && (
            <p className="text-sm font-medium text-gray-700">Is the delivery satisfactory?</p>
          )}
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger>
                <ReButton className="flex-1 rounded-full border border-gray-300 bg-white px-20 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                  Dispute
                </ReButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <RaiseDispute
                  handleClosed={handleDisputeClose}
                  handleCurrentStepChange={handleCurrentStepChange || (() => {})}
                  handleShowRiseDispute={handleShowRiseDispute || (() => {})}
                  currentStepChange={currentStepChange || 0}
                  handleIsDisputed={handleIsDisputed || (() => {})}
                />
              </DialogContent>
            </Dialog>
            <ReButton
              onClick={onConfirmDelivery}
              className="flex-1 rounded-full bg-[#000066] px-4 py-2 text-white transition-colors"
            >
              {userType === 'buyer' ? 'Confirm Delivery' : 'Release Payment'}
            </ReButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default MilestoneTransaction;

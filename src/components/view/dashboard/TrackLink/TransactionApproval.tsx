import React, { useState } from 'react';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TransactionApprovalProps {
  showActions?: boolean;
  message?: string;
  onAgree?: () => void;
  onReject?: () => void;
  className?: string;
  handleCurrentStepChange: (step: number) => void;
}

export const TransactionApproval: React.FC<TransactionApprovalProps> = ({
  showActions = false,
  message = 'The buyer/seller has created a payment, Make sure you inspect the details before approving.',
  onAgree,
  onReject,
  className = '',
  handleCurrentStepChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

  const handleConfirmTransaction = () => {
    if (onAgree) {
      onAgree();
    }
    handleCurrentStepChange(2);
    setIsOpen(false);
  };

  if (!showActions) {
    return (
      <div className={`rounded-lg bg-white p-6 shadow-sm ${className}`}>
        <h2 className="mb-2 text-lg font-medium">Awaiting Approval</h2>
        <p className="text-sm text-gray-600">
          Pending confirmation from buyer/seller to agreed-upon descriptions. Await approval for
          transaction to start.
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5 ${className}`}>
      <h2 className="mb-2 text-lg font-medium">Approve Transaction</h2>
      <p className="mb-6 text-sm text-gray-600">{message}</p>
      <div className="flex gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
              Agree to Transaction
            </ReButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Transaction Confirmation</DialogTitle>
            </DialogHeader>
            <PaymentSuccessful label={'Transaction confirmed!'} />
            <DialogFooter>
              <ReButton onClick={handleConfirmTransaction} className="rounded-full">
                Done
              </ReButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ReButton
          onClick={onReject}
          className="w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-white"
        >
          Reject
        </ReButton>
      </div>
    </div>
  );
};

export default TransactionApproval;

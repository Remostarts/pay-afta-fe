'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import PaymentSuccessful from './PaymentSuccessful';

interface TransactionApprovalProps {
  showActions?: boolean;
  message?: string;
  onAgree?: () => void;
  onReject?: () => void;
  className?: string;
  handleCurrentStepChange: (step: number) => void;
  currentStepChange: number;
}

export default function TransactionApproval({
  showActions = false,
  message = 'The buyer/seller has created a payment. Make sure you inspect the details before approving.',
  onAgree,
  onReject,
  className = '',
  handleCurrentStepChange,
  currentStepChange,
}: TransactionApprovalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Open dialog when user accepts
  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

  // Handle Done click with loading state
  const handleConfirmTransaction = async () => {
    try {
      setIsLoading(true);

      // Simulate async or real confirmation logic
      if (onAgree) await Promise.resolve(onAgree());
      handleCurrentStepChange(currentStepChange + 1);

      // Small UX delay for smoother feedback
      setTimeout(() => {
        setIsOpen(false);
      }, 600);
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // UI when actions are hidden
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

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* APPROVE BUTTON + DIALOG */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton className="rounded-full md:w-2/5" onClick={handleAcceptOrder}>
              Agree to Transaction
            </ReButton>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Order Confirmation</DialogTitle>
            </DialogHeader>

            {/* SUCCESS SCREEN */}
            <PaymentSuccessful label="Order Created!" />

            <DialogFooter>
              <ReButton
                onClick={handleConfirmTransaction}
                disabled={isLoading}
                className={`rounded-full flex items-center justify-center gap-2 transition-all duration-300
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Done'
                )}
              </ReButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* REJECT BUTTON */}
        <ReButton
          onClick={onReject}
          className="w-full sm:w-2/5 rounded-full border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-gray-50 transition-all duration-300"
        >
          Reject
        </ReButton>
      </div>
    </div>
  );
}

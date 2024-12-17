'use client';

import Image from 'next/image';
import { useState } from 'react';

import CreateVirtualCard from './CreateVirtualCard';
import ConfirmPaymentModal from './ConfirmPaymentModal';
import SuccessConfirmation from './SuccessConfirmation';

import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function CardDetails() {
  const [dialogStep, setDialogStep] = useState<'create' | 'confirm' | 'success'>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fundAmount, setFundAmount] = useState('');
  const [isVirtualCardOpen, setIsVirtualCardOpen] = useState(true);

  const handleNextStep = (amount: string) => {
    setFundAmount(amount);
    setDialogStep('confirm');
    setIsVirtualCardOpen(false);
  };

  const handleConfirmPayment = () => {
    setDialogStep('success');
  };

  const resetDialog = () => {
    setIsOpen(false);
  };

  console.log(fundAmount);

  return (
    <section className="rounded-lg border-2 border-gray-200 p-4">
      <div className="flex flex-col items-center">
        <div className="relative h-40 w-64">
          <Image
            src="/assets/dashboard/VirtualCard/virtual-card.svg"
            alt="virtual card"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Dialog open={isOpen}>
          <DialogTrigger asChild>
            <ReButton className="mt-4 rounded-full px-6 py-2" onClick={() => setIsOpen(true)}>
              Create Card
            </ReButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {isVirtualCardOpen && <CreateVirtualCard onNext={handleNextStep} />}
            {dialogStep === 'confirm' && (
              <ConfirmPaymentModal amount={fundAmount} onConfirm={handleConfirmPayment} />
            )}
            {dialogStep === 'success' && <SuccessConfirmation onClose={resetDialog} />}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

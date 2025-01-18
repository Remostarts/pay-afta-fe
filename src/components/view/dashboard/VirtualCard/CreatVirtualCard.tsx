'use client';

import Image from 'next/image';
import { useState } from 'react';

import AddMoneyModal from './AddMoneyModal';
import ConfirmPaymentModal from './ConfirmPaymentModal';
import SuccessConfirmation from './SuccessConfirmation';
import TransactionPinModal from './TransactionPinModal';

import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReDialog } from '@/components/re-ui/ReDialog';
import { useDialog } from '@/hooks/useDialog';

export default function CreatVirtualCard() {
  const [fundAmount, setFundAmount] = useState('');

  const { currentStep, nextStep } = useDialog(1, 4);

  const renderDialogContent = () => {
    switch (currentStep) {
      case 1:
        return <AddMoneyModal handleCurrentDialogStep={nextStep} />;
      case 2:
        return <ConfirmPaymentModal handleCurrentDialogStep={nextStep} />;
      case 3:
        return <TransactionPinModal handleCurrentDialogStep={nextStep} />;
      case 4:
        return (
          <SuccessConfirmation
            handleCurrentDialogStep={nextStep}
            lable="Card Created"
            description="Your virtual card is now active."
          />
        );
      default:
        return null;
    }
  };

  // console.log(fundAmount);

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
        <ReDialog
          btnLabel={'Create Card'}
          classNames="mt-4 w-3/5 rounded-full px-6 py-2 text-white"
          DialogComponent={renderDialogContent}
        />
      </div>
    </section>
  );
}

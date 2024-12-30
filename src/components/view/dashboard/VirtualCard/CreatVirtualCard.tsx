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

const DialogSteps = {
  Step1: 1,
  Step2: 2,
  Step3: 3,
  Step4: 4,
};

export default function CreatVirtualCard() {
  const [currentDialogStep, setcurrentDialogStep] = useState<number>(DialogSteps.Step1);
  const [fundAmount, setFundAmount] = useState('');

  // console.log(fundAmount);

  const Steps = {
    [DialogSteps.Step1]: AddMoneyModal,
    [DialogSteps.Step2]: ConfirmPaymentModal,
    [DialogSteps.Step3]: TransactionPinModal,
    [DialogSteps.Step4]: SuccessConfirmation,
  };

  const CurrentDialogComponent = Steps[currentDialogStep];
  const isLastDialogStep = currentDialogStep === DialogSteps.Step4;

  function handleCurrentDialogStep(data: string = '') {
    setcurrentDialogStep((prev) => (prev === 4 ? 1 : prev + 1));
    setFundAmount(data);
  }

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
          btnLable="Create Card"
          classNames="mt-4 w-3/5 rounded-full px-6 py-2 text-white"
          DialogComponent={(props) => (
            <CurrentDialogComponent
              {...props}
              handleCurrentDialogStep={handleCurrentDialogStep}
              lable="Card Created"
              description="Your virtual card is now active."
            />
          )}
        />
      </div>
    </section>
  );
}

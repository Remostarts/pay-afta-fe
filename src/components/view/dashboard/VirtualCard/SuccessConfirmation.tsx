import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { ReButton } from '@/components/re-ui/ReButton';
import { DialogClose } from '@/components/ui/dialog';

interface ISuccessConfirmationProps {
  handleCurrentDialogStep(data?: string): void;
  lable: string;
  description: string;
}

export default function SuccessConfirmation({
  handleCurrentDialogStep,
  lable,
  description,
}: ISuccessConfirmationProps) {
  return (
    <div className="flex max-w-md flex-col items-center justify-center rounded-lg bg-white p-6 text-center">
      <Image
        src="/assets/dashboard/VirtualCard/checked.svg"
        alt="checked"
        width={120}
        height={120}
      />
      <h2 className="mb-4 text-2xl font-semibold text-[#333333]">{lable}</h2>
      <p className="mb-6 text-[#666666]">{description}</p>
      <DialogClose asChild>
        <ReButton
          className="w-3/5 rounded-full bg-[#1A1A1A] font-inter text-white hover:bg-[#1A1A1A]"
          onClick={() => handleCurrentDialogStep()}
        >
          Done
        </ReButton>
      </DialogClose>
    </div>
  );
}

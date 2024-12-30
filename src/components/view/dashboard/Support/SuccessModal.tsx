import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SuccessModalProps {
  setCurrentComponentStep: Dispatch<SetStateAction<number>>;
}

export default function SuccessModal({ setCurrentComponentStep }: SuccessModalProps) {
  return (
    <section className="flex flex-col items-center justify-center">
      <Image src="/assets/dashboard/Support/checked.svg" alt="checked" width={120} height={120} />
      <ReHeading heading="Message Sent" size={'2xl'} className="font-semibold" />
      <p className="text-center text-gray-500">
        Your message has been sent! Keep an eye on your email for valuable feedback from our
        dedicated representative.
      </p>
      <DialogClose asChild>
        <ReButton
          className="mt-14 w-[30%] rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]"
          onClick={() => setCurrentComponentStep(1)}
        >
          Done
        </ReButton>
      </DialogClose>
    </section>
  );
}

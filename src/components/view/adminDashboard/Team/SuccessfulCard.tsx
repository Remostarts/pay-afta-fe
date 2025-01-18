import Image from 'next/image';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { DialogClose } from '@/components/ui/dialog';

type ISuccessfulCard = {
  onClosed: () => void;
  heading: string;
  desc: string;
};

export default function SuccessfulCard({ onClosed, heading, desc }: ISuccessfulCard) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div>
        <Image
          src="/assets/admin-dashboard/team/checked.svg"
          alt="checked"
          width={302}
          height={180}
        />
      </div>
      <div>
        <ReHeading heading={heading} className="flex items-center justify-center" />
        <p className="text-center font-inter">{desc}</p>
      </div>
      <DialogClose asChild>
        <div>
          <ReButton className="mt-5 bg-[#1F7EAD] hover:bg-[#1F7EAD]" onClick={() => onClosed()}>
            Continue
          </ReButton>
        </div>
      </DialogClose>
    </section>
  );
}

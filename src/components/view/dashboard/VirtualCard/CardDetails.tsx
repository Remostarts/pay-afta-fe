import Image from 'next/image';

import { ReButton } from '@/components/re-ui/ReButton';

export default function CardDetails() {
  return (
    <section className="rounded-lg border-2 border-gray-200 p-24">
      <div>
        <div>
          <Image
            src="/assets/dashboard/VirtualCard/virtual-card.svg"
            alt="virtual card"
            width={200}
            height={200}
          />
        </div>
        <div>
          <ReButton className=" mt-4 rounded-full">Create Card</ReButton>
        </div>
      </div>
    </section>
  );
}

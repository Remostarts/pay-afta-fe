import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';
import Image from 'next/image';

export default function DisputeOverlay({ handleDone }: { handleDone: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center space-y-4">
      <Image alt="dispute" src="/assets/dashboard/Chats/dispute-svg.svg" width={100} height={100} />
      <ReHeading heading="Dispute Submitted" />
      <p className="text-center text-gray-600">
        Check your email for a prompt reply. 📧 Stay tuned as we provide you with the information
        you need. 📨
      </p>
      <ReButton
        className="rounded-full bg-[#D42620] text-white hover:bg-[#D42620]"
        onClick={handleDone}
      >
        Done
      </ReButton>
    </section>
  );
}

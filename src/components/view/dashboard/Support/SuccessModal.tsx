import { ReHeading } from '@/components/re-ui/ReHeading';

export default function SuccessModal() {
  return (
    <section>
      <ReHeading heading="Message Sent" size={'2xl'} />
      <p className="text-gray-500">
        Your message has been sent! Keep an eye on your email for valuable feedback from our
        dedicated representative.
      </p>
    </section>
  );
}

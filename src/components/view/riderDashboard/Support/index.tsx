import ContactUs from './ContactUs';
import Faqs from './Faq';

import { ReHeading } from '@/components/re-ui/ReHeading';

export default function Support() {
  return (
    <section className="rounded-lg bg-white p-4">
      <ReHeading heading="Support" className="mb-4 text-xl font-semibold" />
      <p className=" text-gray-500">
        Elevate your experience with dedicated support and helpful resources.
      </p>
      <div className="md:flex md:items-center md:justify-between">
        <Faqs />
        <ContactUs />
      </div>
    </section>
  );
}

import ContactUs from './ContactUs';
import Faqs from './Faq';
import { ReHeading } from '@/components/re-ui/ReHeading';

export default function Support() {
  return (
    <section className="rounded-lg bg-white dark:bg-gray-900 p-5 sm:p-6 md:p-8 shadow-sm transition-shadow">
      {/* Header */}
      <div className="mb-5">
        <ReHeading
          heading="Support"
          className="mb-2 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100"
        />
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Elevate your experience with dedicated support and helpful resources.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10">
        <div className="flex-1">
          <Faqs />
        </div>
        <div className="flex-1">
          <ContactUs />
        </div>
      </div>
    </section>
  );
}

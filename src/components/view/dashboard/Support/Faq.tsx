'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Faq } from '@/constants/dashboard/support/faq';
import { ReHeading } from '@/components/re-ui/ReHeading';

export default function Faqs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <section className="relative mt-8 w-full rounded-md border border-gray-200 bg-white p-4 sm:p-5 font-inter md:mt-20">
      <div className="md:px-2">
        <ReHeading heading="Frequently Asked Questions" size="2xl" className="text-gray-900" />

        <div className="mt-6 space-y-4">
          {Faq.map((faqItem, index) => {
            const isOpen = expandedIndex === index;

            return (
              <div key={faqItem.id} className="border-b border-gray-100 last:border-none pb-3">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 py-1 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-medium text-gray-800 pr-4">
                    {faqItem.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={18}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-sm sm:text-base text-gray-600 pl-1 leading-relaxed"
                    >
                      {faqItem.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

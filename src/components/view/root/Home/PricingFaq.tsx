'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PricingFaq as PricingFaqData } from '@/constants/root/pricingfaq';
import Link from 'next/link';

export default function PricingFaq() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const isListItem = (text: string) => {
    return (
      text.trim().startsWith('•') || /^[a-zA-Z]\./.test(text.trim()) || /^\d+\./.test(text.trim())
    );
  };

  return (
    <div className="container relative mx-auto mt-8 box-border w-full max-w-[1440px] text-left font-inter md:mt-20">
      <div className="flex flex-col gap-8 px-4 sm:px-6 md:flex-row md:justify-between lg:px-8 xl:px-20">
        {/* Header */}
        <div className="flex flex-col items-start justify-start gap-4 md:max-w-[480px] md:gap-6 lg:max-w-[580px]">
          <div className="flex flex-col items-start justify-start gap-1 self-stretch">
            <h1 className="text-gray font-playfair text-4xl font-semibold text-[#03045B] md:text-6xl lg:text-8xl">
              FAQs
            </h1>
          </div>
          <div className="text-black-700 mb-6 w-full font-inter text-sm leading-[140%] tracking-[-0.01em] md:mb-0 md:text-base">
            <span className="font-inter">Got questions about PayAfta? We've got answers.</span>

            <div className="bg-[#F8F8F8] rounded-xl mt-3 flex-col items-center justify-evenly p-10">
              <p className="font-inter font-bold text-center">Still have questions?</p>
              <p className="font-inter text-center">Need custom pricing for your business?</p>
              <Link
                href="/support"
                className="bg-[#03045B] mt-3 text-white font-semibold font-inter px-6 py-3 rounded-full inline-flex items-center gap-2 transition hover:bg-[#020345]"
              >
                Email Sales or call +234 XXX XXXX.
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="mt-6 w-full space-y-4 md:mt-0 md:max-w-[480px] lg:max-w-[580px]">
          {PricingFaqData.map((questionItem, index) => (
            <div key={questionItem.id} className="border-black-100 border-b pb-4">
              <button
                className="group flex w-full items-center justify-between px-1 text-left"
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              >
                <span className="pr-8 text-sm font-medium md:text-base">
                  {questionItem.question}
                </span>
                <ChevronDown
                  className={`shrink-0 transition-transform duration-200 ${
                    expandedQuestion === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedQuestion === index && (
                <div className="mt-2 px-1 text-sm text-gray-600 md:text-base space-y-2">
                  {questionItem.answer.map((line, idx) =>
                    isListItem(line) ? (
                      <li key={idx} className="ml-4 list-disc">
                        {line.replace(/^•\s*/, '')}
                      </li>
                    ) : (
                      <p key={idx}>{line}</p>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

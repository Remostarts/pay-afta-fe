'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Faq } from '@/constants/root/faq';

export default function Faqs() {
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
            <span className="font-inter font-bold">(Frequently Asked Questions)</span> <br />
            Got questions about PayAfta? We've got answers. Check out our frequently asked questions
            to find information about using PayAfta for your online transactions. If you don't find
            the answer you're looking for, feel free to reach out to our support team. We're here to
            assist you.
          </div>
        </div>

        {/* FAQ List */}
        <div className="mt-6 w-full space-y-4 md:mt-0 md:max-w-[480px] lg:max-w-[580px]">
          {Faq.map((questionItem, index) => (
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

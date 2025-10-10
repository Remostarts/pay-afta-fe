'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Faq } from '@/constants/root/faq';

export default function Faqs() {
  const [activeButton, setActiveButton] = useState(1);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const isListItem = (text: string) => {
    return (
      text.trim().startsWith('•') || /^[a-zA-Z]\./.test(text.trim()) || /^\d+\./.test(text.trim())
    );
  };

  return (
    <>
      <div className="container relative mx-auto box-border w-full max-w-[1440px] text-left font-inter">
        {/* Container with responsive padding and layout */}
        <div className="flex flex-col gap-8 px-4 sm:px-6 md:flex-row md:justify-between">
          {/* Questions */}
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
    </>
  );
}

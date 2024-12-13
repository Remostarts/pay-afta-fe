'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Faq } from '@/constants/dashboard/support/faq';

export default function Faqs() {
  const [activeButton, setActiveButton] = useState(1);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  // console.log(activeButton);

  return (
    <>
      <div className="container relative mx-auto mt-8 box-border w-full text-left font-inter md:mt-20">
        {/* Container with responsive padding and layout */}
        <div className=" md:px-20">
          {/* Header Section */}
          <h1 className="text-gray text-center font-inter text-4xl font-semibold ">
            Frequently Asked Questions
          </h1>

          {/* Questions */}
          <div className="mt-6 space-y-4">
            {Faq?.map((questionItem, index) => (
              <div key={questionItem?.id} className="border-black-100 border-b pb-4">
                <button
                  className="flex w-full items-center justify-between px-1 text-left"
                  onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                >
                  <span className=" pr-8 text-sm font-medium md:text-base">
                    {questionItem?.question}
                  </span>
                  <ChevronDown />
                </button>
                {expandedQuestion === index && (
                  <p className="mt-2 px-1 text-sm text-gray-600 md:text-base">
                    {questionItem?.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

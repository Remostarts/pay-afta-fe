'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Faq } from '@/constants/root/faq';

export default function Faqs() {
  const [activeButton, setActiveButton] = useState(1);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  // console.log(activeButton);

  return (
    <>
      <div className="container relative mx-auto mt-8 box-border w-full text-left font-inter md:mt-20">
        {/* Container with responsive padding and layout */}
        <div className="flex flex-col px-4 md:flex-row md:gap-80 md:px-20">
          {/* Header Section */}
          <div className="flex flex-col items-start justify-start gap-4 md:gap-6">
            <div className="flex flex-col items-start justify-start gap-1 self-stretch">
              <div className="flex flex-row items-center gap-2.5 rounded-[50px] px-4 py-2"></div>
              <h1 className="text-gray font-playfair text-4xl font-semibold text-[#03045B] md:text-8xl ">
                FAQs
              </h1>
            </div>
            <div className="text-black-700 mb-6 font-inter text-sm leading-[140%] tracking-[-0.01em] md:mb-0 md:w-[480px] md:text-base">
              <span className="font-inter font-bold ">(Frequently Asked Questions)</span> <br />
              Got questions about Payafta? We&apos;ve got answers. Check out our frequently asked
              questions to find information about using Payafta for your online transactions. If you
              don&apos;t find the answer you&apos;re looking for, feel free to reach out to our
              support team. We&apos;re here to assist you.
            </div>
          </div>

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

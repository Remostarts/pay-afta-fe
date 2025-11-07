'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import GetInTouch from './GetInTouch';
import SuccessModal from './SuccessModal';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ContactUs() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleConfirmTransaction = () => setCurrentStep(2);
  const handleResetModal = () => setCurrentStep(1);

  return (
    <section className="mt-3 flex w-full items-center justify-center">
      <div className="mt-6 w-full rounded-md border border-gray-200 bg-[#F2F2F2] p-4 sm:p-5 sm:w-[400px]">
        {/* Title */}
        <div className="text-center space-y-2 mb-3">
          <h1 className="font-inter text-2xl font-semibold text-gray-900">Having Trouble?</h1>
          <p className="font-inter text-gray-500 text-sm sm:text-base leading-relaxed">
            Explore common issues below or select &apos;Other&apos; for personalized assistance.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 sm:space-y-4 mb-6">
          <div>
            <ReHeading heading="Email" size="base" />
            <p className="font-inter text-gray-700 text-sm sm:text-base pl-1">
              contact@getpayafta.com
            </p>
          </div>
          <div>
            <ReHeading heading="Phone" size="base" />
            <p className="font-inter text-gray-700 text-sm sm:text-base pl-1">+234 805 512 1522</p>
          </div>
        </div>

        {/* Button + Modal */}
        <div className="grid place-items-center">
          <Dialog onOpenChange={(open) => open || handleResetModal()}>
            <DialogTrigger asChild>
              <ReButton className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-5 hover:bg-[#02033f] transition-all duration-200">
                Contact Us
                <ChevronRight size={20} className="ml-2" />
              </ReButton>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] rounded-xl">
              {currentStep === 1 && (
                <GetInTouch handleConfirmTransaction={handleConfirmTransaction} />
              )}
              {currentStep === 2 && <SuccessModal setCurrentComponentStep={setCurrentStep} />}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

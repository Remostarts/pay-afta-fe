'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import GetInTouch from './GetInTouch';
import SuccessModal from './SuccessModal';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponentStep, setCurrentComponentStep] = useState<number>(1);

  const handleConfirmTransaction = () => {
    setCurrentComponentStep(currentComponentStep + 1);
  };

  return (
    <section className="mt-3 flex w-full items-center justify-center">
      <div className="mt-6 w-full rounded-md border border-gray-200 bg-[#F2F2F2] p-3 sm:w-[400px]">
        {/* <ReHeading heading="Having Trouble?" size={'2xl'} className="text-center" /> */}
        <h1 className="p-2 text-center font-inter text-2xl font-semibold">Having Trouble?</h1>
        <p className="p-2 text-center font-inter text-gray-500">
          Explore common issues below or select &apos;Other&apos; for personalized assistance.
        </p>
        <div>
          <ReHeading heading="Email" size={'base'} />
          <p className=" p-2 font-inter text-gray-600">contact@getpayafta.com</p>
        </div>
        <div>
          <ReHeading heading="Phone" size={'base'} />
          <p className=" p-2 font-inter text-gray-600">+2348055121522</p>
        </div>
        <div className="grid place-items-center pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <ReButton className="m:text-lg w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-5">
                Contact Us <ChevronRight size={20} />
              </ReButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[481px]">
              {currentComponentStep === 1 && (
                <GetInTouch handleConfirmTransaction={handleConfirmTransaction} />
              )}
              {currentComponentStep === 2 && (
                <SuccessModal setCurrentComponentStep={setCurrentComponentStep} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

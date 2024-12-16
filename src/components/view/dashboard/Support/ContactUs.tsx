'use client';
import { useState } from 'react';

import GetInTouch from './GetInTouch';
import SuccessModal from './SuccessModal';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<'getInTouch' | 'successful'>(
    'getInTouch'
  );

  const [formData, setformData] = useState<null>(null);

  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

  const handleConfirmTransaction = (isValid: boolean, data?: any) => {
    if (currentComponent === 'getInTouch') {
      if (isValid) {
        console.log(data);
        setCurrentComponent('successful');
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <section className="mt-3 flex w-full items-center justify-center">
      <div className="mt-6 rounded-md bg-white p-3 shadow-md">
        <ReHeading heading="Having Trouble?" size={'2xl'} />
        <p className="text-gray-500">
          Explore common issues below or select &apos;Other&apos; for personalized assistance.
        </p>
        <div>
          <ReHeading heading="Email" size={'base'} />
          <ReInput name="email" placeholder="Support@payafta.com" readonly />
        </div>
        <div>
          <ReHeading heading="Phone" size={'base'} />
          <ReInput name="phone" placeholder="0487985444" readonly />
        </div>
        <div className="grid place-items-center pt-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <ReButton className="m:text-lg w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-5">
                Contact Us
              </ReButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {currentComponent === 'getInTouch' ? <GetInTouch /> : <SuccessModal />}
              {/* <DialogFooter>
                <ReButton className="rounded-full">
                  {currentComponent === 'getInTouch' ? 'Submit' : 'Done'}
                </ReButton>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { addToWhitelist } from '@/lib/actions/auth/utils.actions';
import { type TWhiteList, whiteListSchema } from '@/lib/validations/Utils';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';

const defaultValues = {
  name: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  location: '',
};

interface WaitlistProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Waitlist({ open, onOpenChange }: WaitlistProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsModalOpen(open);
    }
  }, [open]);

  const handleOpenChange = (value: boolean) => {
    setIsModalOpen(value);
    onOpenChange?.(value);
  };

  const form = useForm<TWhiteList>({
    resolver: zodResolver(whiteListSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: TWhiteList) => {
    console.log(data);
    const result = await addToWhitelist(data);
    console.log('onSubmit', result);
    if (result?.result === 'success') {
      setIsModalOpen(false);
      toast.success('Congratulations! You have been added to the waitlist');
      form.reset();
    } else {
      toast.error('Sorry, Try again.');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent
        className="
          max-w-[95vw] sm:max-w-full max-h-[95vh]
          p-3 sm:p-5 border-0 bg-[#03045B] overflow-y-auto
          lg:max-w-none lg:w-screen lg:h-screen lg:max-h-none lg:rounded-3xl
        "
      >
        <DialogClose asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 top-3 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DialogClose>
   
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
          {/* Left side - Form */}
          <div className="flex-1 order-2 lg:order-1 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white font-playfair mb-2 text-center lg:text-left">
              Join Our Waitlist
            </h1>
            <p className="text-white mb-6 sm:mb-8 text-base sm:text-lg md:text-xl lg:text-2xl font-inter text-center lg:text-left">
              Be among the first to use PayAfta, get Early access with instant updates.
            </p>
            <div className="w-full max-w-2xl mx-auto lg:mx-0">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6 bg-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg"
                >
                  {/* First Name and Last Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <ReHeading
                        heading="First name"
                        size="base"
                        className="text-gray-700 text-sm sm:text-base"
                      />
                      <ReInput name="firstName" />
                    </div>
                    <div>
                      <ReHeading
                        heading="Last name"
                        size="base"
                        className="text-gray-700 text-sm sm:text-base"
                      />
                      <ReInput name="lastName" />
                    </div>
                  </div>
                  <div>
                    <ReHeading
                      heading="Email"
                      size="base"
                      className="text-gray-700 text-sm sm:text-base"
                    />
                    <ReInput name="email" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <RePhoneNumberInput name="phoneNumber" />
                    </div>
                    <div>
                      <ReHeading
                        heading="Location"
                        size="base"
                        className="text-gray-700 text-sm sm:text-base"
                      />
                      <ReInput name="location" />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#03045B] rounded-full text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Getting Early Access...' : 'Get Early Access'}
                  </button>
                </form>
              </Form>
            </div>
          </div>

          {/* Right side - Hero image and content */}
          <div className="flex-1 order-1 lg:order-2 mb-4 lg:mb-0 w-full flex relative">
            <div className="relative w-full flex items-center justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <Image
                  alt="waitlist"
                  src="/assets/root/home/waitlist.png"
                  width={668}
                  height={634}
                  className="w-full h-auto object-contain mt-7"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

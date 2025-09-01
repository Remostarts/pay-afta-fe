'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
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
import { TWhiteList, whiteListSchema } from '@/lib/validations/Utils';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';

const defaultValues = {
  name: '',
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
      toast.success(' Congratulations! You have been added to the waitlist');
    } else {
      toast.error('Sorry, Try again.');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-5 border-0 bg-[#03045B]">
        <DialogHeader>
          <DialogTitle>
            <span className="sr-only">Join Our Waitlist</span>
          </DialogTitle>
        </DialogHeader>
        <div className="relative grid grid-cols-1 sm:grid-cols-2">
          {/* Left side - Form */}
          <div className="flex-1">
            <div className="max-w-sm">
              <h1 className="text-5xl font-bold text-white font-playfair mb-2">
                Join Our Waitlist
              </h1>
              <p className="text-white mb-8">
                Be among the first to use PayAfta, get Early access with instant updates.
              </p>

              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 bg-white px-6 py-3 rounded-lg"
                >
                  {/* First Name and Last Name row */}
                  <div>
                    <ReHeading heading="Full Name" size="base" className="text-gray-700" />
                    <ReInput name="name" />
                  </div>
                  <div>
                    <ReHeading heading="Email" size="base" className="text-gray-700" />
                    <ReInput name="email" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <RePhoneNumberInput name="phoneNumber" />
                    </div>
                    <div>
                      <ReHeading heading="Location" size="base" className="text-gray-700" />
                      <ReInput name="location" />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#03045B] rounded-full text-white font-semibold py-4 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Getting Early Access...' : 'Get Early Access'}
                  </button>
                </form>
              </Form>
            </div>
          </div>

          {/* Right side - Hero image and content */}
          <div className="flex-1 hidden sm:flex relative">
            {/* Main image area */}
            <div className="relative h-full flex items-center justify-center">
              <Image alt="waitlist" src="/assets/root/home/waitlist.png" width={668} height={634} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

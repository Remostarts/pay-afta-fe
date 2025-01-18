'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

const defaultValues = {
  name: '',
  email: '',
};

export function Waitlist() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mt-3 space-y-4">
              <div>
                <ReHeading heading="Full Name" />
                <ReInput name="name" />
              </div>
              <div>
                <ReHeading heading="Email" size="lg" />
                <ReInput name="email" />
              </div>
            </div>

            <div className="grid place-items-center pt-2">
              <ReButton
                className="w-full rounded-xl py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
                type="submit"
                isSubmitting={isSubmitting}
              >
                Join
              </ReButton>
            </div>
          </form>
        </Form>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

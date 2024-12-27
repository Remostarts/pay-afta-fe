'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import { ReButton } from '@/components/re-ui/ReButton';
import { TDisputeForm, disputeFormSchema } from '@/lib/validations/chats.validation';
import { Form } from '@/components/ui/form';
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const defaultValues = {
  category: '',
  description: '',
};

function DisputeService() {
  const [open, setOpen] = useState(false);
  const form = useForm<TDisputeForm>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;

  const { isSubmitting } = formState;

  const onSubmit = async (data: TDisputeForm) => {
    form.reset();
    console.log('🌼 🔥🔥 onSubmit 🔥🔥 data🌼', data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex-1 text-primary-500 hover:bg-primary-100">
          <CircleAlert className="mr-2" /> Dispute service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span>
              <AlertCircle className="mr-2 text-primary-500" />
            </span>{' '}
            Dispute services
          </DialogTitle>
        </DialogHeader>

        {/* dispute service form  */}
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <ReSelect
                  name="category"
                  label="Select a category"
                  options={[
                    { value: 'lorem', label: ' Lorem ipsum dolor sit amet' },
                    {
                      value: 'lorem1',
                      label: ' Lorem ipsum dolor sit amet',
                    },
                    { value: 'others', label: 'Others' },
                  ]}
                />
              </div>

              <div>
                <ReTextarea name="description" label="Enter Description" />
              </div>

              <div>
                <ReButton type="submit" className="mt-4 text-white" disabled={isSubmitting}>
                  Submit
                </ReButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DisputeService;

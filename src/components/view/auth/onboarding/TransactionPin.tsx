import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import RePin from '../../../re-ui/RePin';

import { Form } from '@/components/ui/form';

const pinSchema = z
  .object({
    pin: z.string().length(4, 'PIN must be 4 digits'),
    confirmPin: z.string().length(4, 'PIN must be 4 digits'),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  });

type PinFormData = z.infer<typeof pinSchema>;

interface TransactionPinProps {
  onComplete: (pin: string) => void;
  manageCurrentStep?: () => void;
}

export default function TransactionPin({ onComplete, manageCurrentStep }: TransactionPinProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const handleSubmit = async (data: PinFormData) => {
    try {
      // setIsSubmitting(true);
      // onComplete(data.pin);
      console.log(data);
      if (manageCurrentStep) {
        manageCurrentStep();
      }
    } catch (error) {
      console.error('Error submitting PIN:', error);
      form.setError('root', {
        message: 'An error occurred while setting your PIN. Please try again.',
      });
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-center">
          <h1 className="font-inter text-3xl font-semibold text-gray-800">Transaction PIN</h1>

          <div className="mt-8">
            <p className="mb-4 font-inter text-xl font-semibold">Enter PIN</p>
            <RePin
              count={4}
              name="pin"
              onChange={(value) => form.setValue('pin', value)}
              error={!!form.formState.errors.pin}
              className="mb-2"
            />
            {form.formState.errors.pin && (
              <p className="text-sm text-red-500">{form.formState.errors.pin.message}</p>
            )}
          </div>

          <div className="mt-6">
            <p className="mb-4 font-inter text-xl font-semibold">Confirm PIN</p>
            <RePin
              count={4}
              name="confirmPin"
              onChange={(value) => form.setValue('confirmPin', value)}
              error={!!form.formState.errors.confirmPin}
              className="mb-2"
            />
            {form.formState.errors.confirmPin && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPin.message}</p>
            )}
          </div>
        </div>

        {form.formState.errors.root && (
          <p className="text-center text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-2/5 rounded-full bg-[#03045B] py-3 font-inter text-white transition-all duration-200 
              hover:bg-[#02034d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Setting PIN...' : 'Submit'}
          </button>
        </div>
      </form>
    </Form>
  );
}

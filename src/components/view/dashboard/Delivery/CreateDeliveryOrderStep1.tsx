'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import {
  DeliveryOrderStep1Input,
  deliveryOrderStep1Schema,
} from '@/lib/validations/delivery-order';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';

interface CreateDeliveryOrderStep1Props {
  onProceed: (data: DeliveryOrderStep1Input) => void;
  onBack: () => void;
  onClose: () => void;
}

const partners = [
  { name: 'SendBox', price: '₦ 30 / Mile' },
  { name: 'Kwik', price: '₦ 30 / Mile' },
  { name: 'Nipost EMS', price: '₦ 30 / Mile' },
] as const;

function CreateDeliveryOrderStep1({ onProceed, onBack, onClose }: CreateDeliveryOrderStep1Props) {
  const form = useForm<DeliveryOrderStep1Input>({
    resolver: zodResolver(deliveryOrderStep1Schema),
    defaultValues: {
      pickupLocation: '',
      dropOffLocation: '',
      deliveryPartner: 'SendBox',
    },
  });

  const { handleSubmit, formState, watch, setValue } = form;

  const { isSubmitting, errors } = formState;
  const selectedPartner = watch('deliveryPartner');

  const onSubmit = (data: DeliveryOrderStep1Input) => {
    console.log(data);
    onProceed(data);
  };

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <ReHeading heading="Create Delivery Order" size="2xl" />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4">
            <ReHeading heading="Pickup Location" size="base" />
            <ReInput name="pickupLocation" />
          </div>
          <div className="mb-4">
            <ReHeading heading="Drop-off Location" size="base" />
            <ReInput name="dropOffLocation" />
          </div>
          <div className="mb-6">
            <ReHeading heading="Choose Delivery Partner" size="base" />
            <div className="space-y-4 mt-2">
              {partners.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${
                    selectedPartner === p.name ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setValue('deliveryPartner', p.name)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border ${
                        selectedPartner === p.name ? 'border-[#12BA4A]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPartner === p.name && (
                        <span className="block size-3 rounded-full bg-[#12BA4A]" />
                      )}
                    </span>
                    <span>{p.name}</span>
                  </div>
                  <span className="text-sm">{p.price}</span>
                </button>
              ))}
            </div>
            {errors.deliveryPartner && (
              <p className="mt-1 text-sm text-red-500">{errors.deliveryPartner.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 rounded-full border border-[#03045B] py-2 font-semibold text-[#03045B]"
              onClick={onBack}
            >
              Cancel
            </button>
            <ReButton
              type="submit"
              className="w-1/2 rounded-full bg-[#03045B] py-2 font-semibold text-white"
              isSubmitting={isSubmitting}
            >
              Proceed
            </ReButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateDeliveryOrderStep1;

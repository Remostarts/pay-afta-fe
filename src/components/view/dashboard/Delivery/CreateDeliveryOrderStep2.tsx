'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ReHeading } from '@/components/re-ui/ReHeading';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import {
  DeliveryOrderStep2Input,
  deliveryOrderStep2Schema,
} from '@/lib/validations/delivery-order';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';

interface CreateDeliveryOrderStep2Props {
  onBack: () => void;
  onProceedToPayment: (data: DeliveryOrderStep2Input) => void;
}

function CreateDeliveryOrderStep2({ onBack, onProceedToPayment }: CreateDeliveryOrderStep2Props) {
  const form = useForm<DeliveryOrderStep2Input>({
    resolver: zodResolver(deliveryOrderStep2Schema),
    defaultValues: {
      pickupOption: 'Seller Door Pick-up',
      paymentMethod: 'Pay Now',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: DeliveryOrderStep2Input) => {
    console.log(data);
    onProceedToPayment(data);
  };

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <ReHeading heading="Create Delivery Order" size="2xl" />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex gap-4 mt-3">
            <div className="flex-1">
              <ReHeading heading="Pick-up Options" size="base" />
              <ReRadioGroup
                name="pickupOption"
                options={[
                  { label: 'Seller Door Pick-up', value: 'Seller Door Pick-up' },
                  { label: 'Seller Drop-off', value: 'Seller Drop-off' },
                ]}
              />
              {errors.pickupOption && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupOption.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <ReHeading heading="Payment Method" size="base" />
              <ReRadioGroup
                name="paymentMethod"
                options={[
                  { label: 'Pay Now', value: 'Pay Now' },
                  { label: 'Pay During Delivery', value: 'Pay During Delivery' },
                ]}
              />
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex justify-between">
              <span className="font-inter text-gray-500">Partner:</span>
              <span className="font-inter font-semibold">ASAP Logistics</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-inter text-gray-500">Miles:</span>
              <span>10</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-inter text-gray-500">Price/Miles:</span>
              <span>₦ 300</span>
            </div>
            <div className="flex justify-between">
              <span className="font-inter text-gray-500">Total:</span>
              <span className="font-inter font-semibold">₦ 3,000</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 rounded-full border border-[#03045B] py-2 font-inter font-semibold text-[#03045B]"
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

export default CreateDeliveryOrderStep2;

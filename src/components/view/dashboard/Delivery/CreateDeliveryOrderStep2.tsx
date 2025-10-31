'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import { ReButton } from '@/components/re-ui/ReButton';
import { Form } from '@/components/ui/form';
import {
  DeliveryOrderStep2Input,
  deliveryOrderStep2Schema,
} from '@/lib/validations/delivery-order';
import { assignDeliveryPartner } from '@/lib/actions/order/order.actions';
import { toast } from 'sonner';

export enum DeliveryPickupType {
  SELLER_DOOR = 'SELLER_DOOR',
  SELLER_DROP_OFF = 'SELLER_DROP_OFF',
}

interface CreateDeliveryOrderStep2Props {
  onBack: () => void;
  onClose: () => void;
  previousData?: any;
}

const CreateDeliveryOrderStep2 = ({
  onBack,
  onClose,
  previousData,
}: CreateDeliveryOrderStep2Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeliveryOrderStep2Input>({
    resolver: zodResolver(deliveryOrderStep2Schema),
    defaultValues: {
      pickupType: previousData?.pickupType || 'Seller Door Pick-up',
      // paymentMethod: previousData?.paymentMethod || 'Pay Now',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: DeliveryOrderStep2Input) => {
    setIsSubmitting(true);
    const pickupType =
      data.pickupType === 'Seller Drop-off'
        ? DeliveryPickupType.SELLER_DROP_OFF
        : DeliveryPickupType.SELLER_DOOR;

    const payload = { ...previousData, ...data, pickupType: pickupType };
    console.log('🌼 🔥🔥 onSubmit 🔥🔥 payload🌼', payload);
    try {
      const res = await assignDeliveryPartner(payload);

      if (res.success) {
        console.log('Delivery request submitted:', res);
        toast.success(res.message || 'Delivery request submitted. Waiting for logistic approval.');
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to submit delivery request', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
                name="pickupType"
                options={[
                  { label: 'Seller Door Pick-up', value: 'Seller Door Pick-up' },
                  { label: 'Seller Drop-off', value: 'Seller Drop-off' },
                ]}
              />
              {errors.pickupType && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupType.message}</p>
              )}
            </div>
          </div>

          {/* <div className="mb-4 flex gap-4">
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
          </div> */}
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
              disabled={isSubmitting}
              className="w-1/2 rounded-full border border-[#03045B] py-2 font-inter font-semibold text-[#03045B]"
              onClick={onBack}
            >
              Back
            </button>
            <ReButton
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 rounded-full bg-[#03045B] py-2 font-semibold text-white"
              isSubmitting={isSubmitting}
            >
              Submit Request
            </ReButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateDeliveryOrderStep2;

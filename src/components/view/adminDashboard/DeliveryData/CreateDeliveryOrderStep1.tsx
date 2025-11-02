'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';
import { DeliveryOrderStepInput, deliveryOrderStepSchema } from '@/lib/validations/delivery-order';

interface CreateDeliveryOrderStep1Props {
  onProceed: (data: DeliveryOrderStepInput) => void;
  onBack: () => void;
  onClose: () => void;
  orderId: string;
  partners: any[];
}

function CreateDeliveryOrderStep1({
  onProceed,
  onBack,
  onClose,
  orderId,
  partners,
}: CreateDeliveryOrderStep1Props) {
  const form = useForm<DeliveryOrderStepInput>({
    resolver: zodResolver(deliveryOrderStepSchema),
    defaultValues: {
      orderId,
      logisticId: '',
      pickupAddress: '',
      dropoffAddress: '',
      distanceInMiles: 0,
    },
  });

  const { handleSubmit, formState, watch, setValue } = form;
  const { isSubmitting, errors } = formState;
  const selectedPartner = watch('logisticId');

  const onSubmit = (data: DeliveryOrderStepInput) => {
    onProceed(data);
  };

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <ReHeading heading="Create Delivery Order" size="2xl" />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pickup Location */}
          <div>
            <ReHeading heading="Pickup Location" size="base" />
            <ReInput name="pickupAddress" placeholder="Enter pickup location" />
          </div>

          {/* Dropoff Location */}
          <div>
            <ReHeading heading="Drop-off Location" size="base" />
            <ReInput name="dropoffAddress" placeholder="Enter drop-off location" />
          </div>

          {/* Distance */}
          <div>
            <ReHeading heading="Distance (Miles)" size="base" />
            <ReInput name="distanceInMiles" placeholder="e.g., 12" />
          </div>

          {/* Choose Partner */}
          <div>
            <ReHeading heading="Choose Delivery Partner" size="base" />
            <div className="space-y-3 mt-2">
              {partners?.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setValue('logisticId', p.id, { shouldValidate: true })}
                  className={`flex w-full justify-between items-center rounded-lg border px-4 py-3 transition-all ${
                    selectedPartner === p.id ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border ${
                        selectedPartner === p.id ? 'border-[#12BA4A]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPartner === p.id && (
                        <span className="block size-3 rounded-full bg-[#12BA4A]" />
                      )}
                    </span>
                    <span>{p.logistic?.companyName}</span>
                  </div>
                  <span className="text-sm">₦{p.logistic?.costPerMile}/Mile</span>
                </button>
              ))}
              <div className="text-red-500 text-sm mt-1">{errors.logisticId?.message}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              className="w-1/2 rounded-full border border-[#03045B] py-2 font-semibold text-[#03045B]"
              onClick={onBack}
            >
              Back
            </button>
            <ReButton
              type="submit"
              isSubmitting={isSubmitting}
              disabled={!selectedPartner}
              className="w-1/2 rounded-full bg-[#03045B] py-2 font-semibold text-white"
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

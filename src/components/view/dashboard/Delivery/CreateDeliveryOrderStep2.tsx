'use client';

import React, { useState } from 'react';

import { ReHeading } from '@/components/re-ui/ReHeading';
import ReRadioGroup from '@/components/re-ui/ReRadio';

interface CreateDeliveryOrderStep2Props {
  onBack: () => void;
  onProceedToPayment: () => void;
}

function CreateDeliveryOrderStep2({ onBack, onProceedToPayment }: CreateDeliveryOrderStep2Props) {
  const [pickupOption, setPickupOption] = useState('pick-up');
  const [paymentMethod, setPaymentMethod] = useState('pay-on-delivery');

  const handleProceed = () => onProceedToPayment();

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <h2 className="mb-4 text-lg font-semibold">Create Delivery Order</h2>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <ReHeading heading="Pick-up Options" />
          <div className="flex gap-4">
            <ReRadioGroup
              name="pickupOptions"
              options={[
                { label: 'Seller Door Pick-up', value: 'Seller Door Pick-up' },
                { label: 'Seller Drop-off', value: 'Seller Drop-off' },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <ReHeading heading="Payment Method" />
          <div className="flex gap-4">
            <ReRadioGroup
              name="paymentMethod"
              options={[
                { label: 'Pay Now', value: 'Pay Now' },
                { label: 'Pay During Delivery', value: 'Pay During Delivery' },
              ]}
            />
          </div>
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
          className="w-1/2 rounded-full border border-[#03045B] py-2 font-inter font-semibold text-[#03045B]"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          className="w-1/2 rounded-full bg-[#03045B] py-2 font-inter font-semibold text-white"
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default CreateDeliveryOrderStep2;

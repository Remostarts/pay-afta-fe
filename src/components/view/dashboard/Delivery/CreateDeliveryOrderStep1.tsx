'use client';

import React, { useState } from 'react';

import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';

interface CreateDeliveryOrderStep1Props {
  onProceed: () => void;
  onBack: () => void;
  onClose: () => void;
}

const partners = [
  { name: 'SendBox', price: '₦ 30 / Mile' },
  { name: 'Kwik', price: '₦ 30 / Mile' },
  { name: 'Nipost EMS', price: '₦ 30 / Mile' },
];

function CreateDeliveryOrderStep1({ onProceed, onBack, onClose }: CreateDeliveryOrderStep1Props) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('SendBox');

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      {/* <ReHeading className="mb-4 text-lg font-semibold">Create Delivery Order</ReHeading> */}
      <ReHeading heading="Create Delivery Order" size="2xl" />
      <div className="my-4">
        <ReHeading heading="Pickup Location" size="lg" />
        <ReInput name="pickupLocation" />
      </div>
      <div className="mb-4">
        <ReHeading heading="Drop-off Location" size="lg" />
        <ReInput name="dropOffLocation" />
      </div>
      <div className="mb-6">
        <ReHeading heading="Choose Delivery Partner" size="lg" />
        <div className="space-y-4">
          {partners.map((p) => (
            <button
              key={p.name}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${selectedPartner === p.name ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'}`}
              onClick={() => setSelectedPartner(p.name)}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-5 items-center justify-center rounded-full border ${selectedPartner === p.name ? 'border-[#12BA4A]' : 'border-gray-300'}`}
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
      </div>
      <div className="flex gap-2">
        <button
          className="w-1/2 rounded-full border border-[#03045B] py-2 font-semibold text-[#03045B]"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          className="w-1/2 rounded-full bg-[#03045B] py-2 font-semibold text-white"
          onClick={onProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default CreateDeliveryOrderStep1;

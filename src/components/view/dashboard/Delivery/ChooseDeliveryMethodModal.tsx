'use client';

import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface ChooseDeliveryMethodModalProps {
  onProceed: (type: 'LOGISTIC' | 'SELLER') => void;
  onClose: () => void;
}

function ChooseDeliveryMethodModal({ onProceed, onClose }: ChooseDeliveryMethodModalProps) {
  const [selected, setSelected] = useState('partner');

  const handleDeliveryType = () => {
    const type = selected === 'partner' ? 'LOGISTIC' : 'SELLER';
    onProceed(type);
  };

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <h2 className="mb-2 font-inter text-lg font-semibold">Choose Your Delivery Methods</h2>
      <p className="mb-6 font-inter text-sm text-gray-500">
        Select one of the delivery methods listed below
      </p>
      <div className="mb-6 space-y-3">
        <button
          className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${selected === 'partner' ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'}`}
          onClick={() => setSelected('partner')}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex size-5 items-center justify-center rounded-full border ${selected === 'partner' ? 'border-blue-900' : 'border-gray-300'}`}
            >
              {selected === 'partner' && (
                <span className="block size-3 rounded-full bg-[#12BA4A]" />
              )}
            </span>
            <span className="font-inter">Use Payafter Logistics Partner</span>
          </div>
          <ChevronRight />
        </button>
        <button
          className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${selected === 'seller' ? 'border-[#12BA4A] bg-blue-50' : 'border-gray-200'}`}
          onClick={() => setSelected('seller')}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex size-5 items-center justify-center rounded-full border ${selected === 'seller' ? 'border-blue-900' : 'border-gray-300'}`}
            >
              {selected === 'seller' && <span className="block size-3 rounded-full bg-[#12BA4A]" />}
            </span>
            <span className="font-inter">Seller Delivers Directly</span>
          </div>
          <ChevronRight />
        </button>
      </div>
      <button
        className="w-full rounded-full bg-[#03045B] py-2 font-semibold text-white"
        onClick={() => handleDeliveryType()}
      >
        Proceed
      </button>
    </div>
  );
}

export default ChooseDeliveryMethodModal;

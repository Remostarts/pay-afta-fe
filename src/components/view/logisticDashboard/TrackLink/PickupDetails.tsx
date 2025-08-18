'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import ContactButtons from './ContactButtons';

interface PickupDetailsProps {
  sellerName: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
}

export default function PickupDetails({
  sellerName,
  address,
  pickupDate,
  pickupTime,
}: PickupDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-900">Pick Up Details</span>
        {isOpen ? (
          <ChevronUp className="size-5 text-gray-500" />
        ) : (
          <ChevronDown className="size-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-4 border-t bg-gray-50 px-4 pb-4">
          <div className="flex items-start justify-between pt-4">
            <span className="font-medium text-gray-600">Seller Name</span>
            <span className="font-semibold">{sellerName}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Address</span>
            <span className="max-w-xs text-right font-semibold">{address}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Pickup Date & Time</span>
            <span className="font-semibold">
              {pickupDate}. {pickupTime}
            </span>
          </div>
          <ContactButtons />
        </div>
      )}
    </div>
  );
}

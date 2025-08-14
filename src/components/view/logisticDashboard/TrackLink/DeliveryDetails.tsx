'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DeliveryDetailsProps {
  deliveryAddress?: string;
  estimatedDelivery?: string;
}

export default function DeliveryDetails({
  deliveryAddress,
  estimatedDelivery,
}: DeliveryDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-900">Delivery Details</span>
        {isOpen ? (
          <ChevronUp className="size-5 text-gray-500" />
        ) : (
          <ChevronDown className="size-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-4 border-t bg-gray-50 px-4 pb-4">
          <div className="flex items-start justify-between pt-4">
            <span className="font-medium text-gray-600">Delivery Address</span>
            <span className="max-w-xs text-right font-semibold">{deliveryAddress}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Estimated Delivery</span>
            <span className="font-semibold">{estimatedDelivery}</span>
          </div>
        </div>
      )}
    </div>
  );
}

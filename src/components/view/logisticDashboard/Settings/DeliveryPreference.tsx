'use client';

import { useState } from 'react';

import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';

export default function DeliveryPreference() {
  const [pickUpAvailable, setPickUpAvailable] = useState(false);
  const [dropOffAvailable, setDropOffAvailable] = useState(false);
  const [paymentOnDelivery, setPaymentOnDelivery] = useState(false);

  function handlePickUpAvailable() {
    setPickUpAvailable(!pickUpAvailable);
  }

  function handleDropOffAvailable() {
    setDropOffAvailable(!dropOffAvailable);
  }

  function handlePaymentOnDelivery() {
    setPaymentOnDelivery(!paymentOnDelivery);
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-8">
        <h3 className="mb-2 text-xl font-semibold">Pick Up Options</h3>
        <p className="mb-6 text-gray-500">
          Select options for how you pick up items from customers
        </p>
        <div className="p-8">
          <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-5">
            <span>Pick Up Available</span>
            <ReToggle checked={pickUpAvailable} onChange={handlePickUpAvailable} />
          </div>
          <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-5">
            <span>Drop Off Available</span>
            <ReToggle checked={dropOffAvailable} onChange={handleDropOffAvailable} />
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border bg-white p-8">
        <h3 className="mb-2 text-xl font-semibold">Payment Options</h3>
        <p className="mb-6 text-gray-500">Choose whether you accept payment on delivery</p>
        <div className="p-8">
          <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-5">
            <span>Payment on delivery</span>
            <ReToggle checked={paymentOnDelivery} onChange={handlePaymentOnDelivery} />
          </div>
        </div>
      </div>
    </div>
  );
}

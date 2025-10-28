'use client';

import React, { useState } from 'react';

import ChooseDeliveryMethodModal from './ChooseDeliveryMethodModal';
import CreateDeliveryOrderStep1 from './CreateDeliveryOrderStep1';
import CreateDeliveryOrderStep2 from './CreateDeliveryOrderStep2';
import PaymentModal from './PaymentModal';

import { Dialog, DialogContent } from '@/components/ui/dialog';

// const orders = Array.from({ length: 5 }, (_, i) => ({
//   id: i + 1,
//   orderId: '12855098',
//   trackingId: 'SMS20250770STD986E',
//   name: 'Paul Simeon',
//   product: 'HP EliteBook 840 G5 - 8GB RAM',
// }))

const AssignOrderList = ({ orders }:any) => {
  const [showAll, setShowAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const visibleOrders = showAll ? orders : orders.slice(0, 6);

  const handleAssignClick = () => {
    setStep(1);
    setDialogOpen(true);
  };

  const handleProceed = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleClose = () => {
    setDialogOpen(false);
    setStep(0);
  };

  // When proceeding from step 3, close delivery dialog and open payment modal
  const handleProceedToPayment = () => {
    setDialogOpen(false);
    setTimeout(() => setShowPayment(true), 200);
  };
  const handlePaymentClose = () => setShowPayment(false);

  return (
    <div className="mt-4 rounded-xl bg-white p-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none">
          {step === 1 && (
            <ChooseDeliveryMethodModal onProceed={handleProceed} onClose={handleClose} />
          )}
          {step === 2 && (
            <CreateDeliveryOrderStep1
              onProceed={handleProceed}
              onBack={handleBack}
              onClose={handleClose}
            />
          )}
          {step === 3 && (
            <CreateDeliveryOrderStep2
              onBack={handleBack}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
        </DialogContent>
      </Dialog>
      <PaymentModal open={showPayment} onClose={handlePaymentClose} />
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">
          Assign Order <span className="text-gray-500">({orders.length})</span>
        </div>
        <button
          className="text-xs font-semibold text-[#03045B] hover:underline"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'SHOW LESS' : 'SHOW MORE'}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {visibleOrders.map((order:any) => (
          <div
            key={order.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#F8F8F8] p-5 shadow-sm transition-all hover:shadow-md"
          >
            {/* Order details */}
            <div>
              <div className="text-sm text-gray-500">
                Order ID: <span className="font-medium text-gray-400">{order.id}</span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                Price: <span className="font-medium text-gray-400">{order.amount}</span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                Status: <span className="font-medium text-gray-400">{order.status}</span>
              </div>
              <div className="mt-1 font-inter text-[15px] font-bold text-gray-900">
                {order?.buyerName}
              </div>

              {order?.items &&
                order?.items?.map((item:any,index:number) => (
                  <>
                    <div key={index} className="mt-1 text-[15px] text-gray-800">
                      <span>Item: </span> {item.name}
                    </div>
                    <div className="mt-1 text-[15px] text-gray-800">
                      <span>Quantity: </span>
                      {item.quantity}
                    </div>
                  </>
                ))}
            </div>

            {/* Button */}
            <button
              className="mt-4 w-full rounded-full bg-[#03045B] py-2.5 font-inter text-[15px] font-semibold text-white transition-all hover:bg-[#03045B]/90 active:scale-[0.98]"
              onClick={handleAssignClick}
            >
              Assign Delivery
            </button>
          </div>
        ))}
      </div>
      {/* <p className="mx-auto mt-4 text-center text-sm text-gray-500">No Ongoing Deliveries</p> */}
    </div>
  );
};

export default AssignOrderList;

'use client';

import React, { useState } from 'react';

import ChooseDeliveryMethodModal from './ChooseDeliveryMethodModal';
import CreateDeliveryOrderStep1 from './CreateDeliveryOrderStep1';
import CreateDeliveryOrderStep2 from './CreateDeliveryOrderStep2';
import PaymentModal from './PaymentModal';

import { Dialog, DialogContent } from '@/components/ui/dialog';

const orders = Array.from({ length: 0 }, (_, i) => ({
  id: i + 1,
  orderId: 'ORD12345',
  name: 'Paul Simeon',
  product: 'HP EliteBook 840 G5 - 8GB RAM',
}));

const AssignOrderList = () => {
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
        {/* {visibleOrders.map((order) => (
          <div key={order.id} className="flex flex-col gap-2 rounded-xl border bg-white p-4">
            <div className="mb-1 text-xs text-gray-400">Order ID: {order.orderId}</div>
            <div className="font-bold">{order.name}</div>
            <div className="mb-4 text-sm">{order.product}</div>
            <button
              className="mt-auto w-full rounded-full bg-[#03045B] py-2 font-semibold text-white"
              onClick={handleAssignClick}
            >
              Assign Delivery
            </button>
          </div>
        ))} */}
      </div>
        <p className='mx-auto mt-4 text-center text-sm text-gray-500'>
          No orders available for delivery assignment.
        </p>
    </div>
  );
};

export default AssignOrderList;

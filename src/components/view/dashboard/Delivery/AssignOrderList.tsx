'use client';

import React, { useEffect, useState } from 'react';
import ChooseDeliveryMethodModal from './ChooseDeliveryMethodModal';
import CreateDeliveryOrderStep1 from './CreateDeliveryOrderStep1';
import CreateDeliveryOrderStep2 from './CreateDeliveryOrderStep2';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getAllDeliverPartners } from '@/lib/actions/delivery/delivery.actions';

const AssignOrderList = ({ orders, onAssignSuccess }: any) => {
  const [showAll, setShowAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [partners, setPartners] = useState([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [deliveryData, setDeliveryData] = useState<any>({});

  console.log(orders);

  const visibleOrders = showAll ? orders : orders.slice(0, 6);

  const handleAssignClick = (orderId: string) => {
    setOrderId(orderId);
    setStep(1);
    setDialogOpen(true);
    setDeliveryData({ orderId });
  };

  const handleProceed = (data: any) => {
    setDeliveryData((prev: any) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleClose = () => {
    setDialogOpen(false);
    onAssignSuccess?.();
    setStep(0);
    setDeliveryData({});
  };

  const loadsLogisticPartners = async () => {
    const { data } = await getAllDeliverPartners();
    setPartners(data);
  };

  useEffect(() => {
    loadsLogisticPartners();
  }, []);

  return (
    <div className="mt-4 rounded-xl bg-white p-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none">
          {step === 1 && (
            <ChooseDeliveryMethodModal
              onProceed={(type) => handleProceed({ deliveryType: type })}
              onClose={handleClose}
            />
          )}
          {step === 2 && (
            <CreateDeliveryOrderStep1
              onProceed={handleProceed}
              onBack={handleBack}
              onClose={handleClose}
              orderId={orderId as string}
              partners={partners}
            />
          )}
          {step === 3 && (
            <CreateDeliveryOrderStep2
              onBack={handleBack}
              onClose={handleClose}
              previousData={deliveryData}
            />
          )}
        </DialogContent>
      </Dialog>

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
        {visibleOrders.map((order: any) => (
          <div
            key={order.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#F8F8F8] p-5 shadow-sm transition-all hover:shadow-md"
          >
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

              {order?.items?.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="mt-1 text-[15px] text-gray-800">
                    <span>Item: </span> {item.name}
                  </div>
                  <div className="mt-1 text-[15px] text-gray-800">
                    <span>Quantity: </span> {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-4 w-full rounded-full bg-[#03045B] py-2.5 font-inter text-[15px] font-semibold text-white transition-all hover:bg-[#03045B]/90 active:scale-[0.98]"
              onClick={() => handleAssignClick(order.id)}
            >
              Assign Delivery
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignOrderList;

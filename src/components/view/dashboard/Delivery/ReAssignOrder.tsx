'use client';

import { useEffect, useState } from 'react';
import ChooseDeliveryMethodModal from './ChooseDeliveryMethodModal';
import CreateDeliveryOrderStep1 from './CreateDeliveryOrderStep1';
import CreateDeliveryOrderStep2 from './CreateDeliveryOrderStep2';
import { getAllDeliverPartners } from '@/lib/actions/delivery/delivery.actions';

export default function ReAssignOrder({ orders, onAssignSuccess, reAssignOrderId }: any) {
  const [step, setStep] = useState(1);
  const [deliveryData, setDeliveryData] = useState<any>({});
  const [partners, setPartners] = useState([]);
  const orderId = orders?.id;

  console.log(reAssignOrderId);

  // const handleAssignClick = (orderId: string) => {
  //   // setOrderId(orderId);
  //   setStep(1);
  //   setDeliveryData({ reAssignOrderId });
  // };

  const handleProceed = (data: any) => {
    setDeliveryData((prev: any) => ({ reAssignOrderId }));
    setStep((s) => s + 1);
  };

  console.log(deliveryData);

  const handleBack = () => setStep((s) => s - 1);

  const handleClose = () => {
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
    <section className="w-full flex items-center justify-center">
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
          orderId={reAssignOrderId as string}
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
    </section>
  );
}

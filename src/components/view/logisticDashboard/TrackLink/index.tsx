'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderHeader from './OrderHeader';
import StatusIndicator from './StatusIndicator';
import ProgressTimeline from './ProgressTimeline';
import PickupDetails from './PickupDetails';
import DeliveryDetails from './DeliveryDetails';
import {
  getDeliveryDetail,
  updateDeliveryProgressStatus,
} from '@/lib/actions/delivery/delivery.actions';
import { DeliveryStatus } from '@/types/order';
import { UpdateDeliveryPayload } from '@/lib/validations/delivery.validation';

interface TimelineStep {
  step: string;
  note?: string;
  timestamp: string;
  status: string;
}

interface DeliveryData {
  id: string;
  orderNumber: string;
  status: DeliveryStatus;
  currentStep: number;
  amount: string;
  sellerName: string;
  sellerPhone?: string;
  buyerName?: string;
  buyerPhone?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  estimatedDelivery?: string;
  timeline?: TimelineStep[];
}

interface Props {
  deliveryId: string;
}

// Map frontend-friendly DeliveryStatus to backend-compatible status
const statusMap: Record<DeliveryStatus, UpdateDeliveryPayload['action']> = {
  accepted: 'ACCEPTED',
  'picked-up': 'PICKED_UP',
  'in-transit': 'IN_TRANSIT',
  delivered: 'DELIVERED',
  failed: 'FAILED',
};

export default function OrderDeliveryTracker({ deliveryId }: Props) {
  const [orderData, setOrderData] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDelivery() {
      try {
        setLoading(true);
        const { data } = await getDeliveryDetail(deliveryId);
        console.log('🌼 🔥🔥 fetchDelivery 🔥🔥 data🌼', data);

        const mapped: DeliveryData = {
          id: data?.id,
          orderNumber: data?.order?.orderNumber,
          status: data.status.toLowerCase() as DeliveryStatus,
          currentStep: data.currentStep,
          amount: data.totalCost ? `₦${data?.totalCost}` : '₦0',
          sellerName: `${data.seller.firstName} ${data.seller.lastName}`,
          sellerPhone: data.seller.phone,
          buyerName: data.order?.buyer
            ? `${data.order.buyer.firstName} ${data.order.buyer.lastName}`
            : undefined,
          buyerPhone: data.order?.buyer?.phone,
          pickupAddress: data.pickupAddress || '',
          dropoffAddress: data.dropoffAddress || '',
          estimatedDelivery: data.order?.deliveryDate
            ? new Date(data.order.deliveryDate).toLocaleString()
            : undefined,
          timeline: data.timeline?.map((t: any) => ({
            step: t.step,
            note: t.note,
            timestamp: new Date(t.timestamp).toLocaleString(),
            status: t.status,
          })),
        };

        setOrderData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDelivery();
  }, [deliveryId]);

  const handleStatusUpdate = async (newStatus: DeliveryStatus) => {
    if (!orderData) return;

    try {
      const apiStatus = statusMap[newStatus];
      await updateDeliveryProgressStatus({ action: apiStatus }, orderData.id);
      setOrderData({ ...orderData, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!orderData) return <div className="text-center py-10">No delivery found</div>;

  // Disable button if current step < PAYMENT or status is not paid
  const isPaymentDone = orderData.currentStep >= 1;

  return (
    <div className="mx-auto w-full bg-white p-4">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <OrderHeader
            orderId={orderData.orderNumber}
            amount={orderData.amount}
            status={orderData.status}
            onStatusUpdate={handleStatusUpdate}
            isPaymentDone={isPaymentDone}
          />

          <StatusIndicator status={orderData.status} />

          <ProgressTimeline status={orderData.status} />

          <PickupDetails
            sellerName={orderData.sellerName}
            phone={orderData?.sellerPhone || ''}
            address={orderData.pickupAddress || ''}
            pickupDate={orderData.estimatedDelivery?.split(',')[0] || ''}
            pickupTime={orderData.estimatedDelivery?.split(',')[1] || ''}
          />

          <DeliveryDetails
            buyerName={orderData?.buyerName || ''}
            phone={orderData?.buyerPhone || ''}
            deliveryAddress={orderData.dropoffAddress}
            estimatedDelivery={orderData.estimatedDelivery}
          />
        </CardContent>
      </Card>
    </div>
  );
}

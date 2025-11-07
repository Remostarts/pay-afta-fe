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
import { toast } from 'sonner';
import OrderTrackingSkeleton from './OrderTrackingSkeleton';

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
  currentStep: string;
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
  ACCEPTED: 'ACCEPTED',
  PAID: 'PAID',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
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
          status: data.status as DeliveryStatus,
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

  const handleStatusUpdate = async (newStatus: DeliveryStatus | 'RETRY') => {
    if (!orderData) return;

    try {
      if (newStatus === 'RETRY') {
        await updateDeliveryProgressStatus({ action: 'RETRY' }, orderData.id);
        setOrderData({ ...orderData, status: 'IN_TRANSIT' });
        toast.success('Retry initiated! Delivery is now In Transit.');
        return;
      }

      const apiStatus = statusMap[newStatus];
      await updateDeliveryProgressStatus({ action: apiStatus }, orderData.id);
      setOrderData({ ...orderData, status: newStatus });
      toast.success(`Delivery status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update delivery status. Please try again.');
    }
  };

  if (loading)
    return (
      <div className="text-center py-10">
        <OrderTrackingSkeleton />
      </div>
    );

  if (!orderData) {
    return (
      <div className="mx-auto w-full bg-white p-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Not Found</h2>
              <p className="text-gray-600">
                {'The delivery information you are looking for could not be found.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Disable button if current step < PAYMENT or status is not paid
  const isPaymentDone = orderData.currentStep !== 'PENDING';

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

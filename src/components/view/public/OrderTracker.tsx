'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderTrackingSkeleton from '../logisticDashboard/TrackLink/OrderTrackingSkeleton';
import StatusIndicator from '../logisticDashboard/TrackLink/StatusIndicator';
import PickupDetails from '../logisticDashboard/TrackLink/PickupDetails';
import DeliveryDetails from '../logisticDashboard/TrackLink/DeliveryDetails';
import { getPublicDeliveryDetail } from '@/lib/actions/delivery/delivery.actions';
import { getMockDeliveryById, isMockDelivery } from '@/lib/mock-data/delivery-tracking';
import { DeliveryStatus } from '@/types/order';
import ProgressTimeline from './ProgressTimeline';

interface TimelineStep {
  step: string;
  note?: string;
  timestamp: string;
  status: string;
}

interface DeliveryData {
  id: string;
  trackingNumber: string;
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
  trackingId: string;
}

export default function OrderTracker({ trackingId }: Props) {
  const [orderData, setOrderData] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDelivery() {
      try {
        setLoading(true);
        setError(null);

        let data;

        // Check if this is a mock delivery ID first
        if (isMockDelivery(trackingId)) {
          data = getMockDeliveryById(trackingId);
        } else {
          // Try real API call
          try {
            const response = await getPublicDeliveryDetail(trackingId);
            console.log('🌼 🔥🔥 fetchDelivery 🔥🔥 response🌼', response);

            data = response.data;
          } catch (apiError) {
            // If API fails and it's not a mock, return error
            if (!isMockDelivery(trackingId)) {
              throw apiError;
            }
            // If it's not a mock but API failed, we could show a message
            data = null;
          }
        }

        if (data) {
          const mapped: DeliveryData = {
            id: data.id,
            trackingNumber: data.trackingNumber,
            status: data.status as DeliveryStatus,
            currentStep: data.currentStep,
            amount: data.order?.amount ? `₦${data.order?.amount}` : '₦0',
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
              timestamp: t.timestamp ? new Date(t.timestamp).toLocaleString() : '',
              status: t.status,
            })),
          };

          setOrderData(mapped);
        } else {
          setError('Delivery not found');
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load delivery information');
      } finally {
        setLoading(false);
      }
    }

    fetchDelivery();
  }, [trackingId]);

  console.log(orderData);

  if (loading) {
    return (
      <div className="text-center py-10">
        <OrderTrackingSkeleton />
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="mx-auto w-full bg-white p-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Delivery Not Found</h2>
              <p className="text-gray-600">
                {error || 'The delivery information you are looking for could not be found.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full bg-white p-4">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {/* Simplified Header - No action buttons */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">
                Tracking Number: {orderData.trackingNumber || 314354}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">{orderData.amount || '00'}</span>
            </div>
          </div>

          <StatusIndicator status={orderData.status || 'Paid'} />

          <ProgressTimeline timeline={orderData.timeline || []} />

          <PickupDetails
            sellerName={orderData.sellerName || 'anurag'}
            phone={orderData?.sellerPhone || '35460'}
            address={orderData.pickupAddress || 'osflsdfldn'}
            pickupDate={orderData.estimatedDelivery?.split(',')[0] || '12/32/34'}
            pickupTime={orderData.estimatedDelivery?.split(',')[1] || '12/34/24'}
          />

          <DeliveryDetails
            buyerName={orderData?.buyerName || 'N/A'}
            phone={orderData?.buyerPhone}
            deliveryAddress={orderData.dropoffAddress}
            estimatedDelivery={orderData.estimatedDelivery}
          />

          {/* Public Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              This is a public tracking view. For updates or support, please contact PayAfta
              customer service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

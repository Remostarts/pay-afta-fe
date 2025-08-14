'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Phone, MessageCircle } from 'lucide-react';

import DeliveryDetails from './DeliveryDetails';
import PickupDetails from './PickupDetails';
import OrderHeader from './OrderHeader';
import StatusIndicator from './StatusIndicator';
import ProgressTimeline from './ProgressTimeline';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DeliveryStatus = 'accepted' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';

interface OrderData {
  id: string;
  status: DeliveryStatus;
  amount: string;
  sellerName: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
}

// const deliverySteps = [
//   { key: 'accepted', label: 'Accepted', step: 1 },
//   { key: 'picked-up', label: 'Picked Up', step: 2 },
//   { key: 'in-transit', label: 'In Transit', step: 3 },
//   { key: 'delivered', label: 'Delivered', step: 4 },
// ];

// const statusDisplayNames = {
//   accepted: 'Accepted',
//   'picked-up': 'Picked up',
//   'in-transit': 'In transit',
//   delivered: 'Delivered',
//   failed: 'Failed',
// };

// const statusColors = {
//   accepted: 'text-orange-600',
//   'picked-up': 'text-blue-600',
//   'in-transit': 'text-blue-600',
//   delivered: 'text-green-600',
//   failed: 'text-red-600',
// };

export default function OrderDeliveryTracker() {
  const [pickupDetailsOpen, setPickupDetailsOpen] = useState(true);
  const [deliveryDetailsOpen, setDeliveryDetailsOpen] = useState(false);

  // Sample order data - in real app this would come from props or API
  const [orderData, setOrderData] = useState<OrderData>({
    id: '01',
    status: 'accepted',
    amount: '₦2,000',
    sellerName: 'Name',
    address: 'No 24 Gimo Oluwatoisin Street, Lekki Phase one',
    pickupDate: 'August 24th',
    pickupTime: '5:30 pm',
    deliveryAddress: 'No 24 Gimo Oluwatoisin Street, Lekki Phase one',
    estimatedDelivery: 'August 25th. 2:00 pm',
  });

  const updateOrderStatus = (newStatus: DeliveryStatus) => {
    setOrderData((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="mx-auto w-full bg-white">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <OrderHeader
            orderId={orderData.id}
            amount={orderData.amount}
            status={orderData.status}
            onStatusUpdate={updateOrderStatus}
          />

          <StatusIndicator status={orderData.status} />

          <ProgressTimeline status={orderData.status} />

          <PickupDetails
            sellerName={orderData.sellerName}
            address={orderData.address}
            pickupDate={orderData.pickupDate}
            pickupTime={orderData.pickupTime}
          />

          <DeliveryDetails
            deliveryAddress={orderData.deliveryAddress}
            estimatedDelivery={orderData.estimatedDelivery}
          />
        </CardContent>
      </Card>
    </div>
  );
}

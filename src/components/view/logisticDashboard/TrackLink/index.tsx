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

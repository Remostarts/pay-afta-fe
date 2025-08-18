export type DeliveryStatus = 'accepted' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';

export interface OrderData {
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

export interface DeliveryStep {
  key: string;
  label: string;
  step: number;
}

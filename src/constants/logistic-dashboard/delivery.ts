import type { DeliveryStatus, DeliveryStep } from '@/types/order';

export const deliverySteps: DeliveryStep[] = [
  { key: 'accepted', label: 'Accepted', step: 1 },
  { key: 'picked-up', label: 'Picked Up', step: 2 },
  { key: 'in-transit', label: 'In Transit', step: 3 },
  { key: 'delivered', label: 'Delivered', step: 4 },
];
export const statusDisplayNames: Record<DeliveryStatus, string> = {
  ACCEPTED: 'Accepted',
  PAID: 'Paid',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
};

export const statusColors: Record<DeliveryStatus, string> = {
  ACCEPTED: 'text-[#B54708] bg-[#FFFAEB]',
  PAID: 'text-[#175CD3] bg-[#EFF8FF]',
  PICKED_UP: 'text-[#5925DC] bg-[#F4F3FF]',
  IN_TRANSIT: 'text-[#175CD3] bg-[#EFF8FF]',
  DELIVERED: 'text-[#0F973C] bg-[#E8FDEF]',
  FAILED: 'text-[#B42318] bg-[#FEF3F2]',
};

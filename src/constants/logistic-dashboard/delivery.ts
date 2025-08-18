import type { DeliveryStep } from '@/types/order';

export const deliverySteps: DeliveryStep[] = [
  { key: 'accepted', label: 'Accepted', step: 1 },
  { key: 'picked-up', label: 'Picked Up', step: 2 },
  { key: 'in-transit', label: 'In Transit', step: 3 },
  { key: 'delivered', label: 'Delivered', step: 4 },
];

export const statusDisplayNames = {
  accepted: 'Accepted',
  'picked-up': 'Picked up',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  failed: 'Failed',
};

export const statusColors = {
  accepted: 'text-[#B54708] bg-[#FFFAEB]',
  'picked-up': 'text-[#5925DC] bg-[#F4F3FF]',
  'in-transit': 'text-[#175CD3] bg-[#EFF8FF]',
  delivered: 'text-[#0F973C] bg-[#E8FDEF]',
  failed: 'text-[#B42318] bg-[#FEF3F2]',
};

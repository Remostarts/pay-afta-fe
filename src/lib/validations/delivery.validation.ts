import { z } from 'zod';

export const DeliveryProgressStatusValidation = z.enum([
  'REJECTED',
  'ACCEPTED',
  'PAID',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'RETRY',
  'RETURNED',
  'CANCELLED',
]);

export interface UpdateDeliveryPayload {
  action: z.infer<typeof DeliveryProgressStatusValidation>;
  note?: string;
}

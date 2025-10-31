import { z } from 'zod';

export const DeliveryProgressStatusValidation = z.enum([
  'REJECTED',
  'APPROVED',
  'PAID',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'RETURN_INITIATED',
  'RETURNED',
  'COMPLETED',
  'CANCELLED',
]);


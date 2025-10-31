import { z } from 'zod';

// Step 1 Validation
export const deliveryOrderStepSchema = z.object({
  pickupAddress: z
    .string({ required_error: 'Pickup location is required' })
    .min(3, 'Enter the Pickup location.'),
  dropoffAddress: z
    .string({ required_error: 'Drop-off location is required' })
    .min(3, 'Enter the Drop-off location.'),
  orderId: z.string({ required_error: 'OrderId is required.' }),
  logisticId: z.string({ required_error: 'Please select a delivery partner' }),
  distanceInMiles: z.coerce
    .number()
    .positive('Distance must be greater than 0')
    .refine((n) => !isNaN(n), 'Distance must be a valid number'),
});

export type DeliveryOrderStepInput = z.infer<typeof deliveryOrderStepSchema>;

// Step 2 Validation
export const deliveryOrderStep2Schema = z.object({
  pickupType: z.enum(['Seller Door Pick-up', 'Seller Drop-off'], {
    required_error: 'Please select a pickup option',
  }),
});

export type DeliveryOrderStep2Input = z.infer<typeof deliveryOrderStep2Schema>;

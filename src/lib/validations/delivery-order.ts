import { z } from 'zod';

export const deliveryOrderStep1Schema = z.object({
  pickupLocation: z
    .string({
      required_error: 'Pickup location is required',
    })
    .min(3, {
      message: 'Enter the Pickup location.',
    }),

  dropOffLocation: z
    .string({
      required_error: 'Drop-off location is required',
    })
    .min(3, {
      message: 'Enter the Drop-off location.',
    }),

  deliveryPartner: z.enum(['SendBox', 'Kwik', 'Nipost EMS'], {
    required_error: 'Please select a delivery partner',
  }),
});

export type DeliveryOrderStep1Input = z.infer<typeof deliveryOrderStep1Schema>;

export const deliveryOrderStep2Schema = z.object({
  pickupOption: z.enum(['Seller Door Pick-up', 'Seller Drop-off'], {
    required_error: 'Please select a pickup option',
  }),
  paymentMethod: z.enum(['Pay Now', 'Pay During Delivery'], {
    required_error: 'Please select a payment method',
  }),
});

export type DeliveryOrderStep2Input = z.infer<typeof deliveryOrderStep2Schema>;

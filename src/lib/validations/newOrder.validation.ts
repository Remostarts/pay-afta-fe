import { z } from 'zod';

// Frontend form validation schema
export const newOrderSchema = () =>
  z
    .object({
      role: z.string().min(3, 'Initiator role is required.'),
      transactionType: z.enum(['Product', 'Services'], {
        required_error: 'Transaction type is required',
        invalid_type_error: 'Invalid transaction type',
      }),

      // Item 1 (Required)
      item1Name: z.string().min(1, 'Item name is required'),
      item1Quantity: z.string().min(1, 'Quantity is required'),
      item1Prize: z.string().min(1, 'Price is required'),

      // Item 2 (Optional)
      item2Name: z.string().optional(),
      item2Quantity: z.string().optional(),
      item2Prize: z.string().optional(),

      // Item details
      detailAboutItem: z.string().min(1, 'Item details are required'),

      // Payment
      paymentType: z.enum(['One time Payment', 'Milestone Payment'], {
        required_error: 'Payment type is required',
      }),
      deliveryDate: z.coerce
        .date({
          required_error: 'Delivery date is required',
          invalid_type_error: 'Invalid date',
        })
        .optional(),
      invoiceDate: z.coerce
        .date({
          required_error: 'Invoice date is required',
          invalid_type_error: 'Invalid date',
        })
        .optional(),

      // Milestones (Optional)
      milestone1: z.string().optional(),
      milestone1DeliveryDate: z.coerce.date().optional(),
      milestone1Amount: z.string().optional(),
      milestone2: z.string().optional(),
      milestone2DeliveryDate: z.coerce.date().optional(),
      milestone2Amount: z.string().optional(),
      milestone3: z.string().optional(),
      milestone3DeliveryDate: z.coerce.date().optional(),
      milestone3Amount: z.string().optional(),

      // Transaction fee
      transactionFee: z.string().min(1, 'Transaction fee responsibility is required'),

      // Counterparties
      counterpartyEmailOrPhoneNo: z.string().min(3, 'Counterparty email is required.'),
      // buyerEmailPhoneNo: z.string().optional(),
      // sellerEmailPhoneNo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Role validation - must be either Buyer or Seller
      if (!data.role || (data.role !== 'Buyer' && data.role !== 'Seller')) {
        ctx.addIssue({
          path: ['role'],
          message: 'Please select either Buyer or Seller',
          code: 'custom',
        });
        return; // Exit early if role is invalid
      }

      // Item 2 validation (if any field is filled, all must be filled)
      const hasItem2Name = data.item2Name && data.item2Name.trim() !== '';
      const hasItem2Quantity = data.item2Quantity && data.item2Quantity.trim() !== '';
      const hasItem2Price = data.item2Prize && data.item2Prize.trim() !== '';

      if (hasItem2Name || hasItem2Quantity || hasItem2Price) {
        if (!hasItem2Name) {
          ctx.addIssue({
            path: ['item2Name'],
            message: 'Item 2 name is required',
            code: 'custom',
          });
        }
        if (!hasItem2Quantity) {
          ctx.addIssue({
            path: ['item2Quantity'],
            message: 'Item 2 quantity is required',
            code: 'custom',
          });
        }
        if (!hasItem2Price) {
          ctx.addIssue({
            path: ['item2Prize'],
            message: 'Item 2 price is required',
            code: 'custom',
          });
        }
      }

      // Milestone validation for milestone payment
      if (data.paymentType === 'Milestone Payment') {
        // Milestone 1 is required
        if (!data.milestone1 || data.milestone1.trim() === '') {
          ctx.addIssue({
            path: ['milestone1'],
            message: 'Milestone 1 description is required',
            code: 'custom',
          });
        }
        if (!data.milestone1Amount || data.milestone1Amount.trim() === '') {
          ctx.addIssue({
            path: ['milestone1Amount'],
            message: 'Milestone 1 amount is required',
            code: 'custom',
          });
        }
        if (!data.milestone1DeliveryDate) {
          ctx.addIssue({
            path: ['milestone1DeliveryDate'],
            message: 'Milestone 1 delivery date is required',
            code: 'custom',
          });
        }

        // Milestone 2 validation (if any field is filled)
        const hasMilestone2 = data.milestone2 && data.milestone2.trim() !== '';
        const hasMilestone2Amount = data.milestone2Amount && data.milestone2Amount.trim() !== '';
        const hasMilestone2Date = !!data.milestone2DeliveryDate;

        if (hasMilestone2 || hasMilestone2Amount || hasMilestone2Date) {
          if (!hasMilestone2) {
            ctx.addIssue({
              path: ['milestone2'],
              message: 'Milestone 2 description is required',
              code: 'custom',
            });
          }
          if (!hasMilestone2Amount) {
            ctx.addIssue({
              path: ['milestone2Amount'],
              message: 'Milestone 2 amount is required',
              code: 'custom',
            });
          }
          if (!hasMilestone2Date) {
            ctx.addIssue({
              path: ['milestone2DeliveryDate'],
              message: 'Milestone 2 delivery date is required',
              code: 'custom',
            });
          }
        }

        // Milestone 3 validation (if any field is filled)
        const hasMilestone3 = data.milestone3 && data.milestone3.trim() !== '';
        const hasMilestone3Amount = data.milestone3Amount && data.milestone3Amount.trim() !== '';
        const hasMilestone3Date = !!data.milestone3DeliveryDate;

        if (hasMilestone3 || hasMilestone3Amount || hasMilestone3Date) {
          if (!hasMilestone3) {
            ctx.addIssue({
              path: ['milestone3'],
              message: 'Milestone 3 description is required',
              code: 'custom',
            });
          }
          if (!hasMilestone3Amount) {
            ctx.addIssue({
              path: ['milestone3Amount'],
              message: 'Milestone 3 amount is required',
              code: 'custom',
            });
          }
          if (!hasMilestone3Date) {
            ctx.addIssue({
              path: ['milestone3DeliveryDate'],
              message: 'Milestone 3 delivery date is required',
              code: 'custom',
            });
          }
        }
      }

      // One-time payment validation
      if (data.paymentType === 'One time Payment') {
        if (!data.deliveryDate) {
          ctx.addIssue({
            path: ['deliveryDate'],
            message: 'Delivery date is required for one-time payment',
            code: 'custom',
          });
        }
      }
    });

export type TNewOrder = z.infer<ReturnType<typeof newOrderSchema>>;

// Backend validation schema (used in action or API route)
export const createOrderZodSchema = z.object({
  role: z.string().min(3, 'Initiator role is required.'),

  counterpartyEmailOrPhoneNo: z.string().min(3, 'Counterparty email is required.'),

  invoiceDate: z.coerce.date({
    required_error: 'Invoice date is required',
    invalid_type_error: 'Invalid Invoice date',
  }),

  deliveryDate: z.coerce.date({
    required_error: 'Delivery date is required',
    invalid_type_error: 'Invalid delivery date',
  }),

  detailAboutItem: z.string().min(1, 'Item details are required'),

  paymentType: z.enum(['One time Payment', 'Milestone Payment'], {
    required_error: 'Payment type is required',
  }),

  transactionFee: z.string().min(1, 'Transaction fee is required'),

  transactionType: z.enum(['Product', 'Services'], {
    required_error: 'Transaction type is required',
  }),

  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        price: z.string().min(1, 'Item price is required'),
        quantity: z.string().min(1, 'Item quantity is required'),
      })
    )
    .min(1, 'At least one item is required'),

  milestones: z
    .array(
      z.object({
        title: z.string().min(1, 'Milestone title is required'),
        amount: z.string().min(1, 'Milestone amount is required'),
        deliveryDate: z.coerce.date({
          required_error: 'Milestone delivery date is required',
        }),
      })
    )
    .min(1, 'At least one milestone is required'),
});

export type TCreateOrderInput = z.infer<typeof createOrderZodSchema>;

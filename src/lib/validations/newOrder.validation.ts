import { z } from 'zod';

// NewOrder Schema (Frontend form validation)

export const newOrderSchema = () =>
  z
    .object({
      role: z.string().min(1, 'Role is required.'),
      transactionType: z.string().min(1, 'Select an option.'),
      item1Name: z.string().min(1, 'Name is required.'),
      item1Quantity: z.string().min(1, 'Quantity is required.'),
      item1Prize: z.string().min(1, 'Prize is required.'),
      item2Name: z.string().optional(),
      item2Quantity: z.string().optional(),
      item2Prize: z.string().optional(),
      detailAboutItem: z.string().min(1, 'Item detail is required.'),
      paymentType: z.string().min(1, 'Payment type is required.'),
      deliveryDate: z.coerce.date().optional(),
      milestone1: z.string().optional(),
      milestone1DeliveryDate: z.coerce.date().optional(),
      milestone1Amount: z.string().optional(),
      milestone2: z.string().optional(),
      milestone2DeliveryDate: z.coerce.date().optional(),
      milestone2Amount: z.string().optional(),
      milestone3: z.string().optional(),
      milestone3DeliveryDate: z.coerce.date().optional(),
      milestone3Amount: z.string().optional(),
      transactionFee: z.string().min(1, 'Transaction Fee is required.'),
      buyerEmailPhoneNo: z.string().optional(),
      sellerEmailPhoneNo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Counterparty validation
      if (data.role) {
        if (data.role === 'Buyer' && data.sellerEmailPhoneNo?.trim() === '') {
          ctx.addIssue({
            path: ['sellerEmailPhoneNo'],
            message: 'Please select a seller',
            code: 'custom',
          });
        } else if (data.role === 'Seller' && data.buyerEmailPhoneNo?.trim() === '') {
          ctx.addIssue({
            path: ['buyerEmailPhoneNo'],
            message: 'Please select a buyer',
            code: 'custom',
          });
        }
      }

      // Milestone validation for milestone payment
      if (data.paymentType === 'Milestone Payment') {
        if (!data.milestone1) {
          ctx.addIssue({
            path: ['milestone1'],
            message: 'Milestone 1 title is required',
            code: 'custom',
          });
        }
        if (!data.milestone1Amount) {
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
        // Milestone 2 & 3 validation only if shown
        if (data.milestone2 && !data.milestone2Amount) {
          ctx.addIssue({
            path: ['milestone2Amount'],
            message: 'Milestone 2 amount is required',
            code: 'custom',
          });
        }
        if (data.milestone3 && !data.milestone3Amount) {
          ctx.addIssue({
            path: ['milestone3Amount'],
            message: 'Milestone 3 amount is required',
            code: 'custom',
          });
        }
      }
    });

export type TNewOrder = z.infer<ReturnType<typeof newOrderSchema>>;

// Backend validation schema (used in action or API route)
export const createOrderZodSchema = z.object({
  buyerEmailPhoneNo: z.string().min(3, 'Please select a counterparty'),
  sellerEmailPhoneNo: z.string().min(3, 'Please select a counterparty'),
  deliveryDate: z.coerce.date(),
  detailAboutItem: z.string().min(1, 'Detail is required'),
  paymentType: z.string(),
  transactionFee: z.string(),
  transactionType: z.string(),
  items: z.array(
    z.object({
      name: z.string().min(1, 'Item name is required'),
      price: z.string(),
      quantity: z.string(),
    })
  ),
  milestones: z.array(
    z.object({
      title: z.string().min(1, 'Milestone title is required'),
      amount: z.string(),
      deliveryDate: z.coerce.date(),
    })
  ),
});

export type TCreateOrderInput = z.infer<typeof createOrderZodSchema>;

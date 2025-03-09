import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';

// Demo Data
const emailsData = ['josafe2281@bnsteps.com', 'josafe22@bnstepsa.com', 'josafe228@bnsteps.com'];

// // payment seller schema
// export const paymentSellerSchema = z.object({
//   transactionType: z.string().min(1, 'Select an option.'),
//   sellerEmailPhoneNo: z.string().min(1, 'Seller email or phone number required.'),
//   sellerEmail: z.string().min(1, 'Email is required'),
//   sellerPhoneNo: z.string().min(1, 'Phone number is required.'),
//   item1Name: z.string().min(1, 'Name is required.'),
//   item1Quantity: z.string().min(1, 'Quentity is required.'),
//   item1Prize: z.string().min(1, 'Prize is required.'),
//   item2Name: z.string().optional(),
//   item2Quantity: z.string().optional(),
//   item2Prize: z.string().optional(),
//   detailAboutItem: z.string().min(1, 'Item detail is required.'),
//   paymentType: z.string().min(1, 'Payment type is required.'),
//   deliveryDate: z.coerce.date().optional(),
//   milestone1: z.string().optional(),
//   milestoneDeliveryDate: z.coerce.date().optional(),
//   milestone1Amount: z.string().optional(),
//   transactionFee: z.string().min(1, 'Transaction Fee is required.'),
// });

// export type TPaymentSeller = z.infer<typeof paymentSellerSchema>;

// Function to check if email exists
const checkEmailExists = async (email: string) => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(emailsData.includes(email));
    }, 5000);
  });
};

// // payment buyer schema
// export const paymentBuyerSchema = (
//   setLoading: (loading: boolean) => void,
//   setIsEmailExist: Dispatch<SetStateAction<boolean>>
// ) =>
//   z.object({
//     transactionType: z.string().min(1, 'Select an option.'),
//     buyerEmailPhoneNo: z
//       .string()
//       .min(1, 'Buyer email or phone number required.')
//       .superRefine(async (email, ctx) => {
//         try {
//           setLoading(true);
//           const exists = await checkEmailExists(email);
//           setLoading(false);

//           if (exists) {
//             // Email exists - we'll treat this as success
//             setIsEmailExist(true);
//             return true;
//           } else {
//             // Email doesn't exist - add an issue (error)
//             setIsEmailExist(false);
//             ctx.addIssue({
//               code: z.ZodIssueCode.custom,
//               message: 'Email is not registered',
//             });
//             return false;
//           }
//         } catch (error) {
//           setLoading(false);
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: 'Error checking email',
//           });
//           return false;
//         }
//       }),
//     buyerEmail: z.string().min(1, 'Email is required'),
//     buyerPhoneNo: z.string().min(1, 'Phone number is required.'),
//     item1Name: z.string().min(1, 'Name is required.'),
//     item1Quantity: z.string().min(1, 'Quentity is required.'),
//     item1Prize: z.string().min(1, 'Prize is required.'),
//     item2Name: z.string().optional(),
//     item2Quantity: z.string().optional(),
//     item2Prize: z.string().optional(),
//     detailAboutItem: z.string().min(1, 'Item detail is required.'),
//     paymentType: z.string().min(1, 'Payment type is required.'),
//     deliveryDate: z.coerce.date().optional(),
//     milestone1: z.string().optional(),
//     milestoneDeliveryDate: z.coerce.date().optional(),
//     milestone1Amount: z.string().optional(),
//     transactionFee: z.string().min(1, 'Transaction Fee is required.'),
//   });

// export type TPaymentBuyer = z.infer<ReturnType<typeof paymentBuyerSchema>>;

// NewOrder schema
export const newOrderSchema = (
  setLoading: (loading: boolean) => void,
  setIsEmailExist: Dispatch<SetStateAction<boolean>>,
  activeTab: string
) => {
  // Create common schema fields
  const baseSchema = {
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
    transactionFee: z.string().min(1, 'Transaction Fee is required.'),
  };

  // Email validation function (reused for both buyer and seller)
  const createEmailValidator = (fieldName: string) =>
    z
      .string()
      .min(1, `${activeTab === 'buyer' ? 'Buyer' : 'Seller'} email or phone number required.`)
      .superRefine(async (email, ctx) => {
        try {
          setLoading(true);
          const exists = await checkEmailExists(email);
          setLoading(false);

          if (exists) {
            // Email exists - we'll treat this as success
            setIsEmailExist(true);
            return true;
          } else {
            // Email doesn't exist - add an issue (error)
            setIsEmailExist(false);
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Email is not registered',
            });
            return false;
          }
        } catch (error) {
          setLoading(false);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Error checking email',
          });
          return false;
        }
      });

  // Create different schemas based on active tab
  if (activeTab === 'buyer') {
    return z.object({
      ...baseSchema,
      buyerEmailPhoneNo: createEmailValidator('buyerEmailPhoneNo'),
      sellerEmailPhoneNo: z.string().optional(),
    });
  } else {
    return z.object({
      ...baseSchema,
      buyerEmailPhoneNo: z.string().optional(),
      sellerEmailPhoneNo: createEmailValidator('sellerEmailPhoneNo'),
    });
  }
};

export type TNewOrder = z.infer<ReturnType<typeof newOrderSchema>>;

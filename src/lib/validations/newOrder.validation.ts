import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';

// Demo Data
const emailsData = [
  'josafe2281@bnsteps.com',
  'josafe22@bnstepsa.com',
  'josafe228@bnsteps.com',
  'liseg18768@bitflirt.com',
];

// Cache to store verified emails
const verifiedEmailsCache = new Map<string, boolean>();

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
  // Check cache first
  if (verifiedEmailsCache.has(email)) {
    return verifiedEmailsCache.get(email);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/validate-user?emailPhoneNo=${email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`Error validate user with email ${email}`);
  }

  const data = await response.json();
  const exists = data?.data?.exists;

  // Store in cache
  verifiedEmailsCache.set(email, exists);

  return exists;
};

// Function to clear cache (useful when you want to revalidate)
export const clearEmailCache = () => {
  verifiedEmailsCache.clear();
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
//               message: 'Email or Phone Number is not registered',
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
  setBuyerEmailValid: Dispatch<SetStateAction<boolean>>,
  setSellerEmailValid: Dispatch<SetStateAction<boolean>>,
  activeTab: string
) => {
  // Create common schema fields
  const baseSchema = {
    // role: z.string().min(1, 'Select an option.'),
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
  };

  // Buyer email validation function
  const buyerEmailValidator = z
    .string()
    .min(1, 'Buyer email or phone number required.')
    .superRefine(async (email, ctx) => {
      try {
        if (activeTab === 'buyer') {
          // Check if email is already verified in cache
          if (verifiedEmailsCache.has(email)) {
            const exists = verifiedEmailsCache.get(email);
            if (exists) {
              setBuyerEmailValid(true);
              return true;
            } else {
              setBuyerEmailValid(false);
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email or Phone Number is not registered',
              });
              return false;
            }
          }

          // If not in cache, make API call
          setLoading(true);
          const exists = await checkEmailExists(email);
          setLoading(false);

          if (exists) {
            setBuyerEmailValid(true);
            return true;
          } else {
            setBuyerEmailValid(false);
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Email or Phone Number is not registered',
            });
            return false;
          }
        }
        return true;
      } catch (error) {
        setLoading(false);
        setBuyerEmailValid(false);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Error checking email',
        });
        return false;
      }
    });

  // Seller email validation function
  const sellerEmailValidator = z
    .string()
    .min(1, 'Seller email or phone number required.')
    .superRefine(async (email, ctx) => {
      try {
        if (activeTab === 'seller') {
          // Check if email is already verified in cache
          if (verifiedEmailsCache.has(email)) {
            const exists = verifiedEmailsCache.get(email);
            if (exists) {
              setSellerEmailValid(true);
              return true;
            } else {
              setSellerEmailValid(false);
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email or Phone Number is not registered',
              });
              return false;
            }
          }

          // If not in cache, make API call
          setLoading(true);
          const exists = await checkEmailExists(email);
          setLoading(false);

          if (exists) {
            setSellerEmailValid(true);
            return true;
          } else {
            setSellerEmailValid(false);
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Email or Phone Number is not registered',
            });
            return false;
          }
        }
        return true;
      } catch (error) {
        setLoading(false);
        setSellerEmailValid(false);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Error checking email',
        });
        return false;
      }
    });

  // Return complete schema
  return z.object({
    ...baseSchema,
    buyerEmailPhoneNo: buyerEmailValidator,
    sellerEmailPhoneNo: sellerEmailValidator,
  });
};

export type TNewOrder = z.infer<ReturnType<typeof newOrderSchema>>;

export const createOrderZodSchema = z.object({
  buyerEmailPhoneNo: z.string().min(3, 'Invalid Buyer Email/Phone'),
  sellerEmailPhoneNo: z.string().min(3, 'Invalid Seller Email/Phone'),
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

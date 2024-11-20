// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// import ReInput from '@/components/re-ui/re-input/ReInput';
// import RePassInput from '@/components/re-ui/re-input/RePassInput';
// import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';
// import { ReButton } from '@/components/re-ui/ReButton';
// import { Form } from '@/components/ui/form';
// // import { useOtp } from '@/context/OtpProvider';
// import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
// // import { partialSignup } from '@/lib/actions/auth/signup.actions';
// import {
//   initialSignUpSchema,
//   TInitialSignUp,
//   UserRole,
// } from '@/lib/validations/userAuth.validations';

// type TReInitialSignupProps = {
//   role: UserRole;
//   step: string;
// };

// export default function ReInitialSignup({ role, step }: TReInitialSignupProps) {
//   const defaultValues = {
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//     role,
//   };

//   const handleNext = useSearchParamsHandler();
//   const { setEmail } = useOtp();

//   const form = useForm<TInitialSignUp>({
//     resolver: zodResolver(initialSignUpSchema),
//     defaultValues,
//     mode: 'onChange',
//   });

//   const { handleSubmit, formState } = form;

//   const { isSubmitting } = formState;

//   const onSubmit = async (data: TInitialSignUp) => {
//     try {
//       setEmail(data.email);
//       const response = await partialSignup(data);
//       console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

//       if (response?.success) {
//         handleNext('step', step);
//       } else {
//         toast.error(response?.error || 'Sign up Failed');
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Sign up Failed');
//     }
//   };

//   return (
//     <section>
//       <Form {...form}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-2">
//             <div>
//               <ReInput name="fullName" label="Full Name" required={true} />
//             </div>

//             <div>
//               <ReInput name="email" label="Email Address" required={true} />
//             </div>

//             <div>
//               <RePhoneNumberInput name="phoneNumber" label="Phone Number" required={true} />
//             </div>

//             <div>
//               <RePassInput name="password" label="Create Password" required={true} />
//             </div>

//             <div>
//               <RePassInput name="confirmPassword" label="Confirm Password" required={true} />
//             </div>

//             <div>
//               <ReButton
//                 isSubmitting={isSubmitting}
//                 type="submit"
//                 disabled={isSubmitting}
//                 className=" mt-6 w-full rounded-lg font-inter text-xl "
//               >
//                 Next
//               </ReButton>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </section>
//   );
// }

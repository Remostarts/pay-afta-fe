// 'use server';
// import { getServerSession } from 'next-auth';

// import { authOptions } from '@/lib/AuthOptions';
// import { getErrorMessage } from '@/lib/responseError';
// import { TBusinessDetailsInputs } from '@/components/view/dashboard/business-dashboard/settings/BusinessInformation';

// export async function businessProfileUpdate(formData: TBusinessDetailsInputs) {
//   console.log('🌼 🔥🔥 businessProfileUpdate 🔥🔥 formData🌼', formData);

//   const session = (await getServerSession(authOptions)) as any;
//   const token = session?.accessToken;

//   try {
//     const response = await fetch(`${process.env.BACKEND_URLL}/user/update-user-profile`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: token,
//       },
//       body: JSON.stringify(formData),
//       cache: 'no-store',
//     });

//     return response.json();
//   } catch (error) {
//     console.log('🌼 🔥🔥 partialSignup 🔥🔥 error🌼', error);

//     getErrorMessage(error);
//   }
// }

// 'use server';

// import { getErrorMessage } from '@/lib/responseError';
// import { feedbackInputZodSchema } from '@/lib/validations/feedback.validation';

// type CreateFeedbackParams = {
//   name: string;
//   email: string;
//   message: string;
// };

// export async function createFeedback(data: CreateFeedbackParams) {
//   const validation = feedbackInputZodSchema.safeParse(data);

//   if (!validation.success) {
//     let zodErrors = '';
//     validation.error.issues.forEach((issue) => {
//       zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
//     });
//     throw new Error(zodErrors);
//   }
//   try {
//     const response = await fetch(`${process.env.BACKEND_URLL}/feedback/create-feedback`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(validation.data),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to submit feedback');
//     }

//     const result = await response.json();
//     return { success: true, data: result };
//   } catch (error) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }

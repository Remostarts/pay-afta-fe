'use server';

import { getErrorMessage } from '@/lib/responseError';
import { TWhiteList, whiteListSchema } from '@/lib/validations/Utils';

export async function addToWhitelist(data: TWhiteList) {
  const validation = whiteListSchema.safeParse(data);
  console.log(validation);
  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    // console.log(formData);
    console.log(process.env.App_Script_Key);
    const response = await fetch(`${process.env.App_Script_Key}`, {
      method: 'POST',

      body: formData, // Send the FormData object as the request body
    });
    console.log('🌼 🔥🔥 addToWhitelist 🔥🔥 response🌼', response);
    const result = await response.json();
    return result;
  } catch (error) {
    return getErrorMessage(error);
  }
}

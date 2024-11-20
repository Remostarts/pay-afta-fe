// import { baseApi } from '@/redux/api/baseApi';
// import { TSigninInputs, TSignupInputs } from '@/types/formTypes';

// const AUTH_URL = '/auth';
// export const authApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     signin: build.mutation({
//       query: (signinData: TSigninInputs) => ({
//         url: `${AUTH_URL}/signin`,
//         method: 'POST',
//         data: signinData,
//       }),
//       invalidatesTags: ['user'],
//     }),
//     signup: build.mutation({
//       query: (signupData:TSignupInputs) => ({
//         url: `${AUTH_URL}/signup`,
//         method: 'POST',
//         data: signupData,
//       }),
//       invalidatesTags: ['user'],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useSigninMutation, useSignupMutation  } = authApi;

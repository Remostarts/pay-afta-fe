import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '@/helpers/axios/axiosBaseQuery';

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.PRO_CLEANER_BASE_API || 'http://localhost:8080/api/v1',
  }),
  endpoints: () => ({}),
  tagTypes: ['user'],
});

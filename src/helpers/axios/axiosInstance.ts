import axios from 'axios';

import { ResponseSuccessType, TGenericErrorResponse } from '@/types';

export const axiosInstance = axios.create();
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.post.Accept = 'application/json';
axiosInstance.defaults.timeout = 60000;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data,
      meta: response?.data?.meta,
      status: response?.data?.statusCode,
      statusText: response?.data?.message,
      headers: response?.headers,
      config: response?.config,
      success: response?.data?.success,
    };

    return responseObject;
  },

  function (error) {
    const responseObject: TGenericErrorResponse = {
      statusCode: error?.response?.data?.status || 500,
      errorName: error?.response?.data?.errorName || 'something wrong',
      errorMessages: error?.response?.data?.errorMessages,
    };
    return Promise.reject(error);
    // return responseObject;
  }
);

import { baseApi } from './api/baseApi';
import signinFormStepReducer from './features/auth/signinStepSlices';
import otpCounterReducer from './features/otpVerify/otpCounterSlice';
import otpTimerReducer from './features/otpVerify/otpTimerSlice';
import completedStepsReducer from './features/shared/StepperSlices';

export const reducer = {
  otpTimer: otpTimerReducer,
  otpCounter: otpCounterReducer,
  steps: completedStepsReducer,
  signinFormStep: signinFormStepReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

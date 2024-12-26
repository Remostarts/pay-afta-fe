import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export interface TOtpTimerState {
  timerOn: boolean;
}

const initialState: TOtpTimerState = {
  timerOn: false,
};

// otpSlice.js

const otpTimerSlice = createSlice({
  name: 'otpTimer',
  initialState,
  reducers: {
    setTimerOn: (state, action) => {
      state.timerOn = action.payload;
    },
  },
});

export const { setTimerOn } = otpTimerSlice.actions;
export const timerState = (state: RootState): boolean => state.otpTimer.timerOn;
export default otpTimerSlice.reducer;

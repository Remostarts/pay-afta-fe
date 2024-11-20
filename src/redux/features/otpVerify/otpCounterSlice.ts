import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';

export interface TOtpCounter {
  counter: number;
}

const initialState: TOtpCounter = {
  counter: 10,
};

// otpSlice.js

const otpCounterSlice = createSlice({
  name: 'otpCounter',
  initialState,
  reducers: {
    setCounter: (state, action: PayloadAction<number>) => {
      state.counter = action.payload;
    },
  },
});

export const { setCounter } = otpCounterSlice.actions;
export const counterState = (state: RootState): number => state.otpCounter.counter;
export default otpCounterSlice.reducer;

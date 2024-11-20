import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';

interface CompletedStepsState {
  completedSteps: number;
}

const initialState: CompletedStepsState = {
  completedSteps: 0,
};

const completedStepsSlice = createSlice({
  name: 'completedSteps',
  initialState,
  reducers: {
    setCompletedSteps: (state, action: PayloadAction<number>) => {
      state.completedSteps = action.payload;
    },
    incrementCompletedSteps: (state) => {
      state.completedSteps += 1;
    },
    decrementCompletedSteps: (state) => {
      state.completedSteps -= 1;
    },
  },
});

export const { setCompletedSteps, incrementCompletedSteps, decrementCompletedSteps } =
  completedStepsSlice.actions;

export const completedStepsState = (state: RootState): number => state.steps.completedSteps;
export default completedStepsSlice.reducer;

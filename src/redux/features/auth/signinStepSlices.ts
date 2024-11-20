import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// import { RootState } from '../../store';

type TFormSteps = {
  formStep: number;
};

const initialState: TFormSteps = {
  formStep: 0,
};

const formStepsSlice = createSlice({
  name: 'signinFormStep',
  initialState,
  reducers: {
    setFormStep: (state, action: PayloadAction<number>) => {
      state.formStep = action.payload;
    },
    incrementFormStep: (state) => {
      state.formStep += 1;
    },
    decrementFormStep: (state) => {
      state.formStep -= 1;
    },
  },
});

export const { setFormStep, incrementFormStep, decrementFormStep } = formStepsSlice.actions;

// export const signinFormStepState = (state: RootState): number => state.signinFormStep.formStep;
export default formStepsSlice.reducer;

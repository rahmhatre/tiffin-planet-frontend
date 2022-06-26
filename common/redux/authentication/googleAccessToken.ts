import { createSlice } from '@reduxjs/toolkit';

export const googleAccessToken = createSlice({
  name: 'GoogleAccessToken',
  initialState: {
    value: null,
  },
  reducers: {
    updateGoogleAccessToken: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateGoogleAccessToken } = googleAccessToken.actions;

export default googleAccessToken.reducer;

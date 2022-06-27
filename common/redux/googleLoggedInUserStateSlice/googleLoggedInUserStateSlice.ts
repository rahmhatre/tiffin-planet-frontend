import { createSlice } from '@reduxjs/toolkit';

export const googleLoggedInUserStateSlice = createSlice({
  name: 'GoogleLoggedInUserState',
  initialState: {
    value: null,
  },
  reducers: {
    updateGoogleLoggedInUserStateSlice: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateGoogleLoggedInUserStateSlice } = googleLoggedInUserStateSlice.actions;

export default googleLoggedInUserStateSlice.reducer;

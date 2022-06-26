import { createSlice } from '@reduxjs/toolkit';

export const loggedInUserStateSlice = createSlice({
  name: 'LoggedInUserState',
  initialState: {
    value: null,
  },
  reducers: {
    updateLoggedInUserStateSlice: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateLoggedInUserStateSlice } = loggedInUserStateSlice.actions;

export default loggedInUserStateSlice.reducer;

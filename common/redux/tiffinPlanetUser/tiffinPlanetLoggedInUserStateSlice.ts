import { createSlice } from '@reduxjs/toolkit';

export const tiffinPlanetLoggedInUserStateSlice = createSlice({
  name: 'TiffinPlanetLoggedInUserState',
  initialState: {
    value: null,
  },
  reducers: {
    updateTiffinPlanetLoggedInUserState: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTiffinPlanetLoggedInUserState } = tiffinPlanetLoggedInUserStateSlice.actions;

export default tiffinPlanetLoggedInUserStateSlice.reducer;

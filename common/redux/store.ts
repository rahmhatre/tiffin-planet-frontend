import { configureStore } from '@reduxjs/toolkit';
import googleAccessTokenReducer from './authentication/googleAccessToken';
import googleLoggedInUserStateReducer from './googleLoggedInUserStateSlice/googleLoggedInUserStateSlice';
import tiffinPlanetLoggedInUserStateReducer from './tiffinPlanetUser/tiffinPlanetLoggedInUserStateSlice';

export default configureStore({
  reducer: {
    GoogleAccessToken: googleAccessTokenReducer,
    GoogleLoggedInUserState: googleLoggedInUserStateReducer,
    TiffinPlanetLoggedInUserState: tiffinPlanetLoggedInUserStateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

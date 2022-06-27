import { configureStore } from '@reduxjs/toolkit';
import googleAccessTokenReducer from './authentication/googleAccessToken';
import googleLoggedInUserStateReducer from './googleLoggedInUserStateSlice/googleLoggedInUserStateSlice';

export default configureStore({
  reducer: {
    GoogleAccessToken: googleAccessTokenReducer,
    GoogleLoggedInUserState: googleLoggedInUserStateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

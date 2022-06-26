import { configureStore } from '@reduxjs/toolkit';
import googleAccessTokenReducer from './authentication/googleAccessToken';
import loggedInUserStateReducer from './loggedInUser/loggedInUserStateSlice';

export default configureStore({
  reducer: {
    GoogleAccessToken: googleAccessTokenReducer,
    LoggedInUserState: loggedInUserStateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

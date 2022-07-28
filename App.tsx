import React, { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import HomeScreen from './pages/Home/HomeScreen';
import OrderSelection from './pages/Orders/OrderSelection';
import OrderView from './pages/Admin/OrderView';
import { Provider as PaperProvider, DarkTheme, DefaultTheme } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store from './common/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterAndSignIn from './pages/Login/RegisterAndSignIn';
import { routes } from './common/routes/routes';
import { getValueFromSecureStorage } from './services/AxiosHelper';
import { Authentication } from './common/Enums';
import jwtDecode from 'jwt-decode';
import { TiffinPlanetAccessToken } from './common/Types';
import moment from 'moment';
// import {
//   DarkTheme as PaperDarkTheme,
//   DefaultTheme as PaperDefaultTheme,
// } from 'react-native-paper';

const LoginStack = createNativeStackNavigator();

export default function App() {
  // Set to true which will show the SignIn page as default
  const [tokenExpired, setTokenExpired] = useState<boolean>(true);

  // Check if we have a token stored in secure store and if its valid
  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await getValueFromSecureStorage(Authentication.Authorization);
      // Decode the JWT token
      var decodedToken: TiffinPlanetAccessToken = jwtDecode(accessToken!);
      // Get the token exp in datetime format
      const tokenExpiryTime = new Date(decodedToken?.exp * 1000);
      // Check if the token has been expired based on the exp time
      const isTokenExpired = moment().isSameOrAfter(tokenExpiryTime);
      setTokenExpired(isTokenExpired);
    };
    getAccessToken();
  }, []);

  // TODO: UNDO THIS ONCE THE AUTHENTICATION IS SORTED
  // useEffect(() => {
  //   const authenticate = async () => {
  //     const hasAuth = await LocalAuthentication.hasHardwareAsync();
  //     console.log(
  //       "🚀 ~ file: App.tsx ~ line 17 ~ authenticate ~ hasAuth",
  //       hasAuth
  //     );
  //     if (hasAuth) LocalAuthentication.authenticateAsync();
  //   };
  //   // TODO: Figure out how the authentication works
  //   // authenticate();
  // }, []);

  return (
    <Provider store={store}>
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer>
          <LoginStack.Navigator initialRouteName={routes.HomeScreen}>
            <LoginStack.Screen name={routes.HomeScreen} options={{ title: '' }} component={HomeScreen} />
            <LoginStack.Screen name={routes.RegisterAndSignIn} options={{ title: '' }} component={RegisterAndSignIn} />
            <LoginStack.Screen name={routes.Orders} options={{ title: 'Orders' }} component={OrderSelection} />
            <LoginStack.Screen name={routes.OrderView} options={{ title: 'Admin Order View' }} component={OrderView} />
          </LoginStack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

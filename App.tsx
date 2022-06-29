import React from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import Login from './pages/Login/Login';
import OrderSelection from './pages/Orders/OrderSelection';
import { Provider as PaperProvider, DarkTheme, DefaultTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './common/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './pages/Login/Register';
import { routes } from './common/routes/routes';
// import {
//   DarkTheme as PaperDarkTheme,
//   DefaultTheme as PaperDefaultTheme,
// } from 'react-native-paper';

const LoginStack = createNativeStackNavigator();

function LoginAndRegistrationStack() {
  return (
    // TODO: initial route is Orders for Dev change to original Login
    <LoginStack.Navigator initialRouteName={routes.Orders}>
      <LoginStack.Screen name={routes.Login} options={{ title: '' }} component={Login} />
      <LoginStack.Screen name={routes.Register} options={{ title: '' }} component={Register} />
      <LoginStack.Screen name={routes.Orders} component={OrderSelection} />
    </LoginStack.Navigator>
  );
}

export default function App() {
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
          <LoginAndRegistrationStack />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

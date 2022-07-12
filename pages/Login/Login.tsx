import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

// Authentication
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getMyGoogleInfoApi } from '../../services/GoogleService';
import { useDispatch, useSelector } from 'react-redux';
import { updateGoogleAccessToken } from '../../common/redux/authentication/googleAccessToken';
import { updateGoogleLoggedInUserStateSlice } from '../../common/redux/googleLoggedInUserStateSlice/googleLoggedInUserStateSlice';
import { Authentication, GoogleAuthStatus, RegistrationPageType } from '../../common/Enums';
import { routes } from '../../common/routes/routes';
import { RegisterService } from '../../services/RegisterService';
import { getValueFromSecureStorage } from '../../services/AxiosHelper';
import jwtDecode from 'jwt-decode';
import { TiffinPlanetAccessToken, TiffinPlanetUserSchema } from '../../common/Types';
import { UserService } from '../../services/UserService';
import { updateTiffinPlanetLoggedInUserState } from '../../common/redux/tiffinPlanetUser/tiffinPlanetLoggedInUserStateSlice';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }: any) {
  const [googleAccessToken, setGoogleAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const tiffinPlanetLoggedInUser: TiffinPlanetUserSchema = useSelector(TiffinPlanetLoggedInUserStateSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    // If logged In user identity found then navigate to orders page
    if (tiffinPlanetLoggedInUser) {
      navigation.navigate(routes.Orders);
    }
  }, [tiffinPlanetLoggedInUser]);

  // TODO: Below client Ids should come from config, env or secrets
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '803273470355-4itbc5q7v5584m0f62bou7n1r6u9e8ec.apps.googleusercontent.com',
    iosClientId: '803273470355-8k62puqfa2q97ikif8d7a2bmhg5kjq1m.apps.googleusercontent.com',
    androidClientId: '803273470355-odb3go70h65e4cqab8rifec63ufe9ki9.apps.googleusercontent.com',
  });

  // When google returns the callback response
  // Check for the response type and update the redux state
  useEffect(() => {
    setLoading(false);
    if (response?.type === GoogleAuthStatus.success) {
      dispatch(updateGoogleAccessToken(response));
      setGoogleAccessToken(response?.authentication?.accessToken!);
    }
  }, [response]);

  // Fetch the user info from google by the fetched access token
  useEffect(() => {
    const loginWithGoogleUserInfo = async () => {
      if (googleAccessToken) {
        // Get info from google
        const googleInfoResponse = await getMyGoogleInfoApi(googleAccessToken).catch((error: any) => {
          console.log('🚀 ~ file: Login.tsx ~ line 59 ~ getUserData ~ error', error);
        });

        // if we get a response from google
        if (googleInfoResponse) {
          // console.log('🚀 ~ file: Login.tsx ~ line 50 ~ loginWithGoogleUserInfo ~ googleInfoResponse', googleInfoResponse);
          // Save the google response in the store
          // TODO: this has user image which can be displayed in Avatar in future
          // dispatch(updateGoogleLoggedInUserStateSlice(googleInfoResponse));
          // setUserInfo(googleInfoResponse);

          try {
            // Login with Google Info
            await RegisterService.googleLogin(googleInfoResponse?.name, googleInfoResponse?.email);

            // Fetch access token from Secure Storage
            const accessToken = await getValueFromSecureStorage(Authentication.Authorization);

            // Decode the JWT token
            var decodedToken: TiffinPlanetAccessToken = jwtDecode(accessToken!);

            // Get logged In user by Id
            const userResponse: TiffinPlanetUserSchema = await UserService.getUserById(decodedToken?.userId);

            // Dispatch user context to redux and navigate user to respective screen
            dispatch(updateTiffinPlanetLoggedInUserState(userResponse));
            navigation.navigate(routes.Orders);
          } catch (error: any) {
            console.error('🚀 ~ file: Login.tsx ~ line 78 ~ loginWithGoogleUserInfo ~ error', error);
          }
        }
      }
    };
    loginWithGoogleUserInfo();
  }, [googleAccessToken]);

  // TODO: Remove if not used
  // // Display Google Image
  // const showUserInfo = () => {
  //   if (userInfo) {
  //     return (
  //       <View>
  //         <Image style={styles.imageLogo} source={{ uri: userInfo?.picture }}></Image>
  //         <Text variant="titleLarge">Welcome {userInfo?.name}</Text>
  //         <Text variant="titleLarge">{userInfo?.email}</Text>
  //       </View>
  //     );
  //   }
  // };

  // Navigate to Registration Page for Manual Sign in and Sign up flow
  const navigateToRegistrationPage = (pageType: RegistrationPageType) => {
    navigation.navigate(routes.Register, {
      registrationPageType: pageType,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} color={'purple'} />
      ) : (
        <>
          <View style={{ paddingBottom: 20 }}>
            <Image style={styles.companyLogo} source={require('./../../assets/tiffin_planet.png')} />
          </View>
          <View style={{ paddingBottom: 20 }}>
            <Text>The easiest way to start engaging with Tiffin Planet</Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <Button
              style={styles.buttonSize}
              icon="login"
              mode="contained"
              onPress={() => {
                promptAsync({ showInRecents: true });
                setLoading(true);
              }}
            >
              Login with Google
            </Button>
            <Button style={styles.buttonSize} mode="outlined" onPress={() => navigateToRegistrationPage(RegistrationPageType.SIGN_IN)}>
              Sign In
            </Button>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', width: '100%', alignItems: 'baseline' }}>
            <Text>Dont have an account? </Text>
            <Button mode="text" onPress={() => navigateToRegistrationPage(RegistrationPageType.SIGN_UP)}>
              Sign Up
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyLogo: {
    width: 230,
    height: 100,
  },
  imageLogo: {
    width: 150,
    height: 150,
  },
  buttonSize: {
    width: 230,
  },
});

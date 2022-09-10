import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import getEnvVars from '../../environment';
const { expoClientId, iosClientId, androidClientId } = getEnvVars();

// Authentication
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getMyGoogleInfoApi } from '../../services/GoogleService';
import { useDispatch, useSelector } from 'react-redux';
import { updateGoogleAccessToken } from '../../common/redux/authentication/googleAccessToken';
import { updateGoogleLoggedInUserStateSlice } from '../../common/redux/googleLoggedInUserStateSlice/googleLoggedInUserStateSlice';
import { Authentication, GoogleAuthStatus, RegistrationPageType, UserType } from '../../common/Enums';
import { routes } from '../../common/routes/routes';
import { RegisterService } from '../../services/RegisterService';
import { getValueFromSecureStorage } from '../../services/AxiosHelper';
import jwtDecode from 'jwt-decode';
import { TiffinPlanetAccessToken, TiffinPlanetUserSchema } from '../../common/Types';
import { UserService } from '../../services/UserService';
import { updateTiffinPlanetLoggedInUserState } from '../../common/redux/tiffinPlanetUser/tiffinPlanetLoggedInUserStateSlice';
import { TiffinPlanetLoggedInUserStateSelector } from '../../common/redux/selectors';
import { registerForPushNotificationsAsync } from '../../common/notifications/notifications';

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({ navigation }: any) {
  const [googleAccessToken, setGoogleAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const tiffinPlanetLoggedInUser: TiffinPlanetUserSchema = useSelector(TiffinPlanetLoggedInUserStateSelector);
  const dispatch = useDispatch();

  // Notifications
  const [expoPushToken, setExpoPushToken] = useState<string>();
  useEffect(() => {
    if (!expoPushToken) {
      registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
      });
    }
  }, []);

  // TODO: Remove logic to send
  // Dummy Notifications
  // const schedulePushNotification = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'Coadjute 🎈',
  //       body: 'Here is the notification body',
  //       data: { data: 'Meta Data' },
  //     },
  //     trigger: { seconds: 2 },
  //   });
  // };

  useEffect(() => {
    // If logged In user identity found then navigate to orders page
    if (tiffinPlanetLoggedInUser) {
      if (tiffinPlanetLoggedInUser?.userType === UserType.USER) {
        navigation.navigate(routes.Orders);
      } else {
        navigation.navigate(routes.OrderView);
      }
    }
  }, [tiffinPlanetLoggedInUser]);

  // TODO: Below client Ids should come from config, env or secrets
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: expoClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
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
    const loginToTiffinPlanetWithGoogleUserInfo = async () => {
      if (googleAccessToken) {
        // Set Loading
        setLoading(true);

        // Get info from google
        const googleInfoResponse = await getMyGoogleInfoApi(googleAccessToken).catch((error: any) => {
          console.error('🚀 ~ file: Login.tsx ~ line 59 ~ getUserData ~ error', error);
        });

        // Response from Google
        if (googleInfoResponse) {
          console.log('🚀 ~ file: HomeScreen.tsx ~ line 72 ~ loginToTiffinPlanetWithGoogleUserInfo ~ googleInfoResponse', googleInfoResponse);

          // Save the Google Response in the store
          dispatch(updateGoogleLoggedInUserStateSlice(googleInfoResponse));
          setUserInfo(googleInfoResponse);

          try {
            // Login with Google Info
            await RegisterService.googleLogin(googleInfoResponse?.name, googleInfoResponse?.email);

            // Fetch access token from Secure Storage
            const accessToken = await getValueFromSecureStorage(Authentication.Authorization);

            // Decode the JWT token
            var decodedToken: TiffinPlanetAccessToken = jwtDecode(accessToken!);

            // Update the User with expo notification token if present
            if (expoPushToken) {
              await UserService.patchUserById(decodedToken?.userId, {
                expoPushNotificationToken: expoPushToken,
              });
            }

            // Get logged In user by Id
            const userResponse: TiffinPlanetUserSchema = await UserService.getUserById(decodedToken?.userId);

            // Dispatch user context to redux and navigate user to respective screen
            dispatch(updateTiffinPlanetLoggedInUserState(userResponse));

            // If user type is user then navigate to Order page else Order View Page
            if (userResponse?.userType === UserType.USER) {
              navigation.navigate(routes.Orders);
            } else {
              navigation.navigate(routes.OrderView);
            }
          } catch (error: any) {
            console.error('🚀 ~ file: HomeScreen.tsx ~ line 101 ~ loginToTiffinPlanetWithGoogleUserInfo ~ error', error);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    loginToTiffinPlanetWithGoogleUserInfo();
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
    navigation.navigate(routes.RegisterAndSignIn, {
      registrationPageType: pageType,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" color={'purple'} />
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
              style={styles.loginWithGoogleBtn}
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
          {/* <View style={{ marginTop: 90 }}>
            <Text>Expo Token: {expoPushToken}</Text>
            <Button
              mode="text"
              onPress={() => {
                schedulePushNotification();
              }}
            >
              Send Notification
            </Button>
          </View> */}
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
  loginWithGoogleBtn: {
    width: 230,
    marginBottom: 10,
  },
  buttonSize: {
    width: 230,
  },
});

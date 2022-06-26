import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';

// Authentication
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { LoginApi } from '../../services/LoginService';
import { useDispatch } from 'react-redux';
import { updateGoogleAccessToken } from '../../common/redux/authentication/googleAccessToken';
import { updateLoggedInUserStateSlice } from '../../common/redux/loggedInUser/loggedInUserStateSlice';
import { GoogleAuthStatus } from '../../common/Enums';
import { routes } from '../../common/routes/routes';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }: any) {
  const [accessToken, setAccessToken] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>();
  const dispatch = useDispatch();

  // TODO: Below client Ids should come from config, env or secrets
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '803273470355-4itbc5q7v5584m0f62bou7n1r6u9e8ec.apps.googleusercontent.com',
    iosClientId: '803273470355-8k62puqfa2q97ikif8d7a2bmhg5kjq1m.apps.googleusercontent.com',
    androidClientId: '803273470355-odb3go70h65e4cqab8rifec63ufe9ki9.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === GoogleAuthStatus.success) {
      dispatch(updateGoogleAccessToken(response));
      setAccessToken(response?.authentication?.accessToken!);
      console.log('🚀 ~ file: Login.tsx ~ line 23 ~ useEffect ~ response', response);

      // TODO: Check if the user already exists in the system

      // TODO: If the user is not present then create one and navigate to Orders Page

      // Navigate the user to Orders Screen once he is signed up and authenticated
      navigation.navigate(routes.Orders);
    }
  }, [response]);

  useEffect(() => {
    const getUserData = async () => {
      if (accessToken) {
        await LoginApi(accessToken).then((response: any) => {
          console.log('🚀 ~ file: Login.tsx ~ line 45 ~ userInfo ~ response', response);
          dispatch(updateLoggedInUserStateSlice(response));
          setUserInfo(response);
        });
      }
    };
    getUserData();
  }, [accessToken]);

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

  // Navigate to Registration Page
  const navigateToRegistrationPage = () => {
    navigation.navigate(routes.Register);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        <Image style={styles.companyLogo} source={require('./../../assets/tiffin_planet.png')} />
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Text>The easiest way to start engaging with Tiffin Planet</Text>
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Button
          style={{ width: 230 }}
          icon="login"
          mode="contained"
          onPress={() => {
            promptAsync({ showInRecents: true });
          }}
        >
          Login with Google
        </Button>
      </View>
      <View>
        <Button style={styles.buttonSize} mode="outlined" onPress={navigateToRegistrationPage}>
          Sign In
        </Button>
        <Button style={styles.buttonSize} mode="outlined" onPress={navigateToRegistrationPage}>
          Sign Up
        </Button>
      </View>
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
    width: 200,
  },
});

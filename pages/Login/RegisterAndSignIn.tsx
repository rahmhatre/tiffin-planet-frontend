import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Authentication, RegistrationPageType, UserType } from '../../common/Enums';
import { updateTiffinPlanetLoggedInUserState } from '../../common/redux/tiffinPlanetUser/tiffinPlanetLoggedInUserStateSlice';
import { routes } from '../../common/routes/routes';
import { TiffinPlanetAccessToken, TiffinPlanetUserSchema } from '../../common/Types';
import { changeNullToUndefined } from '../../common/utils/utils';
import { getValueFromSecureStorage } from '../../services/AxiosHelper';
import { RegisterService } from '../../services/RegisterService';
import { UserService } from '../../services/UserService';

export default function RegisterAndSignIn({ route, navigation }: any) {
  const { registrationPageType } = route.params;
  // TODO: store the logged in user in the store
  const dispatch = useDispatch();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: registrationPageType === RegistrationPageType.SIGN_UP ? 'Sign Up' : 'Sign In',
    });
  }, [registrationPageType]);

  const signUpOrSignInUser = async () => {
    if (registrationPageType === RegistrationPageType.SIGN_UP) {
      await createUser();
    } else {
      await signInUser();
    }
  };

  const fetchJwtTokenAndNavigateUser = async () => {
    // Fetch access token from Secure Storage
    const accessToken = await getValueFromSecureStorage(Authentication.Authorization);

    // Decode the JWT token
    var decodedToken: TiffinPlanetAccessToken = jwtDecode(accessToken!);

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
  };

  const signInUser = async () => {
    setDisableSubmitBtn(true);

    // Check for null values
    if (!password || !email) {
      Alert.alert(`All fields are mandatory to sign in.`);
      setDisableSubmitBtn(false);
      return;
    }

    try {
      // Login with User Credential Flow
      await RegisterService.loginUser(changeNullToUndefined(email)!, password);
      setDisableSubmitBtn(false);

      await fetchJwtTokenAndNavigateUser();
    } catch (error: any) {
      setDisableSubmitBtn(false);
      console.error('🚀 ~ file: Register.tsx ~ line 37 ~ signInUser ~ error', error);
      Alert.alert(`Unable to sign in, please check the details again or contact support.`);
    }
  };

  const createUser = async () => {
    setDisableSubmitBtn(true);
    console.log('🚀 ~ file: Register.tsx ~ line 10 ~ Register ~ name', name, email, password);

    // Check for null values
    if (!name || !password || !email || !confirmPassword) {
      Alert.alert(`All fields are mandatory to register.`);
      setDisableSubmitBtn(false);
      return;
    }

    // Check if the password and confirm password is the same
    if (password !== confirmPassword) {
      Alert.alert(`Your password and confirmation password do not match.`);
      setDisableSubmitBtn(false);
      return;
    }

    // Construct post payload
    const userPayload = {
      name: changeNullToUndefined(name),
      email: changeNullToUndefined(email),
      userType: UserType.USER,
      password: password,
    };

    try {
      await RegisterService.registerUser(userPayload);
      setDisableSubmitBtn(false);

      await fetchJwtTokenAndNavigateUser();
    } catch (error) {
      setDisableSubmitBtn(false);
      console.error('🚀 ~ file: Register.tsx ~ line 37 ~ createUser ~ error', error);
      Alert.alert(`Unable to register, please check the details again or contact support.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        <Image style={styles.companyLogo} source={require('./../../assets/tiffin_planet.png')} />
      </View>
      {/* Name */}
      {registrationPageType === RegistrationPageType.SIGN_UP ? (
        <View style={{ paddingBottom: 10 }}>
          <TextInput mode="outlined" label="Name" autoComplete="name" textContentType="name" onChangeText={setName} value={name} />
        </View>
      ) : null}
      {/* Email */}
      <View style={{ paddingBottom: 10 }}>
        <TextInput mode="outlined" label="Email" autoComplete="email" textContentType="emailAddress" onChangeText={setEmail} value={email} />
      </View>
      <View style={{ paddingBottom: 10 }}>
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry={hidePassword}
          right={<TextInput.Icon name={hidePassword ? 'eye' : 'eye-off'} onPress={() => setHidePassword((prev) => !prev)} forceTextInputFocus={false} />}
          autoComplete="password"
          textContentType="password"
          onChangeText={setPassword}
          value={password}
        />
      </View>
      {registrationPageType === RegistrationPageType.SIGN_UP ? (
        <View style={{ paddingBottom: 30 }}>
          <TextInput
            mode="outlined"
            label="Confirm Password"
            secureTextEntry={hidePassword}
            right={<TextInput.Icon name={hidePassword ? 'eye' : 'eye-off'} onPress={() => setHidePassword((prev) => !prev)} forceTextInputFocus={false} />}
            autoComplete="password"
            textContentType="password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
        </View>
      ) : null}
      <View style={styles.signUpButtons}>
        <Button style={styles.buttonSize} mode="contained" disabled={disableSubmitBtn} onPress={signUpOrSignInUser}>
          {registrationPageType === RegistrationPageType.SIGN_UP ? 'Sign Up' : 'Sign In'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
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
  input: {
    borderRadius: 10,
    height: 40,
    width: 230,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  signUpButtons: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
});

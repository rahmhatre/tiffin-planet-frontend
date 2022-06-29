import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AuthMode, RegistrationPageType, UserType } from '../../common/Enums';
import { routes } from '../../common/routes/routes';
import { changeNullToUndefined } from '../../common/utils/utils';
import { RegisterService } from '../../services/RegisterService';

export default function Register({ route, navigation }: any) {
  const { registrationPageType } = route.params;
  // TODO: store the logged in user in the store
  const dispatch = useDispatch();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
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

  const signInUser = async () => {
    setDisableSubmitBtn(true);
    console.log('🚀 ~ file: Register.tsx ~ line 10 ~ signInUser ~ name', name, email, password);

    // Check for null values
    if (!password || !email) {
      Alert.alert(`All fields are mandatory to sign in.`);
      setDisableSubmitBtn(false);
      return;
    }

    await RegisterService.loginUser(changeNullToUndefined(email)!, password)
      .then((_response: any) => {
        setDisableSubmitBtn(false);
        Alert.alert(`Signed in successfully.`);
        navigation.navigate(routes.Orders);
      })
      .catch((error: any) => {
        setDisableSubmitBtn(false);
        console.error('🚀 ~ file: Register.tsx ~ line 37 ~ signInUser ~ error', error);
        Alert.alert(`Unable to sign in, please check the details again or contact support.`);
      });
  };

  const createUser = async () => {
    setDisableSubmitBtn(true);
    console.log('🚀 ~ file: Register.tsx ~ line 10 ~ Register ~ name', name, email, password);

    // Check for null values
    if (!name || !password || !email) {
      Alert.alert(`All fields are mandatory to register.`);
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

    await RegisterService.registerUser(userPayload)
      .then((_response: any) => {
        setDisableSubmitBtn(false);
        Alert.alert(`Registered successfully.`);
        navigation.navigate(routes.Orders);
      })
      .catch((error: any) => {
        setDisableSubmitBtn(false);
        console.error('🚀 ~ file: Register.tsx ~ line 37 ~ createUser ~ error', error);
        Alert.alert(`Unable to register, please check the details again or contact support.`);
      });
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
      <View style={{ paddingBottom: 30 }}>
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

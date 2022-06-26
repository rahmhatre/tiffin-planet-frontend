import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AuthMode } from '../../common/Enums';
import { routes } from '../../common/routes/routes';
import { changeNullToUndefined } from '../../common/utils/utils';
import { UserService } from '../../services/UserService';

export default function Register({ navigation }: any) {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [disableSignUp, setDisableSignUp] = useState<boolean>(false);

  // Notification
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>();
  const onDismissSnackBar = () => setShowNotification(false);

  // TODO:
  // Make notification component simple to show success and error notificaitons
  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const createUser = async () => {
    setDisableSignUp(true);
    console.log('🚀 ~ file: Register.tsx ~ line 10 ~ Register ~ name', name, email, password);

    // Check for null values
    if (!name || !password || !email) {
      displayNotification('All fields are mandatory to register.');
      setDisableSignUp(false);
      return;
    }

    // Construct post payload
    const userPayload = {
      name: changeNullToUndefined(name),
      email: changeNullToUndefined(email),
      authMode: AuthMode.CLASSIC,
      password: password,
    };

    await UserService.postUser(userPayload)
      .then((_response: any) => {
        setDisableSignUp(false);
        displayNotification('Registered successfully.');
        // navigation.navigate(routes.Orders);
      })
      .catch((error: any) => {
        setDisableSignUp(false);
        console.error('🚀 ~ file: Register.tsx ~ line 37 ~ createUser ~ error', error);
        displayNotification('Unable to register, please check the details again or contact support.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        <Image style={styles.companyLogo} source={require('./../../assets/tiffin_planet.png')} />
      </View>
      {/* Name */}
      <View style={{ paddingBottom: 10 }}>
        <TextInput mode="outlined" label="Name" autoComplete="name" textContentType="name" onChangeText={setName} value={name} />
      </View>
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
      <View style={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
        <Button style={styles.buttonSize} mode="contained" disabled={disableSignUp} onPress={createUser}>
          Sign Up
        </Button>
      </View>

      {/* Notification on success or failure */}
      <Snackbar
        style={styles.snackbar}
        visible={showNotification}
        onDismiss={onDismissSnackBar}
        action={{
          icon: 'close',
          onPress: () => {
            // Do something
          },
        }}
      >
        {notificationMessage}
      </Snackbar>
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
  snackbar: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
});

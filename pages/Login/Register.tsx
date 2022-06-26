import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { routes } from '../../common/routes/routes';

export default function Register({ navigation }: any) {
  const dispatch = useDispatch();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const createUser = () => {
    console.log('🚀 ~ file: Register.tsx ~ line 10 ~ Register ~ name', name, email, password);
    navigation.navigate(routes.Orders);
  };

  return (
    <View style={styles.container}>
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
      <View>
        <Button style={styles.buttonSize} mode="contained" onPress={createUser}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 100,
    // height: 100,
    // height: '100%',
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
});

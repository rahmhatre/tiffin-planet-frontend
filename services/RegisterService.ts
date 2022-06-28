import { TiffinPlanetAPI } from './AxiosHelper';
const baseURL = '/api';

async function registerUser(userBody: any) {
  const { data } = await TiffinPlanetAPI().post(`${baseURL}/register`, userBody);
  return data;
}

async function loginUser(email: string, password: string) {
  const payload = {
    email: email,
    password: password,
  };
  const url = `${baseURL}/login`;
  const { data } = await TiffinPlanetAPI().post(url, payload);
  return data;
}

async function googleLogin(name: string, email: string) {
  const payload = {
    email: email,
    name: name,
  };
  const url = `${baseURL}/googlelogin`;
  const { data } = await TiffinPlanetAPI().post(url, payload);
  return data;
}

export const RegisterService = {
  registerUser,
  loginUser,
  googleLogin,
};

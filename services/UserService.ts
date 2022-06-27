import { ConstructUrlFromQueryParams } from '../common/utils/utils';
import { TiffinPlanetAPI } from './AxiosHelper';
const baseURL = '/api/users';

async function getUsers(queryParams = {}) {
  const url = `${baseURL}${ConstructUrlFromQueryParams(queryParams)}`;
  const { data } = await TiffinPlanetAPI().get(url);
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

async function postUser(userBody: any) {
  const { data } = await TiffinPlanetAPI().post(baseURL, userBody);
  return data;
}

async function getUserById(userId: string) {
  const url = `${baseURL}/${userId}`;
  const { data } = await TiffinPlanetAPI().get(url);
  return data;
}

export const UserService = {
  getUsers,
  loginUser,
  postUser,
  getUserById,
};

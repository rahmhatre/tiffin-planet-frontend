import { ConstructUrlFromQueryParams } from '../common/utils/utils';
import { getAuthTokenAsHeader, TiffinPlanetAPI } from './AxiosHelper';
const baseURL = '/api/users';

async function getUsers(queryParams = {}) {
  const authHeader = await getAuthTokenAsHeader();
  const url = `${baseURL}${ConstructUrlFromQueryParams(queryParams)}`;
  const { data } = await TiffinPlanetAPI(authHeader).get(url);
  return data;
}

async function getUserById(userId: string) {
  const authHeader = await getAuthTokenAsHeader();
  const url = `${baseURL}/${userId}`;
  const { data } = await TiffinPlanetAPI(authHeader).get(url);
  return data;
}

export const UserService = {
  getUsers,
  getUserById,
};

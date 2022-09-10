import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Authentication } from '../common/Enums';
import getEnvVars from '../environment';
const { apiUrl } = getEnvVars();

export const ApiCall = (baseURL: string, headers?: any) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      ...headers,
    },
  });
  instance.interceptors.request.use(
    (config: any) => {
      return config;
    },
    (error: any) => {
      Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    async (response) => {
      if (response?.headers?.authorization) {
        await secureStorageSave(Authentication.Authorization, response?.headers?.authorization);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return instance;
};

export const TiffinPlanetAPI = (additionalHeaders?: any) => {
  const headers = {
    ...additionalHeaders,
    'Content-Type': 'application/json',
  };
  // TODO: Need to read this from ENV File
  return ApiCall(apiUrl, headers);
};

export const secureStorageSave = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getValueFromSecureStorage = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
};

export const getAuthTokenAsHeader = async () => {
  const accessToken = await getValueFromSecureStorage(Authentication.Authorization);
  return {
    authorization: `Bearer ${accessToken}`,
  };
};

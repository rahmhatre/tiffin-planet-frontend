import axios from 'axios';

export const ApiCall = (baseURL: string, headers?: any) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      ...headers,
    },
  });
  instance.interceptors.request.use(
    (config: any) => config,
    (error: any) => {
      Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    (response) => {
      if (response?.headers?.authorization) {
        console.log('🚀 ~ file: AxiosHelper.ts ~ line 20 ~ ApiCall ~ response', response?.headers?.authorization);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return instance;
};

export const TiffinPlanetAPI = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // TODO: Need to read this from ENV File
  return ApiCall('https://staging-tiffin-planet-ws.herokuapp.com', headers);
};

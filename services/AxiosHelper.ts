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
  return instance;
};

export const TiffinPlanetAPI = () => {
  // const headers = {
  //   Authorization: `Bearer ${access_token}`,
  // };
  // TODO: Need to read this from ENV File
  return ApiCall('https://staging-tiffin-planet-ws.herokuapp.com');
};

import axios from "axios";

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
    }
  );
  return instance;
};

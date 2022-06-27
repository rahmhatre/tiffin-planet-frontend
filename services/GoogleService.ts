import { ApiCall } from './AxiosHelper';

export const getMyGoogleInfoApi = async (access_token: string) => {
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const { data } = await ApiCall('https://www.googleapis.com', headers).get('/userinfo/v2/me');
  return data;
};

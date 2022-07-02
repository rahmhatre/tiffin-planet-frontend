import { ConstructUrlFromQueryParams } from '../common/utils/utils';
import { TiffinPlanetAPI } from './AxiosHelper';
const baseURL = '/api/orders';

async function postOrder(userBody: any) {
  const { data } = await TiffinPlanetAPI().post(baseURL, userBody);
  return data;
}

async function getOrders(queryParams = {}) {
  const url = `${baseURL}${ConstructUrlFromQueryParams(queryParams)}`;
  const { data } = await TiffinPlanetAPI().get(url);
  return data;
}

async function getOrderById(orderId: string) {
  const url = `${baseURL}/${orderId}`;
  const { data } = await TiffinPlanetAPI().get(url);
  return data;
}

export const OrderService = {
  postOrder,
  getOrders,
  getOrderById,
};

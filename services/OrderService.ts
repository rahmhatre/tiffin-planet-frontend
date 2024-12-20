import { OrderStatus } from '../common/Enums';
import { ConstructUrlFromQueryParams } from '../common/utils/utils';
import { getAuthTokenAsHeader, TiffinPlanetAPI } from './AxiosHelper';
const baseURL = '/api/orders';

async function postOrder(userBody: any) {
  const authHeader = await getAuthTokenAsHeader();
  const { data } = await TiffinPlanetAPI(authHeader).post(baseURL, userBody);
  return data;
}

async function getOrders(queryParams = {}) {
  const authHeader = await getAuthTokenAsHeader();
  const url = `${baseURL}${ConstructUrlFromQueryParams(queryParams)}`;
  const { data } = await TiffinPlanetAPI(authHeader).get(url);
  return data;
}

async function getOrderById(orderId: string) {
  const authHeader = await getAuthTokenAsHeader();
  const url = `${baseURL}/${orderId}`;
  const { data } = await TiffinPlanetAPI(authHeader).get(url);
  return data;
}

async function patchOrder(orderId: string, status: OrderStatus) {
  const authHeader = await getAuthTokenAsHeader();
  const url = `${baseURL}/${orderId}`;
  const { data } = await TiffinPlanetAPI(authHeader).patch(url, { status });
  return data;
}

export const OrderService = {
  postOrder,
  getOrders,
  getOrderById,
  patchOrder,
};

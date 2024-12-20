import { OrderStatus, UserType } from './Enums';

export interface TiffinPlanetAccessToken {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  userId: string;
}

export interface TiffinPlanetUserSchema {
  _id: string; // USER ID
  accessToken: string;
  authMode: string;
  createdAt: string;
  email: string;
  isShopVerified: boolean;
  name: string;
  status: string;
  updatedAt: string;
  userType: UserType;
  expoPushNotificationToken?: string;
}

export interface TiffinPlanetOrderSchema {
  _id: string;
  createdAt: Date;
  orderShipmentDate: Date;
  status: OrderStatus;
  updatedAt: Date;
  userId: string;
}

export interface TiffinPlanetUIOrderViewSchema {
  _id: string;
  createdAt: Date;
  orderShipmentDate: Date;
  status: OrderStatus;
  updatedAt: Date;
  userId: string;
  user?: TiffinPlanetUserSchema;
  avatarColor: string; // Used for UI only
}

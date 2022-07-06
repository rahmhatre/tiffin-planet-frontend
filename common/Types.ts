import { UserType } from './Enums';

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
}

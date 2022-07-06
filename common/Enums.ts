export enum Authentication {
  Authorization = 'Authorization',
}

export enum GoogleAuthStatus {
  success = 'success',
  error = 'error',
}

export enum DateFormat {
  UK = 'DD/MM/YYYY',
  UK_TIME = 'hh:mm A DD/MM/YYYY',
}

export enum AuthMode {
  GOOGLE = 'GOOGLE',
  CLASSIC = 'CLASSIC',
}

export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
}

export enum RegistrationPageType {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
}

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  TRANSIT = 'TRANSIT',
  PAYMENTDUE = 'PAYMENTDUE',
  PROBLEM = 'PROBLEM',
}

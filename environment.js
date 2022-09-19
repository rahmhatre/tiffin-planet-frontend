import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';
// const localhost = Platform.OS === 'ios' ? 'localhost:3000' : '10.0.2.2:8080';

const ENV = {
  dev: {
    apiUrl: 'https://staging-tiffin-planet-ws.herokuapp.com',
    expoClientId: '803273470355-4itbc5q7v5584m0f62bou7n1r6u9e8ec.apps.googleusercontent.com',
    iosClientId: '803273470355-8k62puqfa2q97ikif8d7a2bmhg5kjq1m.apps.googleusercontent.com',
    androidClientId: '803273470355-odb3go70h65e4cqab8rifec63ufe9ki9.apps.googleusercontent.com',
  },
  staging: {
    apiUrl: 'https://staging-tiffin-planet-ws.herokuapp.com',
    expoClientId: '803273470355-4itbc5q7v5584m0f62bou7n1r6u9e8ec.apps.googleusercontent.com',
    iosClientId: '803273470355-8k62puqfa2q97ikif8d7a2bmhg5kjq1m.apps.googleusercontent.com',
    androidClientId: '803273470355-odb3go70h65e4cqab8rifec63ufe9ki9.apps.googleusercontent.com',
  },
  prod: {
    apiUrl: '[your.production.api.here]',
    expoClientId: '803273470355-4itbc5q7v5584m0f62bou7n1r6u9e8ec.apps.googleusercontent.com',
    iosClientId: '803273470355-8k62puqfa2q97ikif8d7a2bmhg5kjq1m.apps.googleusercontent.com',
    androidClientId: '803273470355-odb3go70h65e4cqab8rifec63ufe9ki9.apps.googleusercontent.com',
  },
};

const getEnvVars = (env = Updates.channel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  } else {
    return ENV.prod;
  }
};

export default getEnvVars;

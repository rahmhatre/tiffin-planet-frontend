# Tiffin Planet Frontent

## Run app locally

- Install the node modules by `yarn install`
- To start the IOS project run `yarn ios` and to run android run `yarn android`
- Please set the `.env` file with the required clientIds to enable login with google for iOS / Android and Expo (Local Debugging)

## How to deploy to App Store and Google Play Store

- run the command `expo publish` to create bundles which would be automatically be build in [expo cloud](https://expo.dev/)
- for more info please refer https://docs.expo.dev/workflow/publishing/

# Build and publish app locally

- Refer URL - https://docs.expo.dev/build/introduction/
- have to install `npm install -g eas-cli` to build apk or ios app
- To configure the app for ios / android run `eas build:configure`
- Run `eas build --platform all` to create build for both
- `eas build --platform ios` or `eas build --platform android` for individual builds
- Run `eas build -p android --profile preview2` which has been configured in `eas.json` to generate `apk` build

# Tiffin Planet Frontent

## Run app locally

- Install the node modules by `yarn install`
- To start the project run `npx run start` or `yarn start`
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

# Deployments and Storing Environment variables

Expo has introduced Release Channels to manage environment variables to be switched between different local, staging and production builds
Refer the [article](https://alxmrtnz.com/thoughts/2019/03/12/environment-variables-and-workflow-in-expo.html) to get to know how were release channels setup and replaced the `.env` file which react uses as default.

## Creating and Uploading an Initial Build

To create build for staging / production we need to add additional params to define the release channel configured for the build.

This can be achieved by

```
eas build -p android --profile preview2
```

or

```
eas build -p ios --profile preview2
```

## Publishing Updates to the Uploaded Build

Whenever you do want to publish updates, you can then run:

```
expo publish --release-channel staging
```

## App Store/Google Play (“production”)

When you want to go live, building and publishing is just like that of the staging environment, however you designate your release channel as `prod`:

### Building binary for upload:

```
expo build:ios --release-channel prod
```

or

```
expo build:android --release-channel prod
```

Publishing updates:

```
expo publish --release-channel prod
```

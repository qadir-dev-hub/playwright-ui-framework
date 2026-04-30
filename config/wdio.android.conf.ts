import path from 'path';
import type { Options } from '@wdio/types';

const androidSdkRoot =
  process.env.ANDROID_SDK_ROOT ??
  process.env.ANDROID_HOME ??
  'C:\\Users\\aqadi\\AppData\\Local\\Android\\Sdk';
const javaHome =
  process.env.JAVA_HOME ?? 'C:\\Program Files\\Android\\Android Studio\\jbr';

process.env.ANDROID_HOME = androidSdkRoot;
process.env.ANDROID_SDK_ROOT = androidSdkRoot;
process.env.JAVA_HOME = javaHome;
process.env.PATH = `${javaHome}\\bin;${androidSdkRoot}\\platform-tools;${process.env.PATH ?? ''}`;

const appPath =
  process.env.ANDROID_APP_PATH ??
  path.resolve(
    process.cwd(),
    'Mobile_apps',
    'Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
  );

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['../tests/mobile/android/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,
  framework: 'mocha',
  reporters: ['spec'],
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: '127.0.0.1',
          port: 4723,
          basePath: '/',
        },
      },
    ],
  ],
  port: 4723,
  path: '/',
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Pixel 5',
      'appium:udid': process.env.ANDROID_UDID ?? 'emulator-5554',
      'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '11',
      'appium:app': appPath,
      'appium:appPackage': 'com.swaglabsmobileapp',
      'appium:appActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:appWaitActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:newCommandTimeout': 120,
      'appium:noReset': false,
      'appium:fullReset': false,
    },
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
};

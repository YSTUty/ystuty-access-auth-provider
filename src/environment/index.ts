import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const config = dotenv.config();
dotenvExpand.expand(config);

export enum EnvType {
  DEV = 'development',
  PROD = 'production',
  TEST = 'testing',
}

// environment
export const NODE_ENV: EnvType =
  (process.env.NODE_ENV as EnvType) || EnvType.DEV;

// Application
export const APP_NAME: string =
  process.env.MAIN_NAME || '[YSTUty] Auth provider';
export const APP_DOMAIN: string = process.env.MAIN_DOMAIN || '127.0.0.1';
export const SERVER_PORT: number = +process.env.SERVER_PORT || 8080;
export const SERVER_URL: string =
  process.env.SERVER_URL || `http://${APP_DOMAIN}:${SERVER_PORT}`;

export const WPROG_URL: string = process.env.WPROG_URL;

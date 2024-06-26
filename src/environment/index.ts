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

// Microservices
export const SERVER_MS_PORT: number = +process.env.SERVER_MS_PORT || 3000;
// ms_auth_provider
export const SERVER_MS_HOST: string = process.env.SERVER_MS_HOST || '0.0.0.0';
export const MY_SERVICE_TOKEN: string = process.env.MY_SERVICE_TOKEN;

// * Microservice General service
export const MS_S_GENERAL_SERVER_PORT: number =
  +process.env.MS_S_GENERAL_SERVER_PORT ?? 3000;
export const MS_S_GENERAL_SERVER_HOST: string =
  process.env.MS_S_GENERAL_SERVER_HOST ?? 'ms_s_general_server';
export const S_GENERAL_SERVICE_TOKEN: string =
  process.env.S_GENERAL_SERVICE_TOKEN;

export const WPROG_URL: string = process.env.WPROG_URL;

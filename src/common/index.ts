import { createHash } from 'crypto';

export const md5 = (str: string) => createHash('md5').update(str).digest('hex');

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export * from './decorator/req-auth.decorator';
export * from './exception/http-rpc-exception';
export * from './filter/http-and-rpc-exception.filter';
export * from './pipe/mutator-client-proxy.pipe';
export * from './pipe/validation-http.pipe';
export * from './util/url.util';

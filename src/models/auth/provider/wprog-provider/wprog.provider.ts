import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as Iconv from 'iconv-lite';
import * as _ from 'lodash';
import { Readable } from 'stream';
import { FormData } from 'formdata-node';
import { FormDataEncoder } from 'form-data-encoder';

import * as xEnv from '@my-environment';
import { convert_to_cp1251, delay, md5 } from '@my-common';

import { getCodeYSTU } from './cherrio.parser';

const hasLogin1 = 'input type="submit" name="login1"'.toLowerCase();

@Injectable()
export class WprogProvider {
  private readonly logger = new Logger(WprogProvider.name);

  private cookies: Record<string, Record<string, any>> = {};
  private cookiesByLogin: Record<string, Record<string, any>> = {};

  constructor(private readonly httpService: HttpService) {
    httpService.axiosRef.defaults.baseURL = xEnv.WPROG_URL;
    httpService.axiosRef.defaults.timeout = 4e3 /* xEnv.YSTU_HTTP_TIMEOUT */;
    httpService.axiosRef.defaults.responseType = 'arraybuffer';

    httpService.axiosRef.interceptors.response.use(async (response) => {
      if (
        ['auth1.php', 'auth_p1.php'].some((e) =>
          response.config.url.toLowerCase().startsWith(e.toLowerCase()),
        )
      ) {
        response.data = (response.data as Buffer).toString('utf8');
      } else {
        response.data = Iconv.decode(response.data, 'cp1251');
      }

      await this.updateCookies(
        (response.config as any).authString,
        response.headers['set-cookie'],
      );

      return response;
    });

    this.garbageCollectorLoop().then();
  }

  private async updateCookies(authString: string, setCookie: string[]) {
    if (!Array.isArray(setCookie)) {
      return;
    }

    const cookies = setCookie.reduce((prev, str) => {
      const [name, data] = str.split('=');
      const [value] = data.split(';');
      return { ...prev, [name]: value };
    }, {});

    if (Object.keys(this.cookies).length > 500) {
      await this.garbageCollector();
    }
    if (!this.cookies[authString]) {
      this.cookies[authString] = {};
    }

    Object.assign(this.cookies[authString], cookies);
    // this.logger.debug('Updated cookies', this.cookies);
  }

  public tryInjectCookeis(
    authString: string,
    headers?: Record<string, any>,
    setCookie?: string[],
  ) {
    let cookies = this.cookies[authString] || this.cookiesByLogin[authString];
    if (setCookie?.length > 0) {
      cookies = setCookie.reduce((prev, str) => {
        const [name, data] = str.split('=');
        const [value] = data.split(';');
        return { ...prev, [name]: value };
      }, {});
    }

    if (!cookies) {
      return null;
    }

    let cookiesStr = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
      .trim();

    if (headers) {
      if (typeof headers['Cookie'] === 'string') {
        const cookieEntries = Object.entries(cookies);
        const oldCookies = headers['Cookie']
          .split(';')
          .map((e) => e.trim().split('='));

        for (const [name, value] of cookieEntries) {
          const cookieIndex = oldCookies.findIndex(([n]) => n === name);
          if (cookieIndex !== -1) {
            oldCookies[cookieIndex][1] = value;
          } else {
            oldCookies.push([name, value]);
          }
        }
        cookiesStr = oldCookies
          .map(([k, v]) => `${k}=${v}`)
          .join('; ')
          .trim();
      }

      headers['Cookie'] = cookiesStr;
    }

    return cookiesStr;
  }

  public async fetch(
    url: string,
    options: {
      authString?: string;
      userLogin?: string;
      method?: Method;
      postData?: any;
      axiosConfig?: AxiosRequestConfig<any>;
      useReauth?: boolean;
      nullOnError?: boolean;
    } = {},
  ) {
    let {
      authString = 'ANY',
      userLogin = null,
      method = 'GET',
      postData = {},
      axiosConfig = {},
      useReauth = true,
      nullOnError = false,
    } = options;
    method = method.toUpperCase() as Method;

    if (!axiosConfig.headers) {
      axiosConfig.headers = {
        'Cache-Control': 'no-cache',
      };
    }

    if (method !== 'GET') {
      if (postData instanceof FormData) {
        const encoder = new FormDataEncoder(postData);
        axiosConfig.headers['content-type'] = encoder.contentType;
        axiosConfig.data = Readable.from(encoder.encode());
      } else if (typeof postData === 'string') {
        axiosConfig.data = postData;
      } else {
        const params = new URLSearchParams(postData);
        axiosConfig.data = params.toString();
      }
    }

    this.tryInjectCookeis(userLogin || authString, axiosConfig.headers);

    (axiosConfig as any).authString = authString;
    axiosConfig.beforeRedirect = (opts, responseDetails) => {
      let setCookie = responseDetails?.headers?.[
        'set-cookie'
      ] as unknown as string[];
      if (responseDetails.headers) {
        this.updateCookies(authString, setCookie).then();
      }

      if (!('Cookies' in opts.headers)) {
        this.tryInjectCookeis(authString, opts.headers, setCookie);
      }
    };

    axiosConfig.params = method === 'GET' ? postData : {};
    axiosConfig.url = url;
    axiosConfig.method = method;

    // this.logger.debug(`[Fetch] (${method}) "${url}"`, {
    //   postData,
    //   useReauth,
    //   axiosConfig,
    // });

    try {
      let response = await firstValueFrom(
        this.httpService.request(axiosConfig),
      );

      if (
        useReauth &&
        typeof response.data === 'string' &&
        response.data.toLowerCase().includes(hasLogin1)
      ) {
        this.logger.debug('Reauthorization attempt...');

        // TODO: reAuth
        delete this.cookies[authString];
        userLogin ??= authString.split(':')[0];
        if (userLogin in this.cookiesByLogin) {
          delete this.cookiesByLogin[userLogin];
        }

        throw new Error('Need auth');
      }

      return response;
    } catch (err) {
      if (!(err instanceof Error)) {
        return err as AxiosResponse;
      }

      if (
        ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNABORTED', 'timeout'].some((e) =>
          err.message?.toLowerCase().includes(e.toLowerCase()),
        )
      ) {
        // ...
      }

      if (nullOnError) {
        this.logger.error(
          `Fetch fail: [${method}] "${err.message}" (${url.slice(0, 45)})`,
        );
        return null;
      }

      throw err;
    }
  }

  public async startAuth(login: string, password: string) {
    if (login.length < 2 || password.length < 2) {
      return false;
    }

    const authString = `${login}:${md5(login + password)}`;

    const auth1Response = await this.fetch('auth1.php', {
      authString,
      method: 'POST',
      postData: {
        login,
        password,
        codeYSTU: Date.now() % 11e8,
      },
      useReauth: false,
    });

    // * Check content on `auth1.php`
    if (auth1Response.data.toLowerCase().includes('<a href="auth.php">')) {
      delete this.cookies[authString];
      throw new Error('Wrong login:password');
    }

    const lkstudResponse = await this.fetch('lk/lkstud.php', {
      authString,
      useReauth: false,
    });

    if (lkstudResponse.request.path?.includes('auth.php')) {
      return false;
    }

    // Save last good cookie by login
    this.cookiesByLogin[login] = _.cloneDeep(this.cookies[authString]);

    return lkstudResponse.data as string;
  }

  public async startRestore(cardNumber: string, passportNumber: string) {
    if (cardNumber.length < 7 || passportNumber.length < 6) {
      return false;
    }

    const authString = `${cardNumber}:${md5(cardNumber + passportNumber)}`;

    const testResponse = await this.fetch('auth.php', {
      authString,
      method: 'GET',
      useReauth: false,
    });
    const codeYSTU = getCodeYSTU(testResponse.data);

    const obj = {
      codeYSTU: (codeYSTU || Date.now() % 11e8).toString(),
      rdr_id: cardNumber,
      pasp_n: passportNumber,
    };
    // fix url encoding by `convert_to_cp1251`
    const postData = convert_to_cp1251(new URLSearchParams(obj).toString());

    const webResponse = await this.fetch('auth_p1.php', {
      authString,
      method: 'POST',
      postData,
      useReauth: false,
    });

    // * Check content on `auth_p1.php`
    if (webResponse.data.toLowerCase().includes('<a href="auth_p.php"')) {
      delete this.cookies[authString];
      throw new Error('Wrong login:password #1');
    }

    if (webResponse.data.toLowerCase().includes('<div id="login-form">')) {
      delete this.cookies[authString];
      throw new Error('Wrong login:password #2');
    }

    if (webResponse.request.path?.includes('auth.php')) {
      return false;
    }

    return webResponse.data as string;
  }

  public async getStudInfo(login: string, type: 'lkorder' | 'lkstud_oc') {
    if (login.length < 2) {
      return false;
    }

    const webResponse = await this.fetch(`lk/${type}.php`, {
      userLogin: login,
      method: 'GET',
      useReauth: false,
    });

    // * Check content on `auth_p1.php`
    if (webResponse.data.toLowerCase().includes('<a href="auth_p.php"')) {
      delete this.cookiesByLogin[login];
      throw new Error('Wrong session #1');
    }

    if (webResponse.data.toLowerCase().includes('<div id="login-form">')) {
      delete this.cookiesByLogin[login];
      throw new Error('Wrong session #2');
    }

    if (webResponse.request.path?.includes('auth.php')) {
      return false;
    }

    return webResponse.data as string;
  }

  protected async garbageCollectorLoop() {
    const loop = async (first = false) => {
      if (!first) {
        await delay(10 * 60 * 1e3);
      }
      await this.garbageCollector();
      setImmediate(loop);
    };
    await loop(true);
  }

  protected async garbageCollector() {
    try {
      const keys = Object.keys(this.cookies);
      let toRemove = keys.length * 0.33;
      let removed: string[] = [];
      for (const authString of keys) {
        if (--toRemove <= 0) {
          break;
        }
        removed.push(authString);
        delete this.cookies[authString];
      }
      if (removed.length > 0) {
        this.logger.debug(`Removed [${removed.length}] cookies`);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}

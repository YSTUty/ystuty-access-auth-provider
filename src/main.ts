import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import * as requestIp from 'request-ip';
import * as compression from 'compression';
import helmet from 'helmet';

import * as xEnv from '@my-environment';
import { HttpExceptionFilter, ValidationHttpPipe } from '@my-common';

import { AppModule } from './models/app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    // defaultVersion: '1',
  });
  app.enableShutdownHooks();
  app.enableCors({});

  app.useGlobalPipes(new ValidationHttpPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(compression());
  app.use(
    helmet({
      hidePoweredBy: true,
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  app.use(requestIp.mw({ attributeName: 'ip' }));

  await app.listen(xEnv.SERVER_PORT);

  if (xEnv.NODE_ENV !== xEnv.EnvType.PROD) {
    Logger.log(
      `🤬  Application is running on: ${await app.getUrl()}`,
      'NestJS',
    );
  }
  Logger.log(
    `🚀  Server is listening on port ${xEnv.SERVER_PORT}`,
    'Bootstrap',
  );
}
bootstrap().catch((e) => {
  Logger.warn(`❌  Error starting server, ${e}`, 'Bootstrap');
  throw e;
});

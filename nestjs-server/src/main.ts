import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import IORedis from 'ioredis';
import * as session from 'express-session';
import { ms, StringValue } from 'libs/common/utils/ms.util';
import { parseBoolean } from 'libs/common/utils/parse-boolean.util';
import RedisStore from 'connect-redis';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  // app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  const port = config.getOrThrow<number>('APP_PORT');
  await app.listen(port);
  console.log(`Server started on ${port} port`);
}

bootstrap();

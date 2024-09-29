import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SERVER_PORT } from './constants/server.const';
import { getWinstonLogger } from './libs/logger';

async function bootstrap() {
  const logger = getWinstonLogger();

  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  mongoose.set('debug', true);

  await app.listen(configService.get(SERVER_PORT), () => {
    logger.log({
      context: 'NestApplication',
      message: `Server listening to port ${configService.get(SERVER_PORT)}`,
    });
  });
}
bootstrap();

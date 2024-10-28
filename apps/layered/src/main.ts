import { SERVER_PORT } from '@common/core/constants/server.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { getWinstonLogger } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

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
      message: `Layered Server listening to port ${configService.get(
        SERVER_PORT,
      )}`,
    });
  });
}
bootstrap();

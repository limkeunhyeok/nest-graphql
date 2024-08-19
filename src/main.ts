import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SERVER_PORT } from './constants/server.const';
import { getWinstonLogger } from './libs/logger';

async function bootstrap() {
  const logger = getWinstonLogger();

  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);

  await app.listen(configService.get(SERVER_PORT), () => {
    logger.log({
      context: 'NestApplication',
      message: `Server listening to port ${configService.get(SERVER_PORT)}`,
    });
  });
}
bootstrap();

import { SERVER_PORT } from '@common/core/constants/server.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { getWinstonLogger } from '@common/utils/logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

declare const module: any;

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
      message: `Hexagonal ${configService.get(
        'NODE_ENV',
      )} Server listening to port ${configService.get(SERVER_PORT)}`,
    });
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

// 3. 인프라 구축
// 4. 모듈 분석 spleanker?

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './constants/server.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  await app.listen(configService.get(SERVER_PORT), () => {
    console.log(`server listening to port ${configService.get(SERVER_PORT)}`);
  });
}
bootstrap();

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

// NOTE: MongoDB 연결 로직이 있어 도커를 키고 해야함
async function bootstrap() {
  await CommandFactory.run(AppModule, { logger: false });
}

bootstrap();

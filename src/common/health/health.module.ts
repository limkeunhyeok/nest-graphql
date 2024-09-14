import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

// TODO: 추후 로거 설정 변경하기 -> json으로 나오긴하나, 로깅 포맷이 일치하지 않음.
@Module({
  imports: [TerminusModule.forRoot({ logger: Logger }), HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}

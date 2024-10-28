import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

// DB가 다운되면, 내부적으로 ServiceUnavailableException를 내뱉음
// 이에, response는 exception filter를 통해 포맷된 에러를 응답 > http가 문제인지, db가 문제인지 모름
// 또한 내부적으로 Health Check has failed라는 로그를 찍는데, 해당 로그를 통해서 무엇이 문제인지 확인 가능
// 컨트롤러를 분리하거나, catch 메서드를 통해서 할 수 있을거 같기는 하나(확실치 않음)
// 그냥 예외적으로 로깅 포맷이 조금 다른 걸로 인지
@Module({
  imports: [TerminusModule.forRoot({ logger: Logger }), HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}

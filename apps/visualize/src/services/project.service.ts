import { Injectable } from '@nestjs/common';
import { AppModule as HexaModule } from 'apps/api/src/app.module';

// 각 모듈의 GraphQL의 타입이 글로벌하게 적용되어, schema.gql에 반영됨
@Injectable()
export class ProjectService {
  getAppModule(target: string) {
    if (!this.isValidProjectName(target)) {
      throw Error('Invalid proejct name.');
    }
    if (target === 'hexagonal') {
      return HexaModule;
    }
  }

  private isValidProjectName(name: string): boolean {
    const validNames = ['hexagonal', 'layered'];
    return validNames.includes(name);
  }
}

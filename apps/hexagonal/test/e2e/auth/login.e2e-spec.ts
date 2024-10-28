import { INCORRECT_EMAIL_OR_PASSWORD } from '@common/core/constants/exception-message.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/hexagonal/src/app.module';
import { User } from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectTokenResponseSucceed } from '../../expectations/auth';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from '../../lib/utils';
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  generateLoginInput,
  LOGIN_OPERATION,
  LOGIN_QUERY,
} from '../../operations/auth';

describe('Auth resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

  let userRaw: Partial<User>;
  let headers: Headers;
  let withHeaders: any;

  const GRAPHQL = '/graphql';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.init();

    userModel = moduleFixture.get<mongoose.Model<User>>(
      getModelToken(User.name),
    );

    req = request(app.getHttpServer());

    userRaw = mockUserRaw();
    await createUser(userModel, userRaw);

    headers = await fetchHeaders(req);
    withHeaders = withHeadersBy(headers);
  });

  afterAll(async () => {
    await cleanupDatabase([userModel]);

    await app.close();
  });

  describe('Login', () => {
    it('success', async () => {
      // given
      const params = {
        operationType: LOGIN_OPERATION,
        query: LOGIN_QUERY,
        variables: generateLoginInput(userRaw.email, userRaw.password),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);
      const data = getResponseData(res, LOGIN_OPERATION);

      // then
      expectTokenResponseSucceed(data);
    });

    it('failed - invalid email or password', async () => {
      // given
      const params = {
        operationType: LOGIN_OPERATION,
        query: LOGIN_QUERY,
        variables: generateLoginInput(userRaw.email, 'invalidPassword'),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(
        res,
        INCORRECT_EMAIL_OR_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    });
  });
});

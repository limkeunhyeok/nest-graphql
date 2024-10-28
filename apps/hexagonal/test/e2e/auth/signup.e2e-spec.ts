import { EMAIL_IS_ALREADY_REGISTERED } from '@common/core/constants/exception-message.const';
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
  generateSignupInput,
  SIGNUP_OPERATION,
  SIGNUP_QUERY,
} from '../../operations/auth';

describe('Auth resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

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

    headers = await fetchHeaders(req);
    withHeaders = withHeadersBy(headers);
  });

  afterAll(async () => {
    await cleanupDatabase([userModel]);
    await app.close();
  });

  describe('Signup', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw();

      const params = {
        operationType: SIGNUP_OPERATION,
        query: SIGNUP_QUERY,
        variables: generateSignupInput(
          userRaw.email,
          userRaw.password,
          userRaw.name,
          userRaw.role,
        ),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);
      const data = getResponseData(res, SIGNUP_OPERATION);

      // then
      expectTokenResponseSucceed(data);
    });

    it('failed - email is already registered.', async () => {
      // given
      const userRaw = mockUserRaw();
      await createUser(userModel, userRaw);

      const params = {
        operationType: SIGNUP_OPERATION,
        query: SIGNUP_QUERY,
        variables: generateSignupInput(
          userRaw.email,
          userRaw.password,
          userRaw.name,
          userRaw.role,
        ),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(
        res,
        EMAIL_IS_ALREADY_REGISTERED,
        HttpStatus.BAD_REQUEST,
      );
    });
  });
});

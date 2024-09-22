import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { expectTokenResponseSucceed } from 'test/expectations/auth';
import {
  expectResponseFailed,
  fetchHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from 'test/lib/utils';
import { createUser, mockUserRaw } from 'test/mockup/user';
import {
  generateLoginInput,
  LOGIN_OPERATION,
  LOGIN_QUERY,
} from 'test/operations/auth';

describe('Auth resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

  let userRaw: Omit<User, '_id'>;
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
    await userModel.deleteMany({});
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
      expectResponseFailed(res);
    });
  });
});

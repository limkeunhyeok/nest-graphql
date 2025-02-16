import { INVALID_TOKEN } from '@common/core/constants/exception-message.const';
import { Role } from '@common/core/constants/role.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/api/src/app.module';
import { User } from 'apps/api/src/modules/users/adapters/persistence/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectUserResponseSucceed } from '../../expectations/user';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from '../../lib/utils';
import {
  generatePaginateUsersInput,
  PAGINATE_USERS_OPERATION,
  PAGINATE_USERS_QUERY,
} from '../../operations/user';

describe('User resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

  let adminTokenHeaders: Headers;
  let withHeadersIncludeAdminToken: any;

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

    adminTokenHeaders = await fetchUserTokenAndHeaders(
      req,
      userModel,
      Role.ADMIN,
    );
    withHeadersIncludeAdminToken = withHeadersBy(adminTokenHeaders);

    headers = await fetchHeaders(req);
    withHeaders = withHeadersBy(headers);
  });

  afterAll(async () => {
    await cleanupDatabase([userModel]);
    await app.close();
  });

  describe('Get users by query', () => {
    it('success', async () => {
      // given
      const params = {
        operationType: PAGINATE_USERS_OPERATION,
        query: PAGINATE_USERS_QUERY,
        variables: generatePaginateUsersInput({
          role: Role.MEMBER,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 10,
          offset: 0,
        }),
      };

      // when
      const res = await withHeadersIncludeAdminToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);
      const data = getResponseData(res, PAGINATE_USERS_OPERATION);

      // then
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('limit');
      expect(data).toHaveProperty('offset');
      expect(data).toHaveProperty('docs');
      expectUserResponseSucceed(data['docs'][0]);
    });

    it('failed - invalid token.', async () => {
      // given
      const params = {
        operationType: PAGINATE_USERS_OPERATION,
        query: PAGINATE_USERS_QUERY,
        variables: generatePaginateUsersInput({
          role: Role.MEMBER,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 10,
          offset: 0,
        }),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

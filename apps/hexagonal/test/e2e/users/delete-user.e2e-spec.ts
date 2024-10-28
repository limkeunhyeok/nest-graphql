import { ID_DOES_NOT_EXIST } from '@common/core/constants/exception-message.const';
import { Role } from '@common/core/constants/role.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/hexagonal/src/app.module';
import { User } from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectUserResponseSucceed } from '../../expectations/user';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from '../../lib/utils';
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  DELETE_USER_OPERATION,
  DELETE_USER_QUERY,
  generateDeleteUserInput,
} from '../../operations/user';

describe('User resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

  let adminTokenHeaders: Headers;
  let withHeadersIncludeAdminToken: any;

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
  });

  afterAll(async () => {
    await cleanupDatabase([userModel]);
    await app.close();
  });

  describe('Delete user', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userModel, userRaw);

      const params = {
        operationType: DELETE_USER_OPERATION,
        query: DELETE_USER_QUERY,
        variables: generateDeleteUserInput(user._id.toString()),
      };

      // when
      const res = await withHeadersIncludeAdminToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, DELETE_USER_OPERATION);

      // then
      expectUserResponseSucceed(data);
    });

    it('failed - id does not exist.', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userModel, userRaw);

      const params = {
        operationType: DELETE_USER_OPERATION,
        query: DELETE_USER_QUERY,
        variables: generateDeleteUserInput(
          new mongoose.Types.ObjectId().toString(),
        ),
      };

      // when
      const res = await withHeadersIncludeAdminToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      // then
      expectResponseFailed(res, ID_DOES_NOT_EXIST, HttpStatus.BAD_REQUEST);
    });
  });
});

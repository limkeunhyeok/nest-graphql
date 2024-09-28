import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ACCESS_IS_DENIED } from 'src/constants/exception-message.const';
import { Role, User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { expectUserResponseSucceed } from 'test/expectations/user';
import { cleanupDatabase } from 'test/lib/database';
import {
  expectResponseFailed,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from 'test/lib/utils';
import { createUser, mockUserRaw } from 'test/mockup/user';
import {
  generateGetUserByIdInput,
  GET_USER_BY_ID_OPERATION,
  GET_USER_BY_ID_QUERY,
} from 'test/operations/user';

describe('User resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;

  let adminTokenHeaders: Headers;
  let withHeadersIncludeAdminToken: any;

  let memberTokenHeaders: Headers;
  let withHeadersIncludeMemberToken: any;

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

    memberTokenHeaders = await fetchUserTokenAndHeaders(
      req,
      userModel,
      Role.MEMBER,
    );
    withHeadersIncludeMemberToken = withHeadersBy(memberTokenHeaders);
  });

  afterAll(async () => {
    await cleanupDatabase([userModel]);
    await app.close();
  });

  describe('Get user by id', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userModel, userRaw);

      const params = {
        operationType: GET_USER_BY_ID_OPERATION,
        query: GET_USER_BY_ID_QUERY,
        variables: generateGetUserByIdInput(user._id.toString()),
      };

      // when
      const res = await withHeadersIncludeAdminToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);
      const data = getResponseData(res, GET_USER_BY_ID_OPERATION);

      // then
      expectUserResponseSucceed(data);
    });

    it('failed - access is denied.', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userModel, userRaw);

      const params = {
        operationType: GET_USER_BY_ID_OPERATION,
        query: GET_USER_BY_ID_QUERY,
        variables: generateGetUserByIdInput(user._id.toString()),
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      // then
      expectResponseFailed(res, ACCESS_IS_DENIED, HttpStatus.FORBIDDEN);
    });
  });
});

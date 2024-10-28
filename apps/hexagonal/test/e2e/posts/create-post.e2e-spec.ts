import { INVALID_TOKEN } from '@common/core/constants/exception-message.const';
import { Role } from '@common/core/constants/role.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/hexagonal/src/app.module';
import { Post } from 'apps/hexagonal/src/modules/posts/adapters/persistence/entities/post.entity';
import { User } from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectPostResponseSucceed } from '../../expectations/post';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from '../../lib/utils';
import { mockPostRaw } from '../../mockup/post';
import {
  CREATE_POST_OPERATION,
  CREATE_POST_QUERY,
  generateCreatePostInput,
} from '../../operations/post';

describe('Post resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;
  let postModel: mongoose.Model<Post>;

  let memberTokenHeaders: Headers;
  let withHeadersIncludeMemberToken: any;

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
    postModel = moduleFixture.get<mongoose.Model<Post>>(
      getModelToken(Post.name),
    );

    req = request(app.getHttpServer());

    memberTokenHeaders = await fetchUserTokenAndHeaders(
      req,
      userModel,
      Role.MEMBER,
    );
    withHeadersIncludeMemberToken = withHeadersBy(memberTokenHeaders);

    headers = await fetchHeaders(req);
    withHeaders = withHeadersBy(headers);
  });

  afterAll(async () => {
    await cleanupDatabase([postModel, userModel]);
    await app.close();
  });

  describe('Create post', () => {
    it('success', async () => {
      // given
      const postRaw = mockPostRaw();
      const params = {
        operationType: CREATE_POST_OPERATION,
        query: CREATE_POST_QUERY,
        variables: generateCreatePostInput(
          postRaw.title,
          postRaw.contents,
          postRaw.published,
        ),
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, CREATE_POST_OPERATION);

      // then
      expectPostResponseSucceed(data);
    });

    it('failed - invalid token.', async () => {
      // given
      const postRaw = mockPostRaw();
      const params = {
        operationType: CREATE_POST_OPERATION,
        query: CREATE_POST_QUERY,
        variables: generateCreatePostInput(
          postRaw.title,
          postRaw.contents,
          postRaw.published,
        ),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

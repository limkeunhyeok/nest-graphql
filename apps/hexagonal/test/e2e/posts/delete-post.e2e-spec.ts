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
  fetchExistingUserTokenAndHeaders,
  fetchHeaders,
  getResponseData,
  withHeadersBy,
} from '../../lib/utils';
import { createPost } from '../../mockup/post';
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  DELETE_POST_OPERATION,
  DELETE_POST_QUERY,
  generateDeletePostInput,
} from '../../operations/post';

describe('Post resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;
  let postModel: mongoose.Model<Post>;

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
  });

  afterAll(async () => {
    await cleanupDatabase([postModel, userModel]);
    await app.close();
  });

  describe('Delete post', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);

      const userTokenHeaders = await fetchExistingUserTokenAndHeaders(
        req,
        userRaw,
      );
      const withHeadersIncludeUserToken = withHeadersBy(userTokenHeaders);

      const params = {
        operationType: DELETE_POST_OPERATION,
        query: DELETE_POST_QUERY,
        variables: generateDeletePostInput(post._id.toString()),
      };

      // when
      const res = await withHeadersIncludeUserToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, DELETE_POST_OPERATION);

      // then
      expectPostResponseSucceed(data);
    });

    it('failed - invalid token.', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);

      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const params = {
        operationType: DELETE_POST_OPERATION,
        query: DELETE_POST_QUERY,
        variables: generateDeletePostInput(post._id.toString()),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});
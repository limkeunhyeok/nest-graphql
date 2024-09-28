import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { INVALID_TOKEN } from 'src/constants/exception-message.const';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role, User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { expectPostResponseSucceed } from 'test/expectations/post';
import { cleanupDatabase } from 'test/lib/database';
import {
  expectResponseFailed,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from 'test/lib/utils';
import { createPost } from 'test/mockup/post';
import { createUser } from 'test/mockup/user';
import {
  generateGetPostsByQueryInput,
  GET_POSTS_BY_QUERY_OPERATION,
  GET_POSTS_BY_QUERY_QUERY,
} from 'test/operations/post';

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

  describe('Get posts by query', () => {
    it('success', async () => {
      // given
      const user = await createUser(userModel);
      const post = await createPost(postModel, user.id);

      const params = {
        operationType: GET_POSTS_BY_QUERY_OPERATION,
        query: GET_POSTS_BY_QUERY_QUERY,
        variables: generateGetPostsByQueryInput({ authorId: post.authorId }),
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, GET_POSTS_BY_QUERY_OPERATION);

      // then
      expectPostResponseSucceed(data[0]);
    });

    it('failed - invalid token.', async () => {
      // given
      const user = await createUser(userModel);
      const post = await createPost(postModel, user.id);

      const params = {
        operationType: GET_POSTS_BY_QUERY_OPERATION,
        query: GET_POSTS_BY_QUERY_QUERY,
        variables: generateGetPostsByQueryInput({ authorId: post.authorId }),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

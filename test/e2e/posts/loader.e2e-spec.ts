import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role, User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { expectPostResponseSucceed } from 'test/expectations/post';
import { cleanupDatabase } from 'test/lib/database';
import {
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from 'test/lib/utils';
import { COMMENT_FIELDS } from 'test/operations/comment';

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

    // ts-node -r tsconfig-paths/register ./test/mockup/create-dummy.ts
  });

  describe('Loader performance test', () => {
    const GET_POSTS_FOR_LOADER_TEST = 'getPostsForLoaderTest';
    const TEST_LIMIT = 500;

    it('test with dataloader', async () => {
      // given
      const WITH_DATALOADER_TEST_QUERY = `query GetPostsForLoaderTest($limit: Float!) {
        getPostsForLoaderTest(limit: $limit) {
          _id
          authorId
          contents
          createdAt
          published
          title
          updatedAt
          commentsWithLoader ${COMMENT_FIELDS}
        }
      }`;

      const params = {
        operationType: GET_POSTS_FOR_LOADER_TEST,
        query: WITH_DATALOADER_TEST_QUERY,
        variables: {
          limit: TEST_LIMIT,
        },
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, GET_POSTS_FOR_LOADER_TEST);

      // then
      expectPostResponseSucceed(data[0]);
    });
    it('test without dataloader', async () => {
      // given
      const WITH_DATALOADER_TEST_QUERY = `query GetPostsForLoaderTest($limit: Float!) {
        getPostsForLoaderTest(limit: $limit) {
          _id
          authorId
          contents
          createdAt
          published
          title
          updatedAt
          commentsWithoutLoader ${COMMENT_FIELDS}
        }
      }`;

      const params = {
        operationType: GET_POSTS_FOR_LOADER_TEST,
        query: WITH_DATALOADER_TEST_QUERY,
        variables: {
          limit: TEST_LIMIT,
        },
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, GET_POSTS_FOR_LOADER_TEST);

      // then
      expectPostResponseSucceed(data[0]);
    });
  });
});

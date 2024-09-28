import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { INVALID_TOKEN } from 'src/constants/exception-message.const';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role, User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { expectCommentResponseSucceed } from 'test/expectations/comment';
import { cleanupDatabase } from 'test/lib/database';
import {
  expectResponseFailed,
  fetchExistingUserTokenAndHeaders,
  fetchHeaders,
  getResponseData,
  withHeadersBy,
} from 'test/lib/utils';
import { createComment } from 'test/mockup/comment';
import { createPost } from 'test/mockup/post';
import { createUser, mockUserRaw } from 'test/mockup/user';
import {
  generateGetCommentsByQueryInput,
  GET_COMMENTS_BY_QUERY_OPERATION,
  GET_COMMENTS_BY_QUERY_QUERY,
} from 'test/operations/comment';

describe('Comment resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;
  let postModel: mongoose.Model<Post>;
  let commentModel: mongoose.Model<Comment>;

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
    commentModel = moduleFixture.get<mongoose.Model<Comment>>(
      getModelToken(Comment.name),
    );

    req = request(app.getHttpServer());
  });

  afterAll(async () => {
    await cleanupDatabase([commentModel, postModel, userModel]);
    await app.close();
  });

  describe('Get comments by query', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);
      const comment = await createComment(commentModel, user.id, post.id);

      const userTokenHeaders = await fetchExistingUserTokenAndHeaders(
        req,
        userRaw,
      );
      const withHeadersIncludeUserToken = withHeadersBy(userTokenHeaders);

      const params = {
        operationType: GET_COMMENTS_BY_QUERY_OPERATION,
        query: GET_COMMENTS_BY_QUERY_QUERY,
        variables: generateGetCommentsByQueryInput({ postId: comment.postId }),
      };

      // when
      const res = await withHeadersIncludeUserToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, GET_COMMENTS_BY_QUERY_OPERATION);

      // then
      expectCommentResponseSucceed(data[0]);
    });

    it('failed - invalid token.', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);
      const comment = await createComment(commentModel, user.id, post.id);

      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const params = {
        operationType: GET_COMMENTS_BY_QUERY_OPERATION,
        query: GET_COMMENTS_BY_QUERY_QUERY,
        variables: generateGetCommentsByQueryInput({ postId: comment.postId }),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

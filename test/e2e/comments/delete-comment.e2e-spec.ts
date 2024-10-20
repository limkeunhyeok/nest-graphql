import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { AppModule } from 'src/app.module';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { INVALID_TOKEN } from 'src/constants/exception-message.const';
import { Role } from 'src/constants/role.const';
import { Comment } from 'src/modules/api/v2/comments/adapters/persistence/entities/comment.entity';
import { Post } from 'src/modules/api/v2/posts/adapters/persistence/entities/post.entity';
import { User } from 'src/modules/api/v2/users/adapters/persistence/entities/user.entity';
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
  DELETE_COMMENT_OPERATION,
  DELETE_COMMENT_QUERY,
  generateDeleteCommentInput,
} from 'test/operations/comment';
import {
  DELETE_POST_OPERATION,
  DELETE_POST_QUERY,
  generateDeletePostInput,
} from 'test/operations/post';

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

  describe('Delete comment', () => {
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
        operationType: DELETE_COMMENT_OPERATION,
        query: DELETE_COMMENT_QUERY,
        variables: generateDeleteCommentInput(
          comment._id.toString(),
          post._id.toString(),
        ),
      };

      // when
      const res = await withHeadersIncludeUserToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, DELETE_COMMENT_OPERATION);

      // then
      expectCommentResponseSucceed(data);
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
        operationType: DELETE_POST_OPERATION,
        query: DELETE_POST_QUERY,
        variables: generateDeletePostInput(comment._id.toString()),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

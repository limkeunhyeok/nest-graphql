import { INVALID_TOKEN } from '@common/core/constants/exception-message.const';
import { Role } from '@common/core/constants/role.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/layered/src/app.module';
import { Comment } from 'apps/layered/src/modules/comments/entities/comment.entity';
import { Post } from 'apps/layered/src/modules/posts/entities/post.entity';
import { User } from 'apps/layered/src/modules/users/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectCommentResponseSucceed } from '../../expectations/comment';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchExistingUserTokenAndHeaders,
  fetchHeaders,
  getResponseData,
  withHeadersBy,
} from '../../lib/utils';
import { createComment, mockCommentRaw } from '../../mockup/comment';
import { createPost } from '../../mockup/post';
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  generateUpdateCommentInput,
  UPDATE_COMMENT_OPERATION,
  UPDATE_COMMENT_QUERY,
} from '../../operations/comment';

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

  describe('Update comment', () => {
    it('success', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);
      const comment = await createComment(commentModel, user.id, post.id);

      const newCommentRaw = mockCommentRaw(post.id);

      const userTokenHeaders = await fetchExistingUserTokenAndHeaders(
        req,
        userRaw,
      );
      const withHeadersIncludeUserToken = withHeadersBy(userTokenHeaders);

      const params = {
        operationType: UPDATE_COMMENT_OPERATION,
        query: UPDATE_COMMENT_QUERY,
        variables: generateUpdateCommentInput(
          newCommentRaw.contents,
          newCommentRaw.published,
          comment.postId,
          comment.id,
        ),
      };

      // when
      const res = await withHeadersIncludeUserToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, UPDATE_COMMENT_OPERATION);

      // then
      expectCommentResponseSucceed(data);
    });

    it('failed - invalid token.', async () => {
      // given
      const userRaw = mockUserRaw(Role.MEMBER);
      const user = await createUser(userModel, userRaw);
      const post = await createPost(postModel, user.id);
      const comment = await createComment(commentModel, user.id, post.id);

      const newCommentRaw = mockCommentRaw(post.id);

      const headers = await fetchHeaders(req);
      const withHeaders = withHeadersBy(headers);

      const params = {
        operationType: UPDATE_COMMENT_OPERATION,
        query: UPDATE_COMMENT_QUERY,
        variables: generateUpdateCommentInput(
          newCommentRaw.contents,
          newCommentRaw.published,
          comment.postId,
          comment.id,
        ),
      };

      // when
      const res = await withHeaders(req.post(GRAPHQL).send(params)).expect(200);

      // then
      expectResponseFailed(res, INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    });
  });
});

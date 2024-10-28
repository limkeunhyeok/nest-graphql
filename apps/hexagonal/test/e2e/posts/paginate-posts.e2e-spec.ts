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
import { createPost } from '../../mockup/post';
import { createUser } from '../../mockup/user';
import {
  generatePaginatePostsInput,
  PAGINATE_POSTS_OPERATION,
  PAGINATE_POSTS_QUERY,
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

  describe('Paginate posts', () => {
    it('success', async () => {
      // given
      const user = await createUser(userModel);
      const post = await createPost(postModel, user.id);

      const params = {
        operationType: PAGINATE_POSTS_OPERATION,
        query: PAGINATE_POSTS_QUERY,
        variables: generatePaginatePostsInput({
          authorId: post.authorId,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 10,
          offset: 0,
        }),
      };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(GRAPHQL).send(params),
      ).expect(200);

      const data = getResponseData(res, PAGINATE_POSTS_OPERATION);

      // then
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('limit');
      expect(data).toHaveProperty('offset');
      expect(data).toHaveProperty('docs');
      expectPostResponseSucceed(data['docs'][0]);
    });

    it('failed - invalid token.', async () => {
      // given
      const user = await createUser(userModel);
      const post = await createPost(postModel, user.id);

      const params = {
        operationType: PAGINATE_POSTS_OPERATION,
        query: PAGINATE_POSTS_QUERY,
        variables: generatePaginatePostsInput({
          authorId: post.authorId,
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

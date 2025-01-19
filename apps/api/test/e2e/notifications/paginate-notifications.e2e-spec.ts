import { INVALID_TOKEN } from '@common/core/constants/exception-message.const';
import { Role } from '@common/core/constants/role.const';
import { AllExceptionsFilter } from '@common/core/filters/all-exceptions.filter';
import { LoggingInterceptor } from '@common/core/interceptors/logging.interceptor';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'apps/api/src/app.module';
import { Comment } from 'apps/api/src/modules/comments/adapters/persistence/entities/comment.entity';
import { Notification } from 'apps/api/src/modules/notifications/adapters/persistence/entities/notification.entity';
import { Post } from 'apps/api/src/modules/posts/adapters/persistence/entities/post.entity';
import { User } from 'apps/api/src/modules/users/adapters/persistence/entities/user.entity';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { expectNotificationResponseSucceed } from '../../expectations/notification';
import { cleanupDatabase } from '../../lib/database';
import {
  expectResponseFailed,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  Headers,
  withHeadersBy,
} from '../../lib/utils';
import { createComment } from '../../mockup/comment';
import { createNotification } from '../../mockup/notification';
import { createPost } from '../../mockup/post';
import { createUser } from '../../mockup/user';
import {
  generatePaginateNotificationsInput,
  PAGINATE_NOTIFICATIONS_OPERATION,
  PAGINATE_NOTIFICATIONS_QUERY,
} from '../../operations/notification';

describe('Notification resolver (e2e)', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  let userModel: mongoose.Model<User>;
  let postModel: mongoose.Model<Post>;
  let commentModel: mongoose.Model<Comment>;
  let notificationModel: mongoose.Model<Notification>;

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
    commentModel = moduleFixture.get<mongoose.Model<Comment>>(
      getModelToken(Comment.name),
    );
    notificationModel = moduleFixture.get<mongoose.Model<Notification>>(
      getModelToken(Notification.name),
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
    await cleanupDatabase([
      postModel,
      userModel,
      commentModel,
      notificationModel,
    ]);
    await app.close();
  });

  describe('Paginate notifications', () => {
    it('success', async () => {
      // given
      const author = await createUser(userModel);
      const post = await createPost(postModel, author._id);

      const actor = await createUser(userModel);
      const comment = await createComment(commentModel, actor._id, post._id);

      await createNotification(
        notificationModel,
        author._id,
        post._id,
        actor._id,
        comment._id,
      );

      const params = {
        operationType: PAGINATE_NOTIFICATIONS_OPERATION,
        query: PAGINATE_NOTIFICATIONS_QUERY,
        variables: generatePaginateNotificationsInput({
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

      const data = getResponseData(res, PAGINATE_NOTIFICATIONS_OPERATION);

      // then
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('limit');
      expect(data).toHaveProperty('offset');
      expect(data).toHaveProperty('docs');
      expectNotificationResponseSucceed(data['docs'][0]);
    });

    it('failed - invalid token.', async () => {
      // given
      const author = await createUser(userModel);
      const post = await createPost(postModel, author._id);

      const actor = await createUser(userModel);
      const comment = await createComment(commentModel, actor._id, post._id);

      await createNotification(
        notificationModel,
        author._id,
        post._id,
        actor._id,
        comment._id,
      );

      const params = {
        operationType: PAGINATE_NOTIFICATIONS_OPERATION,
        query: PAGINATE_NOTIFICATIONS_QUERY,
        variables: generatePaginateNotificationsInput({
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

import * as mongoose from 'mongoose';

import { Role } from '@common/core/constants/role.const';
import { User } from 'apps/hexagonal/src/modules/users/adapters/persistence/entities/user.entity';
import request, { Response } from 'supertest';
import { createUser, mockUserRaw } from '../mockup/user';
import {
  generateLoginInput,
  LOGIN_OPERATION,
  LOGIN_QUERY,
} from '../operations/auth';

export interface Headers {
  token?: string;
  cookie?: string;
}

export function setHeaders(
  req: request.Test,
  headers: Headers,
  options: Partial<Record<keyof Headers, boolean>>,
) {
  if (
    headers.token &&
    !(typeof options.token !== 'undefined' && !options.token)
  ) {
    req.auth(headers.token, { type: 'bearer' });
  }

  if (
    headers.cookie &&
    !(typeof options.cookie !== 'undefined' && !options.cookie)
  ) {
    req.set('Cookie', headers.cookie);
  }

  return req;
}

export function withHeadersBy(
  headers: Headers,
  options: Partial<Record<keyof Headers, boolean>> = {},
) {
  return function withHeaders(req: request.Test) {
    return setHeaders(req, headers, options);
  };
}

export function getHeadersFrom(res: Response, headers: Headers = {}) {
  const token = headers.token;
  const cookie = headers.cookie ?? res.header['set-cookie'];

  return {
    token,
    cookie,
  };
}

export async function fetchHeaders(req: request.SuperTest<request.Test>) {
  const res = await req.get('/health').expect(200);
  return getHeadersFrom(res);
}

async function loginAndFetchHeaders(
  req: request.SuperTest<request.Test>,
  email: string,
  password: string,
  headers: any,
) {
  const withHeaders = withHeadersBy(headers);

  const res = await withHeaders(
    req.post('/graphql').send({
      operationType: LOGIN_OPERATION,
      query: LOGIN_QUERY,
      variables: generateLoginInput(email, password),
    }),
  ).expect(200);

  const data = getResponseData(res, LOGIN_OPERATION);

  const headersWithToken = getHeadersFrom(res, {
    ...headers,
    token: data.accessToken,
  });

  return headersWithToken;
}

export async function fetchUserTokenAndHeaders(
  req: request.SuperTest<request.Test>,
  userModel: mongoose.Model<User>,
  userType: Role = Role.MEMBER,
) {
  const userRaw = mockUserRaw(userType);
  await createUser(userModel, userRaw);

  const headers = await fetchHeaders(req);
  return await loginAndFetchHeaders(
    req,
    userRaw.email,
    userRaw.password,
    headers,
  );
}

export async function fetchExistingUserTokenAndHeaders(
  req: request.SuperTest<request.Test>,
  userRaw: Partial<User>,
) {
  const headers = await fetchHeaders(req);
  return await loginAndFetchHeaders(
    req,
    userRaw.email,
    userRaw.password,
    headers,
  );
}

export function expectResponseSucceed(res: Response) {
  const body = res.body;
  expect(body).toHaveProperty('data');
}

export function expectResponseFailed(
  res: Response,
  message?: string,
  statusCode?: number,
) {
  const body = res.body;

  expect(body).toHaveProperty('errors');
  for (let err of body['errors']) {
    expect(err).toHaveProperty('message');
    expect(err).toHaveProperty('path');
    expect(err).toHaveProperty('extensions');
    expect(err['extensions']).toHaveProperty('exceptionCode');
    expect(err['extensions']).toHaveProperty('statusCode');
    expect(err['extensions']).toHaveProperty('message');

    if (message) {
      expect(err['extensions']['message']).toEqual(message);
    }

    if (statusCode) {
      expect(err['extensions']['statusCode']).toEqual(statusCode);
    }
  }
}

export function getResponseData(res: Response, operationName: string) {
  expectResponseSucceed(res);

  const body = res.body;
  return body['data'][operationName];
}

// NOTE: 테스트 관련 어디 적을지 몰라 여기다 적음.
// 현재 graphql에 학습 중에 있어, resolve field를 사용한 부분도 모두 테스트에 추가하려고 했음.
// 허나, 하나하나 쪼개는 것에 양이 많아지고 개발 시간이 많이 소요됨.
// 따라서, e2e 테스트 시에는 단순히 도메인 모델에 대한 값들만 체크하며, dataloader같이 특이 사항만 따로 테스트.
// 추가로 NOTE나, TODO 같은 키워드를 주석 태그라고 부르는 듯함.
// 다만, 주석 태그라고 검색하면 html 태그만 나옴.
// 만약 나중에 검색한다면, comment tags 또는 Comment tag keywords라고 검색하면 조금 나올듯.

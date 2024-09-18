import * as mongoose from 'mongoose';
import { Role, User } from 'src/modules/users/entities/user.entity';
import request, { Response } from 'supertest';
import { createUser, mockUserRaw } from 'test/mockup/user';

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

export async function fetchUserTokenAndHeaders(
  req: request.SuperTest<request.Test>,
  userModel: mongoose.Model<User>,
  userType: Role = Role.MEMBER,
) {
  const userRaw = mockUserRaw(userType);
  const user = await createUser(userModel, userRaw);

  const headers = await fetchHeaders(req);
  const withHeaders = withHeadersBy(headers);

  const params = {
    email: userRaw.email,
    password: userRaw.password,
  };

  const res = await withHeaders(
    req.post('/graphql').send({
      operationType: 'Login',
      query: `mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
          accessToken
        }
      }`,
      variables: { loginInput: params },
    }),
  ).expect(200);

  const headersWithToken = getHeadersFrom(res, {
    ...headers,
    token: res.body.accessToken,
  });
  return headersWithToken;
}

export function expectResponseSucceed(res: Response) {
  const body = res.body;
  expect(body).toHaveProperty('data');
}

export function expectResponseFailed(res: Response) {
  const body = res.body;

  expect(body).toHaveProperty('errors');
  for (let err of body['errors']) {
    expect(err).toHaveProperty('message');
    expect(err).toHaveProperty('path');
    expect(err).toHaveProperty('extensions');
    expect(err['extensions']).toHaveProperty('exceptionCode');
    expect(err['extensions']).toHaveProperty('statusCode');
    expect(err['extensions']).toHaveProperty('message');
  }
}

export function getResponseData(res: Response, operationName: string) {
  expectResponseSucceed(res);

  const body = res.body;
  return body['data'][operationName];
}

import { Role } from '@common/core/constants/role.const';

export const TOKEN_FIELDS = `{
  accessToken
}`;

// login
export const LOGIN_OPERATION = 'login';
export const LOGIN_QUERY = `mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) ${TOKEN_FIELDS}
}`;
export const generateLoginInput = (email: string, password: string) => ({
  loginInput: {
    email,
    password,
  },
});

// signup
export const SIGNUP_OPERATION = 'signup';
export const SIGNUP_QUERY = `mutation Signup($signupInput: CreateUserInput!) {
  signup(signupInput: $signupInput) ${TOKEN_FIELDS}
}`;
export const generateSignupInput = (
  email: string,
  password: string,
  name: string,
  role: Role,
) => ({
  signupInput: {
    email,
    password,
    name,
    role,
  },
});

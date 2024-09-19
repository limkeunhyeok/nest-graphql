import { Role } from 'src/modules/users/entities/user.entity';

// login
export const LOGIN_OPERATION = 'login';
export const LOGIN_QUERY = `mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
  }
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
  signup(signupInput: $signupInput) {
    accessToken
  }
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

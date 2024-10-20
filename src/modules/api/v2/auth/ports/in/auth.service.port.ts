import { Role } from 'src/constants/role.const';

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams {
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface Tokens {
  accessToken: string;
}

export interface AuthServicePort {
  login(loginParams: LoginParams): Promise<Tokens>;
  signup(signupParams: SignupParams): Promise<Tokens>;
}

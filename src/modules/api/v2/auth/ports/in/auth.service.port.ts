import { LoginParams } from '../../domain/dtos/login.input';
import { SignupParams } from '../../domain/dtos/signup.input';
import { TokenResponse } from '../../domain/dtos/token.output';

export interface AuthServicePort {
  login(loginParams: LoginParams): Promise<TokenResponse>;
  signup(signupParams: SignupParams): Promise<TokenResponse>;
}

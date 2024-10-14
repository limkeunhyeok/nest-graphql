import { LoginParams } from '../../adapters/dtos/login.input';
import { SignupParams } from '../../adapters/dtos/signup.input';
import { TokenResponse } from '../../adapters/dtos/token.output';

export interface AuthServicePort {
  login(loginParams: LoginParams): Promise<TokenResponse>;
  signup(signupParams: SignupParams): Promise<TokenResponse>;
}

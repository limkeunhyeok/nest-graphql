import { TokenResponse } from 'src/modules/auth/dtos/token.response';
import { LoginParams } from '../../domain/dtos/login.input';
import { SignupParams } from '../../domain/dtos/signup.input';

export interface AuthServicePort {
  login(loginParams: LoginParams): Promise<TokenResponse>;
  signup(signupParams: SignupParams): Promise<TokenResponse>;
}

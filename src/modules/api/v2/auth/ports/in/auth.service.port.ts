import { LoginParams } from '../../adapters/dtos/login.input';
import { SignupParams } from '../../adapters/dtos/signup.input';
import { Tokens } from '../../adapters/dtos/token.output';

export interface AuthServicePort {
  login(loginParams: LoginParams): Promise<Tokens>;
  signup(signupParams: SignupParams): Promise<Tokens>;
}

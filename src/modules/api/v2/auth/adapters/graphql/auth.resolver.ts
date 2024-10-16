import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from '../../applications/services/auth.service';
import { LoginInput } from '../dtos/login.input';
import { SignupInput } from '../dtos/signup.input';
import { TokenOutput } from '../dtos/token.output';

@Resolver()
export class AuthResovler {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => TokenOutput)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Public()
  @Mutation(() => TokenOutput)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    return await this.authService.signup(signupInput);
  }
}

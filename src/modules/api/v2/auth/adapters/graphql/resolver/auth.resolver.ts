import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { AUTH_SERVICE } from '../../../auth.const';
import { AuthServicePort } from '../../../ports/in/auth.service.port';
import { LoginInput } from '../inputs/login.input';
import { SignupInput } from '../inputs/signup.input';
import { TokenOutput } from '../outputs/token.output';

@Resolver()
export class AuthResovler {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthServicePort,
  ) {}

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

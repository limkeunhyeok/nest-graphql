import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserInput } from '../users/dtos/create.input';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.input';
import { TokenResponse } from './dtos/token.response';

@Resolver(() => TokenResponse)
export class AuthResovler {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => TokenResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Public()
  @Mutation(() => TokenResponse)
  async signup(@Args('signupInput') signupInput: CreateUserInput) {
    return await this.authService.signup(signupInput);
  }
}

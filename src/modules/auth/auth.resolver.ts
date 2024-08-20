import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../users/dtos/create.input';
import { AuthService } from './auth.service';
import { LoginInput } from './dtos/login.input';
import { TokenResponse } from './dtos/token.response';

@Resolver()
export class AuthResovler {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => TokenResponse)
  async signup(@Args('signupInput') signupInput: CreateUserInput) {
    return await this.authService.signup(signupInput);
  }
}

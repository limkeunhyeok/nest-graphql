import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginInput } from '../../domain/dtos/login.input';
import { SignupInput } from '../../domain/dtos/signup.input';
import { TokenOutput } from '../../domain/dtos/token.output';
import { AuthService } from '../../domain/services/auth.service';

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

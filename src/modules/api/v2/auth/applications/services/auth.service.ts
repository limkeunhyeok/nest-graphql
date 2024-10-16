import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'src/constants/exception-message.const';
import { comparedPassword } from 'src/libs/utils';
import { UserService } from '../../../users/applications/services/user.service';
import { UserRaw } from '../../../users/domain/models/user.domain';
import { LoginParams } from '../../adapters/dtos/login.input';
import { SignupParams } from '../../adapters/dtos/signup.input';
import { Tokens } from '../../adapters/dtos/token.output';
import { AuthServicePort } from '../../ports/in/auth.service.port';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginParams): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    if (!comparedPassword(password, user.password)) {
      throw new BadRequestException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const accessToken = this.createToken(user);
    return { accessToken };
  }

  async signup(signupParams: SignupParams): Promise<Tokens> {
    const user = await this.userService.create(signupParams);

    const accessToken = this.createToken(user);
    return { accessToken };
  }

  private createToken(user: Pick<UserRaw, '_id' | 'role'>): string {
    return this.jwtService.sign({
      userId: user._id,
      role: user.role,
    });
  }
}

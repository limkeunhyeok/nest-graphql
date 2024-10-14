import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'src/constants/exception-message.const';
import { comparedPassword } from 'src/libs/utils';
import { UserRaw } from '../../../users/domain/models/user.domain';
import { UserService } from '../../../users/domain/services/user.service';
import { LoginParams } from '../../adapters/dtos/login.input';
import { SignupParams } from '../../adapters/dtos/signup.input';
import { AuthServicePort } from '../../ports/in/auth.service.port';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginParams) {
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

  async signup(signupParams: SignupParams) {
    const user = await this.userService.create(signupParams);

    const accessToken = this.createToken(user);
    return { accessToken };
  }

  async validateUser(userId: string) {
    try {
      await this.userService.findOneById(userId);
      return true;
    } catch (error) {
      return false;
    }
  }

  private createToken(user: Pick<UserRaw, '_id' | 'role'>) {
    return this.jwtService.sign({
      userId: user._id,
      role: user.role,
    });
  }
}

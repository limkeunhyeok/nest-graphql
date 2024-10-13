import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'src/constants/exception-message.const';
import { comparedPassword } from 'src/libs/utils';
import { CreateUserInput } from '../users/dtos/create.input';
import { UserDocument } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { LoginInput } from './dtos/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput) {
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

  async signup(signupInput: CreateUserInput) {
    const user = await this.userService.create(signupInput);

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

  private createToken(user: UserDocument) {
    return this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });
  }
}

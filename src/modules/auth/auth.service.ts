import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparedPassword } from 'src/libs/utils';
import { CreateUserInput } from '../users/dtos/create.input';
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
      throw new BadRequestException('Incorrect email or password.');
    }

    if (!comparedPassword(password, user.password)) {
      throw new BadRequestException('Incorrect email or password.');
    }

    const accessToken = this.jwtService.sign({ id: user.id });

    return { accessToken };
  }

  async signup(signupInput: CreateUserInput) {
    const user = await this.userService.create(signupInput);

    const accessToken = this.jwtService.sign({ id: user.id });
    return { accessToken };
  }
}

import { UsersService } from '@modules/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Password is incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return isPasswordMatching;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    await this.verifyPassword(password, user.password);
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getCookieWithJwtToken(user: User): { cookie: string; token: string } {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Secure; SameSite=none; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
    return { cookie, token };
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Secure; SameSite=none; Path=/; Max-Age=0`;
  }

  async register(user: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const existingUser = await this.usersService.findOne({ email: user.email });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });

    if (!createdUser)
      throw new HttpException(
        'Error creating user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdUser;
  }

  async changePassword(
    email: string,
    old_password: string,
    new_password: string,
  ) {
    await this.validateUser(email, old_password);

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const user = await this.usersService.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return user;
  }
}

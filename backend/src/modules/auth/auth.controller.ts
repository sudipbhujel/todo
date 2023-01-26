import { Response } from 'express';

import { AuthService } from '@modules/auth/auth.service';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import { UserLoginDto } from '@modules/auth/dto/user-login.dto';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@modules/auth/local-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

export interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);
    return { message: 'User registered successfully.', email: user.email };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Return access token',
    type: LoginResponseDto,
  })
  async login(
    @Req() req: RequestWithUser,
    @Body() _body: UserLoginDto,
    @Res() res: Response,
  ) {
    const { token, cookie } = this.authService.getCookieWithJwtToken(req.user);
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ access_token: token });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check-auth')
  @ApiResponse({
    status: 200,
    description: 'Return id and email',
    type: AuthDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  async checkAuth(@Req() req: RequestWithUser): Promise<AuthDto> {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    res.status(200).send({
      message: 'Logout successful',
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() { new_password, old_password }: ChangePasswordDto,
  ) {
    const user = await this.authService.changePassword(
      req.user.email,
      old_password,
      new_password,
    );
    return {
      message: 'Password changed successfully.',
      email: user.email,
    };
  }
}

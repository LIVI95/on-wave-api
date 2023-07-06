import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() userLoginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, cookies } = await this.authService.login(userLoginDto);

    res.setHeader('Set-Cookie', cookies);

    return data;
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() userCreateDto: CreateUserDto) {
    return await this.authService.register(userCreateDto);
  }

  @Get('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookie = await this.authService.logout();

    res.setHeader('Set-Cookie', cookie);

    return;
  }
}

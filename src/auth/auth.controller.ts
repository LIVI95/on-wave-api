import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() userLoginDto: LoginUserDto, @Res() res: Response) {
    const { data, token } = await this.authService.login(userLoginDto);

    res.cookie('Access-token', token);

    res.send(data);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() userCreateDto: CreateUserDto) {
    return await this.authService.register(userCreateDto);
  }
}

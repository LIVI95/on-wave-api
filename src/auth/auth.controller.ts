import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/users/dto/user-create.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() userCreateDto: UserCreateDto) {
    return await this.authService.register(userCreateDto);
  }
}

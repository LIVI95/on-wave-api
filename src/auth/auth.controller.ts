import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { TrimPipe } from 'src/pipes/trim.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() userLoginDto: LoginUserDto) {
    return await this.authService.login(userLoginDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() userCreateDto: CreateUserDto) {
    return await this.authService.register(userCreateDto);
  }
}

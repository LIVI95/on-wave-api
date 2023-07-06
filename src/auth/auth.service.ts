import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(userCreateDto: CreateUserDto) {
    const candidate = await this.usersService.getByEmail(userCreateDto.email);
    if (candidate) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.hashPassword(userCreateDto.password);

    const user = await this.usersService.create({
      ...userCreateDto,
      password: hashedPassword,
    });
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lasttName: user.lastName,
      avatar: user.avatar,
      isActivated: user.isActivated,
      isBanned: user.isBanned,
    };
  }

  async login(userLoginDto: LoginUserDto) {
    const candidate = await this.usersService.getByEmail(userLoginDto.email);
    if (!candidate) {
      throw new HttpException('Invalid login data', HttpStatus.BAD_REQUEST);
    }
    const isEqualPasswords = this.comparePassword(
      userLoginDto.password,
      candidate.password,
    );
    if (!isEqualPasswords) {
      throw new HttpException('Invalid login data', HttpStatus.BAD_REQUEST);
    }

    const accessToken = await this.jwtService.signAsync({ id: candidate.id });
    const refreshToken = await this.jwtService.signAsync(
      { id: candidate.id },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        )}d`,
      },
    );
    await this.usersService.setHashRefreshToken(refreshToken, candidate.id);
    return {
      data: {
        id: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName,
        lasttName: candidate.lastName,
        avatar: candidate.avatar,
        isActivated: candidate.isActivated,
        isBanned: candidate.isBanned,
      },
      cookies: [
        `AccessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}`,
        `RefreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
          24 *
          60 *
          60 *
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
        }`,
      ],
    };
  }

  async logout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

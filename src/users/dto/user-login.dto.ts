import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

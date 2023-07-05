import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsOptional()
  avatar: string;

  @MinLength(2)
  firstName: string;

  @MinLength(2)
  lastName: string;
}

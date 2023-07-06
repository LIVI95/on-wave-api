import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entities/user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(userCreateDto: CreateUserDto) {
    const user = this.usersRepository.create(userCreateDto);
    await this.usersRepository.save(user);
    return user;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async setHashRefreshToken(token: string, userId: number) {
    const hashRefreshToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hashRefreshToken,
    });
  }
}

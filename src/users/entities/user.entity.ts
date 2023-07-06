import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isActivated: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken: string;
}

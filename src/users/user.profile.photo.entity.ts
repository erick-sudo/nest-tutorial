import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ProfilePhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @OneToOne(() => User, (user) => user.profilePhoto)
  @Exclude()
  user: User;
}

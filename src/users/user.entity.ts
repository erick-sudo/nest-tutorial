import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateUser } from './user.dtos';
import * as bcrypt from 'bcrypt';
import { ProfilePhoto } from './user.profile.photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passwordDigest: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => ProfilePhoto, (profilePhoto) => profilePhoto.user, {
    cascade: true,
  })
  @JoinColumn()
  profilePhoto: ProfilePhoto;

  static init({ firstName, lastName, password, email }: CreateUser): User {
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync());
    newUser.email = email;
    return newUser;
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordDigest);
  }
}

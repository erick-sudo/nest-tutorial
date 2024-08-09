import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isPublished: boolean;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn()
  author: User;
}

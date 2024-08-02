import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from './user.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private datasource: DataSource,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id }).then((usr) => {
      if (usr) {
        return usr;
      }
      throw new NotFoundException('User not found');
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createOne(createUser: CreateUser): Promise<User> {
    return this.userRepository.save(User.init(createUser));
  }

  async createMany(users: User[]) {
    // const queryRunner = this.datasource.createQueryRunner();

    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   users.forEach(async (user) => {
    //     await queryRunner.manager.save(user);
    //   });

    //   // Commit transaction
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   // Rollback transaction
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   // Release queryRunner
    //   await queryRunner.release();
    // }

    /* ------------ Using QueryRunnerFactory ----------- */
    this.datasource.transaction(async (manager) => {
      users.forEach(async (user) => {
        await manager.save(user);
      });
    });
  }
}

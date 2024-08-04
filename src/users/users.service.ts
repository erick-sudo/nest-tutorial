import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from './user.dtos';
import { S3 } from 'aws-sdk';
import { ProfilePhoto } from './user.profile.photo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfilePhoto)
    private profileRepository: Repository<ProfilePhoto>,
    private datasource: DataSource,
    @Inject('S3') private readonly s3: S3,
  ) {}

  async profilePhoto(userId: number) {
    return await this.datasource
      .getRepository(ProfilePhoto)
      .createQueryBuilder('profilePhoto')
      .innerJoinAndSelect('profilePhoto.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async uploadProfilePhoto(
    file: Express.Multer.File,
    userId: number,
  ): Promise<User> {
    const { buffer } = file;

    const user = await this.findOne(userId);

    let profilePhoto = user.profilePhoto;
    if (!profilePhoto) {
      profilePhoto = new ProfilePhoto();
    }

    const uploadResult = await this.s3
      .upload({
        Bucket: 'sandeep-bucket-s4',
        Key: `profile-photos/${userId}`,
        Body: buffer,
        ACL: 'public-read',
      })
      .promise();

    const { Location } = uploadResult;
    profilePhoto.url = Location;
    user.profilePhoto = profilePhoto;

    await this.profileRepository.save(profilePhoto);
    return await this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id }).then((usr) => {
      if (usr) {
        return usr;
      }
      throw new NotFoundException('User not found');
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email }).then((usr) => {
      if (usr) return usr;
      throw new NotFoundException(
        'User with the provided email does not exist',
      );
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

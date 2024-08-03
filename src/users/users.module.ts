import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ProfilePhoto } from './user.profile.photo.entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, ProfilePhoto]), S3Module],
})
export class UsersModule {}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './user.dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  index() {
    return this.usersService.findAll();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) createUser: CreateUser) {
    return this.usersService.createOne(createUser);
  }

  @Post('upload/profile_photo')
  @UseInterceptors(FileInterceptor('profile_photo'))
  uploadPhoto(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1048576,
          message: 'required photo size is at most 1mb',
        })
        .addFileTypeValidator({ fileType: 'jpeg' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    profilePhoto: Express.Multer.File,
  ) {
    return {
      photo: 'profile_photo',
      size: profilePhoto.size,
      path: profilePhoto.path,
      mime: profilePhoto.mimetype,
    };
  }
}

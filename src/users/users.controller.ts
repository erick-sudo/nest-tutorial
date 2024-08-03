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
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './user.dtos';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MagicNumberFileTypeValidator } from 'src/validators/magicnumber.filetype.validator';
import { MultipleFileValidationPipe } from 'src/validators/multiple.file.validator';

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

  @Post(':id/upload/profile_photo')
  @UseInterceptors(FileInterceptor('profile_photo'))
  uploadPhoto(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1048576,
          message: 'required photo size is at most 1mb',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
      new MagicNumberFileTypeValidator('jpeg', 'png'),
    )
    profilePhoto: Express.Multer.File,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.usersService.uploadProfilePhoto(profilePhoto, userId);
  }

  @Post('multiple/files')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 2 },
      { name: 'background', maxCount: 2 },
    ]),
  )
  multipleFilesUpload(
    @UploadedFiles(
      new MultipleFileValidationPipe(
        {
          name: 'avatar',
          size: { max: 1048576 },
          allowed: {
            types: ['png', 'jpeg'],
            message: 'Allowed formats: jpeg, png, jpg',
          },
        },
        {
          name: 'background',
          size: { max: 1048576 },
          allowed: {
            types: ['png', 'jpeg'],
          },
        },
      ),
    )
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    return {
      uploadedFiles: {
        avatar: files.avatar?.map(({ path, originalname, size }) => ({
          path,
          originalname,
          size,
        })),
        background: files.background?.map(({ path, originalname, size }) => ({
          path,
          originalname,
          size,
        })),
      },
    };
  }

  @Get(':id/retrieve/profile_photo')
  profilePhoto(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.profilePhoto(userId);
  }
}

import { HttpService } from '@nestjs/axios';
import { Request as ExpressRequest } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { SignInDto } from 'src/users/user.dtos';
import { Public } from 'src/decorators/route.decorator';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly httpService: HttpService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get()
  findChitchUsers(): Observable<AxiosResponse<any>> {
    return this.httpService
      .get('http://localhost:4000/users')
      .pipe(map((res) => res.data));
  }

  @Post('login')
  @Public()
  signIn(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    signInDto: SignInDto,
  ) {
    return this.authenticationService.signIn(signInDto);
  }

  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.authentication?.authorities;
  }
}

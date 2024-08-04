import { HttpService } from '@nestjs/axios';
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
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findChitchUsers(): Observable<AxiosResponse<any>> {
    return this.httpService
      .get('http://localhost:4000/users')
      .pipe(map((res) => res.data));
  }

  @Post('login')
  signIn(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}

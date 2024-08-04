import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  findChitchUsers(): Observable<AxiosResponse<any>> {
    return this.httpService
      .get('http://localhost:4000/users')
      .pipe(map((res) => res.data));
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('me')
  currentUser(@User() user?: string): string | undefined {
    return user;
  }
}

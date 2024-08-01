import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { ConfigService } from '@nestjs/config';
// import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('me')
  currentUser(@User() user?: string): string | undefined {
    return user;
  }

  @Get('env')
  env() {
    return {
      DATABASE_HOST: this.configService.get('DATABASE_HOST'),
      DATABASE_PORT: this.configService.get('DATABASE_PORT'),
      SECRET_KEY: this.configService.get('SECRET_KEY'),
      NODE_ENV: this.configService.get('NODE_ENV'),
      PORT: this.configService.get('PORT'),
      DATABASE_URL: this.configService.get('DATABASE_URL'),
    };
  }

  @Get('env/ts/conf')
  envConf() {
    return {
      port: this.configService.get<number>('port'),
      'database.host': this.configService.get<string>('database.host'),
    };
  }

  @Get('env/yaml')
  envYaml() {
    return {
      http: this.configService.get('http'),
      db: this.configService.get('db'),
      'db.postgres.database': this.configService.get<string>(
        'db.postgres.database',
      ),
      'db.mysql.port': this.configService.get<number>('db.mysql.port', 3306),
    };
  }
}

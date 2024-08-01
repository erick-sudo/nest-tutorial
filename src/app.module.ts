import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import configurationYaml from './config/configuration.yaml';
import * as Joi from 'joi';
// import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    // ConfigModule.register({ folder: './config' }),
    // ConfigModule.forRoot({
    //   envFilePath: ['.env', '.development.env'],
    // }),
    ConfigModule.forRoot({
      load: [configuration, configurationYaml],
      envFilePath: ['.env', '.development.env'],
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    CatsModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(logger, LoggerMiddleware).forRoutes(CatsController);
  // }
}

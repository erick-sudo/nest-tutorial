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
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { S3Module } from './s3/s3.module';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// import { ConfigModule } from './config/config.module';
import { FileController } from './file/file.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    // ConfigModule.register({ folder: './config' }),
    // ConfigModule.forRoot({
    //   envFilePath: ['.env', '.development.env'],
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'mysql_user',
    //   password: 'mysql_password',
    //   database: 'mysql_database',
    //   autoLoadEntities: true,
    //   // Setting synchronize: true shouldn't be used in production
    //   // - otherwise you can lose production data.
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'user_nest_tutorial',
      password: 'password_nest_tutorial',
      database: 'database_nest_tutorial',
      autoLoadEntities: true,
      // Setting synchronize: true shouldn't be used in production
      // - otherwise you can lose production data.
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27018/nest_tutorial'),
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
    ScheduleModule.forRoot(),
    CatsModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    S3Module,
  ],
  controllers: [AppController, FileController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(logger, LoggerMiddleware).forRoutes(CatsController);
  // }

  constructor(private dataSource: DataSource) {}
}

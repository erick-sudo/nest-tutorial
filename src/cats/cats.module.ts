import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
  imports: [TypeOrmModule.forFeature([Cat])],
})
export class CatsModule {}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Cat } from './cat.entity';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class CreateCatDto extends OmitType(Cat, ['id']) {}

export class UpdateCatDto extends PartialType(OmitType(Cat, ['id'])) {}

export class ListAllEntities {
  @IsOptional()
  @IsInt()
  limit: number;
}

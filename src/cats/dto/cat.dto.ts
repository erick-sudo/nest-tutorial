import { CreateCatDto } from './cat.schema';

export interface Cat extends CreateCatDto {
  id: number;
}

export class ListAllEntities {
  limit: number;
}

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(catDto: CreateCatDto) {
    const cat = {
      ...catDto,
      id: this.cats.length + 1,
    };
    this.cats.push(cat);
    return cat;
  }

  findAll(): Cat[] {
    return this.cats;
  }

  find(id: number): Cat | null {
    return this.cats.find((c) => c.id === id) || null;
  }
}

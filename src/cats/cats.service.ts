import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/cat.schema';
import { Cat } from './dto/cat.dto';

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
    const cat = this.cats.find((c) => c.id === id);
    if (cat) return cat;
    else throw new NotFoundException('Cat not found.');
  }
}

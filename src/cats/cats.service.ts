import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto, ListAllEntities, UpdateCatDto } from './cat.dtos';
import { Cat } from './cat.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private catRepository: Repository<Cat>,
    private dataSource: DataSource,
  ) {}

  create(createCatDto: CreateCatDto) {
    return this.catRepository.save(createCatDto);
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.findOne(id);

    const updatedCat = this.catRepository.merge(cat, updateCatDto);

    return this.catRepository.save(updatedCat);
  }

  async delete(id: number) {
    const cat = await this.findOne(id);
    this.catRepository.delete(cat.id)
  }

  async findAll(query?: ListAllEntities) {
    return this.catRepository.find();
  }

  async findOne(id: number) {
    return this.catRepository.findOneBy({ id }).then((cat) => {
      if (cat) return cat;
      else throw new NotFoundException('Cat not found.');
    });
  }
}

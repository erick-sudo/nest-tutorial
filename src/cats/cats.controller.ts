import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto/create-cat.dto';
import { Response } from 'express';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  findAll(@Query() query: ListAllEntities): any {
    return {
      cats: 'FIND ALL',
      limit: query.limit,
      result: this.catsService.findAll(),
    };
  }

  @Get('index')
  @Header('X-Nest', 'Tested')
  index(@Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.CREATED).cookie('_nest', 'nest-cookie');

    return { spec: 'library-specific' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.find(parseInt(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return {
      desc: `This action updates a #${id} cat`,
      updateCatDto,
    };
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<any> {
    return this.catsService.create(createCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}

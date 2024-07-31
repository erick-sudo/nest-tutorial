import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/filters/http.exception.filter';
import { ToIntegerPipe } from 'src/pipes/to.integer.pipe';
import { ListAllEntities } from './dto/cat.dto';
import { CreateCatDto, UpdateCatDto, createCatSchema } from './dto/cat.schema';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import { ClassValidationPipe } from 'src/pipes/validation.pipe';

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
  @UseFilters(HttpExceptionFilter)
  findOne(
    @Param('id', ToIntegerPipe)
    id: number,
  ) {
    return this.catsService.find(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto) {
    return {
      desc: `This action updates a #${id} cat`,
      updateCatDto,
    };
  }

  @Post()
  // @UsePipes(new ZodValidationPipe(createCatSchema))
  create(@Body(new ClassValidationPipe()) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}

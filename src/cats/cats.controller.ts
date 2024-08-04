import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { Public } from 'src/decorators/route.decorator';
import { CreateCatDto, ListAllEntities, UpdateCatDto } from './cat.dtos';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { Role } from 'src/auth/authorization/role.enum';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  @Public()
  @PreAuthorize([Role.Admin], {
    message: 'All cat details',
  })
  findAll(@Query(ValidationPipe) query: ListAllEntities): any {
    return this.catsService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  @PreAuthorize([Role.Admin], {
    message: 'Insufficient privileges to update cat details',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.update(id, updateCatDto);
  }

  @Post()
  @PreAuthorize([Role.Admin], {
    message: 'You cannot create a cat',
  })
  create(@Body(ValidationPipe) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Delete(':id')
  @PreAuthorize([Role.Admin], {
    message: 'Insufficient privileges to delete cats',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.delete(id);
  }
}

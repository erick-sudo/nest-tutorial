import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ToIntegerPipe implements PipeTransform<any, number> {
  transform(value: any, metadata: ArgumentMetadata) {
    const num = parseInt(value);
    if (num) {
      return num;
    }
    throw new HttpException(
      'Invalid argument',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

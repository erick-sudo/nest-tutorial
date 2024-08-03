import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Mime, validateSignature } from './magicnumber.filetype.validator';

export interface MultipleFilesValidationOption {
  name: string;
  size?: {
    max?: number;
    message?: string;
  };
  allowed?: {
    types?: Mime[];
    message?: string;
  };
  abortEarly?: boolean;
  required?: boolean;
}

type MultipleErrors = Record<string, { file: string; errors: string[] }[]>;

@Injectable()
export class MultipleFileValidationPipe implements PipeTransform {
  private readonly validationOptions: Array<MultipleFilesValidationOption>;

  constructor(...validationOptions: Array<MultipleFilesValidationOption>) {
    this.validationOptions = validationOptions;
  }

  private walkErrorTree(
    errors: MultipleErrors,
    fieldKey: string,
    originalname: string,
    errorMessage: string,
  ) {
    if (errors[fieldKey]) {
      let index = errors[fieldKey].findIndex(
        (err) => err.file === originalname,
      );

      if (index >= 0) {
        errors[fieldKey][index].errors.push(errorMessage);
      } else {
        errors[fieldKey].push({
          file: originalname,
          errors: [errorMessage],
        });
      }
    } else {
      errors[fieldKey] = [{ file: originalname, errors: [errorMessage] }];
    }
  }

  async transform(
    files: Record<string, Array<Express.Multer.File>>,
    _metadata: ArgumentMetadata,
  ) {
    const errors: MultipleErrors = {};
    for (let validationOption of this.validationOptions) {
      let abortEarly = false;
      for (let file of files[validationOption.name] || []) {
        const { size, originalname } = file;
        // Check size
        if (validationOption.size?.max) {
          if (size > validationOption.size.max) {
            const errorMessage =
              validationOption.size.message ||
              `File is larger than the required size(${validationOption.size.max / 1024 / 1024}MB)`;
            this.walkErrorTree(
              errors,
              validationOption.name,
              originalname,
              errorMessage,
            );

            if (validationOption.abortEarly) {
              abortEarly = true;
              // Break from innerloop
              break;
            }
          }
        }

        // Break from outerloop
        if (abortEarly) break;

        // Validate magic number
        if (
          validationOption.allowed?.types &&
          validationOption.allowed.types.length > 0
        ) {
          if (!validateSignature(file, validationOption.allowed.types)) {
            const errorMessage =
              validationOption.allowed.message ||
              `Invalid file type. Expected formats: ${validationOption.allowed.types.join(', ')}`;
            this.walkErrorTree(
              errors,
              validationOption.name,
              originalname,
              errorMessage,
            );
            if (validationOption.abortEarly) {
              abortEarly = true;
              // Break from innerloop
              break;
            }
          }
        }

        // Break from outerloop
        if (abortEarly) break;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new UnprocessableEntityException(errors);
    }

    return files;
  }
}

import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsMatching } from 'src/validators/ismatching.validator';

export class CreateUser {
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'invalid email address' })
  email: string;

  @IsStrongPassword({ minLength: 8 }, { message: 'weak password' })
  password: string;

  @ValidateIf((o, v) => !!o.password && !!o.confirmPassword)
  @IsMatching('password', { message: 'passwords do not match' })
  confirmPassword: string;
}

export class UpdateUser extends PartialType(
  OmitType(CreateUser, ['password', 'confirmPassword', 'email'] as const),
) {}

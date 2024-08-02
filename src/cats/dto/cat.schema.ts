import { IsInt, IsString } from 'class-validator';
import { z } from 'zod';
// import { PartialType } from "@nestjs/mapped-types"

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

// export type CreateCatDto = z.infer<typeof createCatSchema>;

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}

// export class UpdateCatDto extends PartialType(CreateCatDto) {}
export class UpdateCatDto extends CreateCatDto {}

import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RunDecisionDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds: number[];
}

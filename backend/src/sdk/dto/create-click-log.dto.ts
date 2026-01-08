import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClickLogDto {
  @IsNumber()
  @IsNotEmpty()
  viewId: number;
}

import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDismissLogDto {
  @IsInt()
  @IsNotEmpty()
  viewId: number;

  @IsString()
  @IsNotEmpty()
  blogKey: string;

  @IsString()
  @IsNotEmpty()
  postUrl: string;
}

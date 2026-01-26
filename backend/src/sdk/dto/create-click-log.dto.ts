import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateClickLogDto {
  @IsNumber()
  @IsNotEmpty()
  viewId: number;

  @IsString()
  @IsNotEmpty()
  blogKey: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  postUrl: string;
}

import { Expose } from 'class-transformer';
import { IsString, IsArray } from 'class-validator';

export class RTBRequestDto {
  @Expose()
  @IsString()
  postId: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Expose()
  @IsString()
  postURL: string;
}

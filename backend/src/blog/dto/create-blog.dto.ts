import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  blogName: string;

  @IsUrl()
  @IsNotEmpty()
  blogUrl: string;
}

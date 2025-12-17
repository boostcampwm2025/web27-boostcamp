import { Expose } from 'class-transformer';

export class RTBRequestDto {
  @Expose()
  sdkId: string;

  @Expose()
  postId: string;

  @Expose()
  tags: string[];

  @Expose()
  postURL: string;
}

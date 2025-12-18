import { Expose } from 'class-transformer';

export class RTBRequestDto {
  @Expose()
  postId: string;

  @Expose()
  tags: string[];

  @Expose()
  postURL: string;
}

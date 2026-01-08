import { Expose, Type } from 'class-transformer';

class TagDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class CampaignDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  url: string;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];

  @Expose()
  explain: string;

  @Expose()
  score: number;
}

export class RTBResponseDto {
  @Expose()
  @Type(() => CampaignDto)
  winner: CampaignDto;

  @Expose()
  @Type(() => CampaignDto)
  candidates: CampaignDto[];
}

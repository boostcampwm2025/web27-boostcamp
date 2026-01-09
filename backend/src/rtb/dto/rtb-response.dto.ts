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
  tags?: TagDto[]; // 추후에 추가 가능성

  @Expose()
  explain?: string; // 추후에 추가 가능성

  @Expose()
  score?: number; // 추후에 추가 가능성
}

class RTBDataDto {
  @Expose()
  auctionId: string;

  @Expose()
  @Type(() => CampaignDto)
  campaign: CampaignDto;
}

export class RTBResponseDto {
  @Expose()
  status: string;

  @Expose()
  message: string;

  @Expose()
  @Type(() => RTBDataDto)
  data: RTBDataDto;

  @Expose()
  timestamp: string;
}

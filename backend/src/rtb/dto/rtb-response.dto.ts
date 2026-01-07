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
  tags?: TagDto[]; // 추후에 추가될 수도 있으므로 optional

  @Expose()
  explain?: string; // 추후에 추가될 수도 있으므로 optional

  @Expose()
  score?: number; // 추후에 추가될 수도 있으므로 optional
}

class RTBDataDto {
  @Expose()
  @Type(() => CampaignDto)
  campaign: CampaignDto;

  @Expose()
  auctionId: string;
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

import { IsNotEmpty, IsString } from 'class-validator';

export class TrackClickDto {
  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @IsNotEmpty()
  @IsString()
  campaignName: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class TrackClickResponseDto {
  redirectUrl: string;
  logId: string;
  timestamp: string;
}

import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClickLogDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId: string;

  @IsUUID()
  @IsNotEmpty()
  campaignId: string;
}

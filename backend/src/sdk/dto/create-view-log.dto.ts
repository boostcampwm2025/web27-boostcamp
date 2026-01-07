import {
  IsNumber,
  IsUUID,
  IsUrl,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateViewLogDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId: string;

  @IsUUID()
  @IsNotEmpty()
  campaignId: string;

  @IsUrl()
  @IsNotEmpty()
  postUrl: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  positionRatio?: number;
}

import {
  IsNumber,
  IsUUID,
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  positionRatio?: number;
}

import {
  IsNumber,
  IsString,
  IsUrl,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateViewLogDto {
  @IsString()
  @IsNotEmpty()
  auctionId: string;

  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsUrl()
  @IsNotEmpty()
  postUrl: string;

  @IsBoolean()
  @IsNotEmpty()
  isHighIntent: boolean;

  @IsNumber()
  @IsNotEmpty()
  behaviorScore: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  positionRatio?: number;
}

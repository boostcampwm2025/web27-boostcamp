import {
  IsNumber,
  // IsUUID,
  IsUrl,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreateViewLogDto {
  // @IsUUID()
  @IsString()
  @IsNotEmpty()
  auctionId: string;

  // @IsUUID()
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

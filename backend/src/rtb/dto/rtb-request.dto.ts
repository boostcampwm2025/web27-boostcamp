import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export class BehaviorDataDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  dwellTime?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  scrollDepth?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  copyCount?: number;
}

export class RTBRequestDto {
  @Expose()
  @IsString()
  campaignId: string;

  @Expose()
  @IsString()
  sessionId: string;

  @Expose()
  @IsString()
  url: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Expose()
  @ValidateNested()
  @Type(() => BehaviorDataDto)
  @IsOptional() // 표에서 Nullable이 Y
  behaviorData?: BehaviorDataDto;

  @Expose()
  @IsOptional()
  @IsNumber()
  behaviorScore: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isHighIntent: boolean;
}

import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  IsUrl,
  MaxLength,
  Min,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: '제목은 최대 30자까지 입력 가능합니다.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '내용은 최대 100자까지 입력 가능합니다.' })
  content?: string;

  @IsOptional()
  @IsUrl({}, { message: '올바른 이미지 URL 형식이 아닙니다.' })
  image?: string;

  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean({ message: '고의도 학습자 여부는 boolean이어야 합니다.' })
  isHighIntent?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '최대 CPC는 정수여야 합니다.' })
  @Min(0, { message: '최대 CPC는 0 이상이어야 합니다.' })
  maxCpc?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '일일 예산은 정수여야 합니다.' })
  @Min(0, { message: '일일 예산은 0 이상이어야 합니다.' })
  dailyBudget?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '총 예산은 정수여야 합니다.' })
  @Min(0, { message: '총 예산은 0 이상이어야 합니다.' })
  totalBudget?: number;

  @IsOptional()
  @IsIn(['ACTIVE', 'PAUSED'], {
    message: '상태는 ACTIVE 또는 PAUSED만 가능합니다.',
  })
  status?: 'ACTIVE' | 'PAUSED';

  @IsOptional()
  @IsDateString({}, { message: '시작일은 ISO 8601 형식이어야 합니다.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '종료일은 ISO 8601 형식이어야 합니다.' })
  endDate?: string;
}

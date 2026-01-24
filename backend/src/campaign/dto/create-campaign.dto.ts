import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsDateString,
  IsArray,
  IsUrl,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MaxLength(20, { message: '제목은 최대 20자까지 입력 가능합니다.' })
  title: string;

  @IsString()
  @MaxLength(100, { message: '내용은 최대 100자까지 입력 가능합니다.' })
  content: string;

  @IsUrl({}, { message: '올바른 이미지 URL 형식이 아닙니다.' })
  image: string;

  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  url: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Type(() => Number)
  @IsInt({ message: '최대 CPC는 정수여야 합니다.' })
  @Min(100, { message: '최대 CPC는 100원 이상이어야 합니다.' })
  maxCpc: number;

  @Type(() => Number)
  @IsInt({ message: '일일 예산은 정수여야 합니다.' })
  @Min(3000, { message: '일일 예산은 3,000원 이상이어야 합니다.' })
  dailyBudget: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '총 예산은 정수여야 합니다.' })
  @Min(0, { message: '총 예산은 0 이상이어야 합니다.' })
  totalBudget: number | null;

  @IsDateString({}, { message: '시작일은 ISO 8601 형식이어야 합니다.' })
  startDate: string;

  @IsDateString({}, { message: '종료일은 ISO 8601 형식이어야 합니다.' })
  endDate: string;

  @IsBoolean()
  isHighIntent: boolean;
}

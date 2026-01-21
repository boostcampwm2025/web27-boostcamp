import { Type } from 'class-transformer';
import { IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { CampaignStatus } from '../entities/campaign.entity';

export class GetCampaignListDto {
  @IsOptional()
  @IsIn(['PENDING', 'ACTIVE', 'PAUSED', 'ENDED'], {
    message: '상태는 PENDING, ACTIVE, PAUSED, ENDED 중 하나여야 합니다.',
  })
  status?: CampaignStatus;

  @IsOptional()
  @IsIn(['createdAt', 'startDate', 'endDate'], {
    message: '정렬 기준은 createdAt, startDate, endDate 중 하나여야 합니다.',
  })
  sortBy?: 'createdAt' | 'startDate' | 'endDate' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: '정렬 방향은 asc 또는 desc여야 합니다.',
  })
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit은 정수여야 합니다.' })
  @Min(1, { message: 'limit은 1 이상이어야 합니다.' })
  limit?: number = 3;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset은 정수여야 합니다.' })
  @Min(0, { message: 'offset은 0 이상이어야 합니다.' })
  offset?: number = 0;
}

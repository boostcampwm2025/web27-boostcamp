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
  @Type(() => Number)
  @IsInt({ message: 'limit은 정수여야 합니다.' })
  @Min(1, { message: 'limit은 1 이상이어야 합니다.' })
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset은 정수여야 합니다.' })
  @Min(0, { message: 'offset은 0 이상이어야 합니다.' })
  offset?: number = 0;
}

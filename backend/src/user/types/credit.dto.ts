import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ChargeCreditDto {
  @IsNotEmpty({ message: '충전 금액을 입력해주세요' })
  @Type(() => Number)
  @IsInt({ message: '충전 금액은 정수여야 합니다' })
  @Min(1000, { message: '충전 금액은 1,000원 이상이어야 합니다' })
  amount: number;
}

export class GetCreditHistoryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

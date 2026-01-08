import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class SeedAuctionDto {
  @IsUUID()
  @IsNotEmpty()
  auctionId: string;

  @IsInt()
  @Min(1)
  blogId: number;

  @IsInt()
  @Min(0)
  cost: number;
}

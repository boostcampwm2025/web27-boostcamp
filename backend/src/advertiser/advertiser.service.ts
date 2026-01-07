import { Injectable } from '@nestjs/common';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class AdvertiserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly campaignRepository: CampaignRepository
  ) {}
  getDashboardStats(userId: number) {
    const isAdvertiser = this.userRepository.verifyRole(userId, 'ADVERTISER');

    if (isAdvertiser === false) {
      return;
    }
    const campaignIds = this.campaignRepository
      .listByUserId(userId)
      .map((campaign) => campaign.id);
  }
}

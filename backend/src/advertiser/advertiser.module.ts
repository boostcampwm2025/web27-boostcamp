import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserService } from './advertiser.service';
import { UserModule } from 'src/user/user.module';
import { CampaignModule } from 'src/campaign/campaign.module';
import { LogModule } from 'src/log/log.module';
import { CreditHistoryEntity } from './entities/credit-history.entity';
import { CreditHistoryRepository } from './repository/credit-history.repository.interface';
import { TypeOrmCreditHistoryRepository } from './repository/typeorm-credit-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditHistoryEntity]),
    UserModule,
    // forwardRef(() => CampaignModule),
    CampaignModule,
    LogModule,
  ],
  controllers: [AdvertiserController],
  providers: [
    AdvertiserService,
    {
      provide: CreditHistoryRepository,
      useClass: TypeOrmCreditHistoryRepository,
    },
  ],
  exports: [AdvertiserService, CreditHistoryRepository],
})
export class AdvertiserModule {}

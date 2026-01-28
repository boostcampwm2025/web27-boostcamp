import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { AdvertiserModule } from '../advertiser/advertiser.module';

@Module({
  imports: [AdvertiserModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

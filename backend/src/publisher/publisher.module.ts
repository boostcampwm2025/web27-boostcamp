import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { UserModule } from 'src/user/user.module';
import { ClickLogEntity } from 'src/log/entities/click-log.entity';
import { ViewLogEntity } from 'src/log/entities/view-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClickLogEntity, ViewLogEntity]),
    UserModule,
  ],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}

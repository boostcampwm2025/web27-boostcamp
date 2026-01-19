import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogRepository } from './repository/log.repository.interface';
// import { InMemoryLogRepository } from './repository/in-memory-log.repository';
import { TypeOrmLogRepository } from './repository/typeorm-log.repository';
import { ViewLogEntity } from './entities/view-log.entity';
import { ClickLogEntity } from './entities/click-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewLogEntity, ClickLogEntity])],
  providers: [{ provide: LogRepository, useClass: TypeOrmLogRepository }],
  exports: [LogRepository],
})
export class LogModule {}

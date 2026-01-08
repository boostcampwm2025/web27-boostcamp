import { Module } from '@nestjs/common';
import { LogRepository } from './repository/log.repository';
import { InMemoryLogRepository } from './repository/in-memory-log.repository';

@Module({
  providers: [{ provide: LogRepository, useClass: InMemoryLogRepository }],
  exports: [LogRepository],
})
export class LogModule {}

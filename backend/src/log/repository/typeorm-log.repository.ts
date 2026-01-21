import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository.interface';
import { ViewLogEntity } from '../entities/view-log.entity';
import { ClickLogEntity } from '../entities/click-log.entity';
import { SaveViewLog } from '../types/save-view-log.type';
import { SaveClickLog } from '../types/save-click-log.type';

@Injectable()
export class TypeOrmLogRepository extends LogRepository {
  constructor(
    @InjectRepository(ViewLogEntity)
    private readonly viewLogRepository: Repository<ViewLogEntity>,
    @InjectRepository(ClickLogEntity)
    private readonly clickLogRepository: Repository<ClickLogEntity>
  ) {
    super();
  }

  async saveViewLog(dto: SaveViewLog): Promise<number> {
    const viewLog = await this.viewLogRepository.save(dto);
    return viewLog.id;
  }

  async saveClickLog(dto: SaveClickLog): Promise<number> {
    const clickLog = await this.clickLogRepository.save(dto);
    return clickLog.id;
  }

  async getViewLog(viewId: number): Promise<SaveViewLog | undefined> {
    const viewLog = await this.viewLogRepository.findOne({
      where: { id: viewId },
    });
    return viewLog ? viewLog : undefined;
  }

  async listViewLogs(): Promise<SaveViewLog[]> {
    const logs = await this.viewLogRepository.find();
    return logs;
  }

  async listClickLogs(): Promise<SaveClickLog[]> {
    const logs = await this.clickLogRepository.find();
    return logs;
  }
}

import { SaveClickLog } from '../types/save-click-log.type';
import { SaveViewLog } from '../types/save-view-log.type';
import { LogRepository } from './log.repository.interface';

export class InMemoryLogRepository extends LogRepository {
  private readonly viewLog = new Map<number, SaveViewLog>();
  private viewLogIdx = 0;
  private readonly clickLog = new Map<number, SaveClickLog>();
  private clickLogIdx = 0;

  // 인메모리 Map 자료구조에 저장
  saveViewLog(dto: SaveViewLog): Promise<number> {
    this.viewLogIdx += 1;
    this.viewLog.set(this.viewLogIdx, { ...dto });

    return Promise.resolve(this.viewLogIdx);
  }

  saveClickLog(dto: SaveClickLog): Promise<number> {
    this.clickLogIdx += 1;
    this.clickLog.set(this.clickLogIdx, { ...dto });

    return Promise.resolve(this.clickLogIdx);
  }

  getViewLog(viewId: number): Promise<SaveViewLog | undefined> {
    return Promise.resolve(this.viewLog.get(viewId));
  }

  listViewLogs(): Promise<SaveViewLog[]> {
    return Promise.resolve(Array.from(this.viewLog.values()));
  }

  listClickLogs(): Promise<SaveClickLog[]> {
    return Promise.resolve(Array.from(this.clickLog.values()));
  }
}

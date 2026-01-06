import { SaveClickLogDto } from '../dto/save-click-log.dto';
import { SaveViewLogDto } from '../dto/save-view-log.dto';

export abstract class LogRepository {
  abstract saveViewLog(dto: SaveViewLogDto): number;
  abstract saveClickLog(dto: SaveClickLogDto): void;
}

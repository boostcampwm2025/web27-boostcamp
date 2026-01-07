import { SaveClickLog } from '../types/save-click-log.type';
import { SaveViewLog } from '../types/save-view-log.type';

export abstract class LogRepository {
  abstract saveViewLog(dto: SaveViewLog): number;
  abstract saveClickLog(dto: SaveClickLog): number;
}

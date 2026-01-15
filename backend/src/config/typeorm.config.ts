import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_DATABASE', 'database'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') !== 'production', // 개발 시에만 자동 동기화
  // synchronize: true, // 개발 시에만 자동 동기화
  // synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  timezone: '+09:00', // KST
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { DataSource } from 'typeorm';
// import { TypeOrmLogRepository } from './typeorm-log.repository';
// import { ViewLogEntity } from '../entities/view-log.entity';
// import { ClickLogEntity } from '../entities/click-log.entity';
// import { SaveViewLog } from '../types/save-view-log.type';
// import { SaveClickLog } from '../types/save-click-log.type';
// import { getTypeOrmConfig } from '../../config/typeorm.config';
// import { Campaign } from '../../campaign/entities/campaign.entity';
// import { Blog } from '../../blog/entities/blog.entity';
// import { User } from '../../user/entities/user.entity';
// import { BidLogEntity } from '../../bid-log/entities/bid-log.entity';
// import { Tag } from '../../tag/entities/tag.entity';
// import { OAuthAccount } from '../../auth/entities/oauth-account.entity';
// import { UserCredential } from '../../auth/entities/user-credential.entity';

// // Jest 타임아웃 증가 (실제 DB 연결 시간 고려)
// jest.setTimeout(30000);

// describe('TypeOrmLogRepository (Real DB Integration Test)', () => {
//   let repository: TypeOrmLogRepository;
//   let dataSource: DataSource;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot({
//           isGlobal: true,
//           envFilePath: '.env',
//         }),
//         TypeOrmModule.forRootAsync({
//           imports: [ConfigModule],
//           useFactory: (configService: ConfigService) => ({
//             ...getTypeOrmConfig(configService),
//             // 테스트 환경에서는 glob 패턴 대신 직접 엔티티 배열 지정
//             entities: [
//               ViewLogEntity,
//               ClickLogEntity,
//               BidLogEntity,
//               Campaign,
//               Blog,
//               User,
//               Tag,
//               OAuthAccount,
//               UserCredential,
//             ],
//           }),
//           inject: [ConfigService],
//         }),
//         TypeOrmModule.forFeature([ViewLogEntity, ClickLogEntity]),
//       ],
//       providers: [TypeOrmLogRepository],
//     }).compile();

//     repository = module.get<TypeOrmLogRepository>(TypeOrmLogRepository);
//     dataSource = module.get<DataSource>(DataSource);
//   });

//   afterAll(async () => {
//     if (dataSource && dataSource.isInitialized) {
//       await dataSource.destroy();
//     }
//   });

//   beforeEach(async () => {
//     // 각 테스트 전 ViewLog, ClickLog 테이블 데이터 정리 (실제 DB 사용)
//     if (dataSource && dataSource.isInitialized) {
//       await dataSource.getRepository(ClickLogEntity).clear();
//       await dataSource.getRepository(ViewLogEntity).clear();
//     }
//   });

//   describe('saveViewLog', () => {
//     it('ViewLog를 저장하고 생성된 ID를 반환해야 함', async () => {
//       const viewLog: SaveViewLog = {
//         auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//         campaignId: '550e8400-e29b-41d4-a716-446655440000',
//         blogId: 1,
//         postUrl: 'https://devblog.example.com/posts/1',
//         cost: 500,
//         positionRatio: 0.2,
//         isHighIntent: false,
//         behaviorScore: 35,
//       };

//       const viewId = await repository.saveViewLog(viewLog);

//       expect(viewId).toBeDefined();
//       expect(typeof viewId).toBe('number');
//       expect(viewId).toBeGreaterThan(0);
//     });

//     it('nullable 필드(postUrl, positionRatio, behaviorScore)를 null로 저장할 수 있어야 함', async () => {
//       const viewLog: SaveViewLog = {
//         auctionId: 'test-auction',
//         campaignId: 'test-campaign',
//         blogId: 1,
//         postUrl: null,
//         cost: 800,
//         positionRatio: null,
//         isHighIntent: true,
//         behaviorScore: null,
//       };

//       const viewId = await repository.saveViewLog(viewLog);

//       const savedLog = await repository.getViewLog(viewId);
//       expect(savedLog).toBeDefined();
//       expect(savedLog!.postUrl).toBeNull();
//       expect(savedLog!.positionRatio).toBeNull();
//       expect(savedLog!.behaviorScore).toBeNull();
//     });

//     it('createdAt이 자동으로 생성되어야 함', async () => {
//       const viewLog: SaveViewLog = {
//         auctionId: 'test-auction',
//         campaignId: 'test-campaign',
//         blogId: 1,
//         postUrl: 'https://example.com/post',
//         cost: 500,
//         positionRatio: 0.5,
//         isHighIntent: false,
//         behaviorScore: 50,
//       };

//       const viewId = await repository.saveViewLog(viewLog);
//       const savedLog = await repository.getViewLog(viewId);

//       expect(savedLog!.createdAt).toBeDefined();
//       expect(savedLog!.createdAt).toBeInstanceOf(Date);
//     });
//   });

//   describe('saveClickLog', () => {
//     it('ClickLog를 저장하고 생성된 ID를 반환해야 함', async () => {
//       // ViewLog 먼저 생성 (ClickLog는 ViewLog에 의존)
//       const viewId = await repository.saveViewLog({
//         auctionId: 'test-auction',
//         campaignId: 'test-campaign',
//         blogId: 1,
//         postUrl: 'https://example.com/post',
//         cost: 500,
//         positionRatio: 0.5,
//         isHighIntent: false,
//         behaviorScore: 50,
//       });

//       const clickLog: SaveClickLog = {
//         viewId,
//       };

//       const clickId = await repository.saveClickLog(clickLog);

//       expect(clickId).toBeDefined();
//       expect(typeof clickId).toBe('number');
//       expect(clickId).toBeGreaterThan(0);
//     });

//     it('createdAt이 자동으로 생성되어야 함', async () => {
//       const viewId = await repository.saveViewLog({
//         auctionId: 'test-auction',
//         campaignId: 'test-campaign',
//         blogId: 1,
//         postUrl: 'https://example.com/post',
//         cost: 500,
//         positionRatio: 0.5,
//         isHighIntent: false,
//         behaviorScore: 50,
//       });

//       const clickId = await repository.saveClickLog({ viewId });
//       const clickLogs = await repository.listClickLogs();

//       expect(clickLogs[0].createdAt).toBeDefined();
//       expect(clickLogs[0].createdAt).toBeInstanceOf(Date);
//     });
//   });

//   describe('getViewLog', () => {
//     it('특정 ViewLog를 조회해야 함', async () => {
//       const viewLog: SaveViewLog = {
//         auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//         campaignId: '550e8400-e29b-41d4-a716-446655440000',
//         blogId: 1,
//         postUrl: 'https://devblog.example.com/posts/1',
//         cost: 500,
//         positionRatio: 0.2,
//         isHighIntent: false,
//         behaviorScore: 35,
//       };

//       const viewId = await repository.saveViewLog(viewLog);
//       const retrieved = await repository.getViewLog(viewId);

//       expect(retrieved).toBeDefined();
//       expect(retrieved!.auctionId).toBe(viewLog.auctionId);
//       expect(retrieved!.campaignId).toBe(viewLog.campaignId);
//       expect(retrieved!.cost).toBe(viewLog.cost);
//     });

//     it('존재하지 않는 viewId는 undefined를 반환해야 함', async () => {
//       const retrieved = await repository.getViewLog(99999);

//       expect(retrieved).toBeUndefined();
//     });
//   });

//   describe('listViewLogs', () => {
//     it('모든 ViewLog를 조회해야 함', async () => {
//       const viewLogs: SaveViewLog[] = [
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           postUrl: 'https://devblog.example.com/posts/1',
//           cost: 500,
//           positionRatio: 0.2,
//           isHighIntent: false,
//           behaviorScore: 35,
//         },
//         {
//           auctionId: '9b3e7c1a-4f2b-4c8d-9a1e-3c7b2f4a8d11',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           postUrl: 'https://devblog.example.com/posts/2',
//           cost: 500,
//           positionRatio: 0.6,
//           isHighIntent: false,
//           behaviorScore: 20,
//         },
//         {
//           auctionId: '5d2a8c4f-1b6c-4f2a-8c4f-9b3e7c1a4f21',
//           campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//           blogId: 1,
//           postUrl: 'https://devblog.example.com/posts/3',
//           cost: 800,
//           positionRatio: 0.1,
//           isHighIntent: true,
//           behaviorScore: 80,
//         },
//       ];

//       for (const log of viewLogs) {
//         await repository.saveViewLog(log);
//       }

//       const allLogs = await repository.listViewLogs();

//       expect(allLogs).toHaveLength(3);
//       expect(allLogs[0].auctionId).toBe(viewLogs[0].auctionId);
//       expect(allLogs[1].cost).toBe(viewLogs[1].cost);
//       expect(allLogs[2].isHighIntent).toBe(true);
//     });

//     it('데이터가 없으면 빈 배열을 반환해야 함', async () => {
//       const allLogs = await repository.listViewLogs();

//       expect(allLogs).toHaveLength(0);
//       expect(allLogs).toEqual([]);
//     });
//   });

//   describe('listClickLogs', () => {
//     it('모든 ClickLog를 조회해야 함', async () => {
//       // ViewLog 먼저 생성
//       const viewId1 = await repository.saveViewLog({
//         auctionId: 'auction-1',
//         campaignId: 'campaign-1',
//         blogId: 1,
//         postUrl: 'https://example.com/post1',
//         cost: 500,
//         positionRatio: 0.5,
//         isHighIntent: false,
//         behaviorScore: 50,
//       });

//       const viewId2 = await repository.saveViewLog({
//         auctionId: 'auction-2',
//         campaignId: 'campaign-2',
//         blogId: 1,
//         postUrl: 'https://example.com/post2',
//         cost: 800,
//         positionRatio: 0.3,
//         isHighIntent: true,
//         behaviorScore: 70,
//       });

//       // ClickLog 생성
//       await repository.saveClickLog({ viewId: viewId1 });
//       await repository.saveClickLog({ viewId: viewId2 });

//       const allClickLogs = await repository.listClickLogs();

//       expect(allClickLogs).toHaveLength(2);
//       expect(allClickLogs[0].viewId).toBe(viewId1);
//       expect(allClickLogs[1].viewId).toBe(viewId2);
//     });

//     it('데이터가 없으면 빈 배열을 반환해야 함', async () => {
//       const allClickLogs = await repository.listClickLogs();

//       expect(allClickLogs).toHaveLength(0);
//       expect(allClickLogs).toEqual([]);
//     });
//   });

//   describe('통합 시나리오', () => {
//     it('ViewLog 저장 후 ClickLog를 연결하여 저장하고 조회할 수 있어야 함', async () => {
//       // ViewLog 저장
//       const viewLog: SaveViewLog = {
//         auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//         campaignId: '550e8400-e29b-41d4-a716-446655440000',
//         blogId: 1,
//         postUrl: 'https://devblog.example.com/posts/1',
//         cost: 500,
//         positionRatio: 0.2,
//         isHighIntent: false,
//         behaviorScore: 35,
//       };

//       const viewId = await repository.saveViewLog(viewLog);

//       // ClickLog 저장
//       const clickId = await repository.saveClickLog({ viewId });

//       // 조회 검증
//       const retrievedView = await repository.getViewLog(viewId);
//       const allClicks = await repository.listClickLogs();

//       expect(retrievedView).toBeDefined();
//       expect(retrievedView!.id).toBe(viewId);
//       expect(allClicks).toHaveLength(1);
//       expect(allClicks[0].viewId).toBe(viewId);
//     });

//     it('실제 DB 샘플 데이터 시나리오를 재현할 수 있어야 함', async () => {
//       // 샘플 ViewLog 데이터 저장
//       const viewId1 = await repository.saveViewLog({
//         auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//         campaignId: '550e8400-e29b-41d4-a716-446655440000',
//         blogId: 1,
//         postUrl: 'https://devblog.example.com/posts/1',
//         cost: 500,
//         positionRatio: 0.2,
//         isHighIntent: false,
//         behaviorScore: 35,
//       });

//       const viewId3 = await repository.saveViewLog({
//         auctionId: '5d2a8c4f-1b6c-4f2a-8c4f-9b3e7c1a4f21',
//         campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//         blogId: 1,
//         postUrl: 'https://devblog.example.com/posts/3',
//         cost: 800,
//         positionRatio: 0.1,
//         isHighIntent: true,
//         behaviorScore: 80,
//       });

//       // 샘플 ClickLog 데이터 저장
//       await repository.saveClickLog({ viewId: viewId1 });
//       await repository.saveClickLog({ viewId: viewId3 });

//       // 검증
//       const allViews = await repository.listViewLogs();
//       const allClicks = await repository.listClickLogs();

//       expect(allViews).toHaveLength(2);
//       expect(allClicks).toHaveLength(2);
//       expect(allClicks[0].viewId).toBe(viewId1);
//       expect(allClicks[1].viewId).toBe(viewId3);
//     });
//   });
// });

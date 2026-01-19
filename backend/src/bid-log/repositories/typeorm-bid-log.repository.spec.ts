// import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { DataSource } from 'typeorm';
// import { TypeOrmBidLogRepository } from './typeorm-bid-log.repository';
// import { BidLog as BidLogEntity } from '../entities/bid-log.entity';
// import { BidLog, BidStatus } from '../bid-log.types';
// import { getTypeOrmConfig } from '../../config/typeorm.config';
// import { Campaign } from '../../campaign/entities/campaign.entity';
// import { Blog } from '../../blog/entities/blog.entity';
// import { User } from '../../user/entities/user.entity';
// import { ViewLog as ViewLogEntity } from '../../log/entities/view-log.entity';
// import { ClickLog as ClickLogEntity } from '../../log/entities/click-log.entity';
// import { Tag } from '../../tag/entities/tag.entity';
// import { OAuthAccount } from '../../auth/entities/oauth-account.entity';
// import { UserCredential } from '../../auth/entities/user-credential.entity';

// // Jest 타임아웃 증가 (실제 DB 연결 시간 고려)
// jest.setTimeout(30000);

// describe('TypeOrmBidLogRepository (Real DB Integration Test)', () => {
//   let repository: TypeOrmBidLogRepository;
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
//               BidLogEntity,
//               Campaign,
//               Blog,
//               User,
//               ViewLogEntity,
//               ClickLogEntity,
//               Tag,
//               OAuthAccount,
//               UserCredential,
//             ],
//           }),
//           inject: [ConfigService],
//         }),
//         TypeOrmModule.forFeature([BidLogEntity]),
//       ],
//       providers: [TypeOrmBidLogRepository],
//     }).compile();

//     repository = module.get<TypeOrmBidLogRepository>(TypeOrmBidLogRepository);
//     dataSource = module.get<DataSource>(DataSource);
//   });

//   afterAll(async () => {
//     if (dataSource && dataSource.isInitialized) {
//       await dataSource.destroy();
//     }
//   });

//   beforeEach(async () => {
//     // 각 테스트 전 BidLog 테이블 데이터 정리 (실제 DB 사용)
//     if (dataSource && dataSource.isInitialized) {
//       await dataSource.getRepository(BidLogEntity).clear();
//     }
//   });

//   describe('save', () => {
//     it('단일 BidLog를 저장하고 자동 생성된 ID를 확인해야 함', async () => {
//       const bidLog: BidLog = {
//         auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//         campaignId: '550e8400-e29b-41d4-a716-446655440000',
//         blogId: 1,
//         status: BidStatus.WIN,
//         bidPrice: 320,
//         reason: null,
//       };

//       await repository.save(bidLog);

//       const savedLogs = await repository.getAll();
//       expect(savedLogs).toHaveLength(1);
//       expect(savedLogs[0].id).toBeDefined();
//       expect(savedLogs[0].auctionId).toBe(bidLog.auctionId);
//       expect(savedLogs[0].status).toBe(BidStatus.WIN);
//     });

//     it('createdAt이 자동으로 생성되어야 함', async () => {
//       const bidLog: BidLog = {
//         auctionId: 'test-auction-id',
//         campaignId: 'test-campaign-id',
//         blogId: 1,
//         status: BidStatus.LOSS,
//         bidPrice: 280,
//         reason: '입찰가 미달',
//       };

//       await repository.save(bidLog);

//       const savedLogs = await repository.getAll();
//       expect(savedLogs[0].createdAt).toBeDefined();
//       expect(savedLogs[0].createdAt).toBeInstanceOf(Date);
//     });
//   });

//   describe('saveMany', () => {
//     it('여러 BidLog를 일괄 저장해야 함', async () => {
//       const bidLogs: BidLog[] = [
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           status: BidStatus.WIN,
//           bidPrice: 320,
//           reason: null,
//         },
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//           blogId: 1,
//           status: BidStatus.LOSS,
//           bidPrice: 280,
//           reason: '입찰가 미달',
//         },
//       ];

//       await repository.saveMany(bidLogs);

//       const savedLogs = await repository.getAll();
//       expect(savedLogs).toHaveLength(2);
//       expect(savedLogs[0].status).toBe(BidStatus.WIN);
//       expect(savedLogs[1].status).toBe(BidStatus.LOSS);
//     });
//   });

//   describe('findByAuctionId', () => {
//     beforeEach(async () => {
//       // 테스트 데이터 준비
//       await repository.saveMany([
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           status: BidStatus.WIN,
//           bidPrice: 320,
//           reason: null,
//         },
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//           blogId: 1,
//           status: BidStatus.LOSS,
//           bidPrice: 280,
//           reason: '입찰가 미달',
//         },
//         {
//           auctionId: 'different-auction-id',
//           campaignId: 'test-campaign',
//           blogId: 2,
//           status: BidStatus.WIN,
//           bidPrice: 500,
//           reason: null,
//         },
//       ]);
//     });

//     it('특정 옥션 ID의 모든 입찰 로그를 조회해야 함', async () => {
//       const logs = await repository.findByAuctionId(
//         'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10'
//       );

//       expect(logs).toHaveLength(2);
//       expect(
//         logs.every(
//           (log) => log.auctionId === 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10'
//         )
//       ).toBe(true);
//     });

//     it('존재하지 않는 옥션 ID는 빈 배열을 반환해야 함', async () => {
//       const logs = await repository.findByAuctionId('non-existent-auction');

//       expect(logs).toHaveLength(0);
//       expect(logs).toEqual([]);
//     });
//   });

//   describe('findByCampaignId', () => {
//     beforeEach(async () => {
//       await repository.saveMany([
//         {
//           auctionId: 'auction-1',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           status: BidStatus.WIN,
//           bidPrice: 320,
//           reason: null,
//         },
//         {
//           auctionId: 'auction-2',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           status: BidStatus.LOSS,
//           bidPrice: 300,
//           reason: null,
//         },
//         {
//           auctionId: 'auction-3',
//           campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//           blogId: 2,
//           status: BidStatus.WIN,
//           bidPrice: 500,
//           reason: null,
//         },
//       ]);
//     });

//     it('특정 캠페인 ID의 모든 입찰 로그를 조회해야 함', async () => {
//       const logs = await repository.findByCampaignId(
//         '550e8400-e29b-41d4-a716-446655440000'
//       );

//       expect(logs).toHaveLength(2);
//       expect(
//         logs.every(
//           (log) => log.campaignId === '550e8400-e29b-41d4-a716-446655440000'
//         )
//       ).toBe(true);
//     });

//     it('존재하지 않는 캠페인 ID는 빈 배열을 반환해야 함', async () => {
//       const logs = await repository.findByCampaignId('non-existent-campaign');

//       expect(logs).toHaveLength(0);
//     });
//   });

//   describe('findWinAmountByAuctionId', () => {
//     beforeEach(async () => {
//       await repository.saveMany([
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '550e8400-e29b-41d4-a716-446655440000',
//           blogId: 1,
//           status: BidStatus.WIN,
//           bidPrice: 320,
//           reason: null,
//         },
//         {
//           auctionId: 'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10',
//           campaignId: '8c3a1f39-4d7f-4f1d-9d46-2c8a0b2f9a3d',
//           blogId: 1,
//           status: BidStatus.LOSS,
//           bidPrice: 280,
//           reason: '입찰가 미달',
//         },
//       ]);
//     });

//     it('WIN 상태의 낙찰가를 반환해야 함', async () => {
//       const winAmount = await repository.findWinAmountByAuctionId(
//         'c8f4b6a2-8c4f-4f6b-a2f4-1b6c8f4a2d10'
//       );

//       expect(winAmount).toBe(320);
//     });

//     it('WIN 상태가 없으면 null을 반환해야 함', async () => {
//       await repository.save({
//         auctionId: 'only-loss-auction',
//         campaignId: 'test-campaign',
//         blogId: 1,
//         status: BidStatus.LOSS,
//         bidPrice: 200,
//         reason: '낙찰 실패',
//       });

//       const winAmount =
//         await repository.findWinAmountByAuctionId('only-loss-auction');

//       expect(winAmount).toBeNull();
//     });

//     it('존재하지 않는 옥션 ID는 null을 반환해야 함', async () => {
//       const winAmount =
//         await repository.findWinAmountByAuctionId('non-existent');

//       expect(winAmount).toBeNull();
//     });
//   });

//   describe('count', () => {
//     it('저장된 BidLog의 총 개수를 반환해야 함', async () => {
//       expect(await repository.count()).toBe(0);

//       await repository.save({
//         auctionId: 'test-1',
//         campaignId: 'campaign-1',
//         blogId: 1,
//         status: BidStatus.WIN,
//         bidPrice: 100,
//         reason: null,
//       });

//       expect(await repository.count()).toBe(1);

//       await repository.saveMany([
//         {
//           auctionId: 'test-2',
//           campaignId: 'campaign-2',
//           blogId: 2,
//           status: BidStatus.LOSS,
//           bidPrice: 200,
//           reason: null,
//         },
//         {
//           auctionId: 'test-3',
//           campaignId: 'campaign-3',
//           blogId: 3,
//           status: BidStatus.WIN,
//           bidPrice: 300,
//           reason: null,
//         },
//       ]);

//       expect(await repository.count()).toBe(3);
//     });
//   });

//   describe('getAll', () => {
//     it('모든 BidLog를 조회해야 함', async () => {
//       const testLogs: BidLog[] = [
//         {
//           auctionId: 'auction-1',
//           campaignId: 'campaign-1',
//           blogId: 1,
//           status: BidStatus.WIN,
//           bidPrice: 320,
//           reason: null,
//         },
//         {
//           auctionId: 'auction-2',
//           campaignId: 'campaign-2',
//           blogId: 2,
//           status: BidStatus.LOSS,
//           bidPrice: 280,
//           reason: '입찰가 미달',
//         },
//       ];

//       await repository.saveMany(testLogs);

//       const allLogs = await repository.getAll();

//       expect(allLogs).toHaveLength(2);
//       expect(allLogs[0].auctionId).toBe('auction-1');
//       expect(allLogs[1].auctionId).toBe('auction-2');
//     });

//     it('데이터가 없으면 빈 배열을 반환해야 함', async () => {
//       const allLogs = await repository.getAll();

//       expect(allLogs).toHaveLength(0);
//       expect(allLogs).toEqual([]);
//     });
//   });
// });

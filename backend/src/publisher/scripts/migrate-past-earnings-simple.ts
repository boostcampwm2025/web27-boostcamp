import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

/**
 * 과거 클릭 로그 기반 퍼블리셔 수익 마이그레이션 스크립트 (간소화 버전)
 *
 * 실행 방법:
 * npm run migrate:earnings
 *
 */

// .env 파일 로드
config({ path: join(__dirname, '../../../.env') });

async function migratePastEarnings() {
  console.log('🚀 퍼블리셔 과거 수익 마이그레이션 시작 (간소화 버전)...\n');

  // TypeORM DataSource 직접 생성 (NestJS 없이)
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'test_db',
    synchronize: false,
    logging: false,
  });

  try {
    // DB 연결
    await dataSource.initialize();
    console.log('✅ DB 연결 성공\n');

    // 0. 퍼블리셔들의 현재 balance를 0으로 초기화 (중복 방지)
    console.log('🔄 퍼블리셔 balance 초기화 중...');
    await dataSource.query(
      `UPDATE User SET balance = 0 WHERE role = 'PUBLISHER'`
    );
    console.log('✅ 퍼블리셔 balance 초기화 완료\n');

    // 1. 퍼블리셔별 총 수익 계산 (PUBLISHER 역할만)
    const earningsResult: Array<{
      userId: number;
      totalRevenue: string;
      clickCount: number;
    }> = await dataSource.query(`
      SELECT
        b.user_id AS userId,
        SUM(FLOOR(vl.cost * 0.8)) AS totalRevenue,
        COUNT(*) AS clickCount
      FROM ClickLog cl
      INNER JOIN ViewLog vl ON cl.view_id = vl.id
      INNER JOIN Blog b ON vl.blog_id = b.id
      INNER JOIN User u ON b.user_id = u.id
      WHERE u.role = 'PUBLISHER'
      GROUP BY b.user_id
      ORDER BY totalRevenue DESC
    `);

    if (earningsResult.length === 0) {
      console.log('⚠️  과거 클릭 로그가 없습니다. 마이그레이션 종료.');
      await dataSource.destroy();
      return;
    }

    console.log(
      `📊 총 ${earningsResult.length}명의 퍼블리셔 수익 데이터 발견\n`
    );

    // 2. 각 퍼블리셔의 balance 업데이트
    let totalUpdated = 0;
    let totalRevenue = 0;

    for (const row of earningsResult) {
      const { userId, totalRevenue: revenue, clickCount } = row;
      const revenueNum = parseInt(revenue, 10);

      // 현재 balance 조회
      const userResult: Array<{ balance: number }> = await dataSource.query(
        'SELECT balance FROM User WHERE id = ?',
        [userId]
      );

      if (userResult.length === 0) {
        console.log(`⚠️  userId=${userId} 사용자를 찾을 수 없습니다. 스킵.`);
        continue;
      }

      const currentBalance: number = userResult[0].balance;

      // balance 업데이트
      await dataSource.query(
        'UPDATE User SET balance = balance + ? WHERE id = ?',
        [revenueNum, userId]
      );

      console.log(
        `✅ userId=${userId}: balance ${currentBalance} → ${currentBalance + revenueNum} (+${revenueNum} 크레딧, 클릭 ${clickCount}회)`
      );

      totalUpdated++;
      totalRevenue += revenueNum;
    }

    console.log('\n🎉 마이그레이션 완료!');
    console.log(`   - 업데이트된 퍼블리셔: ${totalUpdated}명`);
    console.log(`   - 총 지급된 수익: ${totalRevenue.toLocaleString()} 크레딧`);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('\n✅ DB 연결 종료');
  }
}

migratePastEarnings().catch((error) => {
  console.error('스크립트 실행 실패:', error);
  process.exit(1);
});

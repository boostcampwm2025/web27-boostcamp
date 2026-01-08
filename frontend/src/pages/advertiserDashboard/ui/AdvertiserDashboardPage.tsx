import { StatsCardList } from '@/features/dashboardStats/ui/StatsCardList';
import { RealtimeBidsTable } from '@/features/realtimeBids';
import type { BidLog } from '@/features/realtimeBids';

export function AdvertiserDashboardPage() {
  // TODO: API 연동 후 실제 데이터로 교체
  const mockBids: BidLog[] = [
    {
      id: 123,
      auctionId: 'auction_uuid_123',
      timestamp: '2025-01-06T14:23:00Z',
      campaignId: 'camp_uuid_A',
      campaignTitle: '캠페인A',
      blogKey: 'blog_abc123xyz',
      blogName: '테크 블로그',
      blogDomain: 'tech-blog.com',
      bidAmount: 550,
      winAmount: 560,
      isWon: false,
      isHighIntent: true,
      behaviorScore: 80,
      insight: {
        type: 'blog_info',
        message: '블로그 CTR: 5.2%',
      },
    },
    {
      id: 124,
      auctionId: 'auction_uuid_124',
      timestamp: '2025-01-06T14:22:00Z',
      campaignId: 'camp_uuid_B',
      campaignTitle: '캠페인B',
      blogKey: 'blog_def456uvw',
      blogName: '파이썬 데일리',
      blogDomain: 'python-daily.com',
      bidAmount: 480,
      winAmount: 650,
      isWon: false,
      isHighIntent: true,
      behaviorScore: 75,
      insight: {
        type: 'bid_suggestion',
        message: '10원만 올리면 낙찰 가능',
      },
    },
    {
      id: 125,
      auctionId: 'auction_uuid_125',
      timestamp: '2025-01-06T14:21:00Z',
      campaignId: 'camp_uuid_C',
      campaignTitle: '캠페인C',
      blogKey: 'blog_abc123xyz',
      blogName: '테크 블로그',
      blogDomain: 'tech-blog.com',
      bidAmount: 520,
      winAmount: 520,
      isWon: true,
      isHighIntent: false,
      behaviorScore: 45,
      insight: {
        type: 'blog_info',
        message: '블로그 평점 4.8',
      },
    },
  ];

  return (
    <div className="min-h-screen px-48 py-8 bg-gray-100">
      <StatsCardList />
      <RealtimeBidsTable bids={mockBids} />
    </div>
  );
}

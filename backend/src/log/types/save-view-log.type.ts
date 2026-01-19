export type SaveViewLog = {
  id?: number;
  auctionId: string;
  campaignId: string;
  blogId: number;
  postUrl: string | null;
  cost: number;
  positionRatio: number | null;
  isHighIntent: boolean;
  behaviorScore: number | null;
  createdAt: Date;
};

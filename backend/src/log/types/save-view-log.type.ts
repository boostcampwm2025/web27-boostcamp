export type SaveViewLog = {
  auctionId: string;
  campaignId: string;
  blogId: number;
  postUrl: string;
  cost: number;
  positionRatio?: number;
  isHighIntent: boolean;
  behaviorScore: number;
  createdAt: Date;
};

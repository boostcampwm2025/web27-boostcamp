export type SaveClickLog = {
  viewId: number;
  createdAt?: Date;
};

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
  createdAt?: Date;
};

export type AggregateClickRaw = {
  campaignId: string;
  totalCost: string; // DB는 항상 string 반환
};

export type AggregateClick = {
  campaignId: string;
  totalCost: number;
};

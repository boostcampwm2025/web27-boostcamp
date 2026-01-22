export type CampaignCategory =
  | '언어'
  | 'FE'
  | 'BE'
  | 'DB'
  | '클라우드'
  | '모바일'
  | '기타';

export interface Tag {
  id: number;
  name: string;
  category: CampaignCategory;
}

export type FormStep = 1 | 2 | 3;

export interface CampaignContent {
  title: string;
  content: string;
  url: string;
  tags: Tag[];
  isHighIntent: boolean;
  image: string | null;
}

export interface BudgetSettings {
  dailyBudget: number;
  totalBudget: number;
  maxCpc: number;
}

export interface CampaignFormData {
  campaignContent: CampaignContent;
  budgetSettings: BudgetSettings;
}

export interface FormErrors {
  campaignContent?: Partial<Record<keyof CampaignContent, string>>;
  budgetSettings?: Partial<Record<keyof BudgetSettings, string>>;
}

// 광고 카테고리 (백엔드 AVAILABLE_TAGS 주석 참고해서 만들었어요!)
export type AdCategory =
  | '언어'
  | 'FE'
  | 'BE'
  | 'DB'
  | '클라우드'
  | '툴'
  | 'API'
  | '테스트'
  | '상태관리'
  | '모바일'
  | 'AI'
  | '기타';

export interface Tag {
  id: number;
  name: string;
}

export type FormStep = 1 | 2 | 3;

export interface AdContent {
  title: string;
  url: string;
  tags: Tag[];
  isHighIntent: boolean;
}

export interface BudgetSettings {
  dailyBudget: number;
  totalBudget: number;
  maxCpc: number;
}

// 전체 캠페인 폼 데이터
export interface CampaignFormData {
  adContent: AdContent;
  budgetSettings: BudgetSettings;
}

// 폼 유효성 검사 에러
export interface FormErrors {
  adContent?: Partial<Record<keyof AdContent, string>>;
  budgetSettings?: Partial<Record<keyof BudgetSettings, string>>;
}

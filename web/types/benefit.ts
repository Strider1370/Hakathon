// web/types/benefit.ts — 큐레이션 혜택/판정 결과 타입
// 데이터 원본: data/welfare/curated-benefits.json (서버사이드 로드)

export type ChangeType =
  | 'income_up'
  | 'asset_up'
  | 'household_change'
  | 'spouse_change'
  | 'moved'
  | 'disability_recheck';

export type RenewalType =
  | 'annual_review'
  | 'annual_reapply'
  | 'periodic_recheck'
  | 'none';

export interface BenefitSource {
  title: string;
  url: string;
  publisher: string;
  checkedAt: string;
}

export interface BenefitRenewal {
  type: RenewalType;
  renewWhen: string;
  cutoffTriggers: string[];
  note?: string;
}

export interface Benefit {
  id: string;
  name: string;
  agency: string;
  summary: string;
  amount: string;
  rules: { eligibility: string[]; slots: string[] };
  renewal: BenefitRenewal;
  deadline: string;
  documents: string[];
  applyChannel: string;
  applyHowOneLine: string;
  applyUrl: string;
  sources: BenefitSource[];
  confidence: { eligibility: string; renewal: string; documents: string };
  sampleData?: boolean;
}

// 판정 결과 카드
export type CardStatus = 'risk' | 'renew' | 'ok';

export interface ResultCard {
  benefitId: string;
  name: string;
  status: CardStatus;
  headline: string;
  reason?: string; // 매칭된 끊김 트리거 원문(근거)
  changeLabel?: string; // 어떤 변동이 걸렸는지
  renewWhen?: string;
  actions: string[];
  documents: string[];
  applyUrl: string;
  applyHowOneLine: string;
  agency: string;
  confidenceNote?: string; // 확인 안 된 정보일 때 정직 표기
}

export interface CheckInput {
  receivingBenefits: string[]; // benefit id 목록
  changes: ChangeType[];
}

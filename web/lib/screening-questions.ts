// web/lib/screening-questions.ts — 문진 질문 정의 + 타입 (클라이언트 안전: fs 의존 없음)
// 탭 UI와 AI(Realtime) 브리핑의 단일 출처. 분류 엔진은 lib/screening.ts.

export type Tri = 'yes' | 'no' | 'unknown';

export interface Profile {
  ageGte65?: Tri;
  living?: 'alone' | 'couple' | 'family' | 'unknown';
  basicLivelihood?: 'none' | '생계' | '의료' | '주거' | '교육' | 'unknown';
  basicPension?: Tri;
  working?: Tri;
  incomeWon?: number | null;
  assets?: 'low' | 'mid' | 'high' | 'unknown';
  disability?: 'none' | 'mild' | 'severe' | 'unknown';
  careNeed?: Tri;
  crisis?: Tri;
}

export interface ScreenQuestion {
  id: keyof Profile;
  ask: string;
  help?: string;
  options: { value: string; label: string }[];
  numeric?: boolean;
}

export const QUESTIONS: ScreenQuestion[] = [
  {
    id: 'ageGte65',
    ask: '어르신, 만 65세가 넘으셨나요?',
    options: [
      { value: 'yes', label: '예, 65세 이상이에요' },
      { value: 'no', label: '아니요, 아직이에요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'living',
    ask: '지금 누구와 함께 지내세요?',
    options: [
      { value: 'alone', label: '혼자 살아요' },
      { value: 'couple', label: '배우자와 둘이 살아요' },
      { value: 'family', label: '자녀·가족과 함께 살아요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'basicLivelihood',
    ask: '나라에서 생계비·의료비 같은 ‘기초생활’ 지원을 받고 계신가요?',
    help: '주민센터에서 매달 생계비를 받거나, 병원비를 거의 안 내시면 받고 계실 수 있어요.',
    options: [
      { value: '생계', label: '생계비를 받아요' },
      { value: '의료', label: '의료비 지원을 받아요' },
      { value: '주거', label: '주거비를 받아요' },
      { value: 'none', label: '안 받아요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'basicPension',
    ask: '매달 ‘기초연금’(노령연금)을 받고 계세요?',
    options: [
      { value: 'yes', label: '예, 받아요' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'working',
    ask: '요즘 일을 해서 버는 돈이 있으세요?',
    help: '대략 한 달에 얼마쯤인지 알려주시면 더 정확해요(몰라도 괜찮아요).',
    numeric: true,
    options: [
      { value: 'no', label: '버는 돈이 없어요' },
      { value: 'yes', label: '조금 있어요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'assets',
    ask: '사시는 집이나 모아둔 돈(재산)이 많은 편이세요?',
    options: [
      { value: 'low', label: '적은 편이에요' },
      { value: 'mid', label: '보통이에요' },
      { value: 'high', label: '많은 편이에요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'disability',
    ask: '등록된 장애가 있으세요?',
    options: [
      { value: 'none', label: '없어요' },
      { value: 'mild', label: '있어요(심하지 않음)' },
      { value: 'severe', label: '있어요(심한 정도)' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'careNeed',
    ask: '혼자서 식사·외출·씻기 같은 일상생활이 6개월 넘게 힘드세요?',
    options: [
      { value: 'yes', label: '예, 힘들어요' },
      { value: 'no', label: '아니요, 괜찮아요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
  {
    id: 'crisis',
    ask: '최근에 갑작스러운 일(실직·사망·질병·화재 등)로 생활이 많이 어려워지셨나요?',
    options: [
      { value: 'yes', label: '예, 그런 일이 있었어요' },
      { value: 'no', label: '아니요' },
      { value: 'unknown', label: '잘 모르겠어요' },
    ],
  },
];

// 분류 결과 타입(클라이언트도 사용)
export type Likelihood = 'receiving' | 'likely' | 'maybe' | 'unlikely' | 'need_info';

export interface ScreenResult {
  benefitId: string;
  name: string;
  likelihood: Likelihood;
  reason: string;
  applyUrl: string;
  agency: string;
}

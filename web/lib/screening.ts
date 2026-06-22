// web/lib/screening.ts — 결정론 분류 엔진 (서버 전용: 데이터 로드)
// 질문 정의·타입은 lib/screening-questions.ts (클라이언트 안전).
// 프로필 → 12개 정책 해당 '가능성'. 단정 금지(가능성+공식 확인). reference/01 §1.3.

import { loadBenefits } from '@/lib/benefits';
import type { Benefit } from '@/types/benefit';
import type { Profile, Likelihood, ScreenResult } from '@/lib/screening-questions';

const onBasicLivelihood = (p: Profile) =>
  !!p.basicLivelihood && p.basicLivelihood !== 'none' && p.basicLivelihood !== 'unknown';

const isElderly = (p: Profile) => p.ageGte65 === 'yes';

const LOW_INCOME = (p: Profile) =>
  onBasicLivelihood(p) ? true : p.assets === 'low' && p.working !== 'yes';

export function classify(p: Profile): ScreenResult[] {
  const benefits = loadBenefits();
  const get = (id: string) => benefits.find((b) => b.id === id) as Benefit | undefined;
  const out: ScreenResult[] = [];
  const push = (id: string, likelihood: Likelihood, reason: string) => {
    const b = get(id);
    if (b) out.push({ benefitId: id, name: b.name, likelihood, reason, applyUrl: b.applyUrl, agency: b.agency });
  };

  // 기초연금
  if (p.basicPension === 'yes')
    push('basic-pension', 'receiving', '이미 받고 계세요. 소득·가구 변동 시 끊길 수 있어 점검이 필요해요.');
  else if (isElderly(p) && p.assets !== 'high')
    push('basic-pension', 'likely', '65세 이상이고 재산이 많지 않으면 받으실 가능성이 높아요(소득하위 70%).');
  else if (isElderly(p)) push('basic-pension', 'maybe', '65세 이상이면 소득·재산에 따라 가능성이 있어요.');
  else if (p.ageGte65 === 'unknown') push('basic-pension', 'need_info', '나이 확인이 필요해요.');

  // 생계급여
  if (p.basicLivelihood === '생계') push('livelihood-benefit', 'receiving', '생계급여를 받고 계세요.');
  else if (LOW_INCOME(p) && p.assets === 'low')
    push('livelihood-benefit', 'maybe', '소득·재산이 적으면 해당될 수 있어요(중위 32% 이하).');

  // 의료급여
  if (p.basicLivelihood === '의료') push('medical-benefit', 'receiving', '의료급여를 받고 계세요.');
  else if (onBasicLivelihood(p) || (LOW_INCOME(p) && p.assets === 'low'))
    push('medical-benefit', 'maybe', '소득이 매우 낮으면 해당될 수 있어요(중위 40% 이하).');

  // 주거급여
  if (p.basicLivelihood === '주거') push('housing-benefit', 'receiving', '주거급여를 받고 계세요.');
  else if (LOW_INCOME(p))
    push('housing-benefit', 'maybe', '소득이 낮으면 임차료·수선비를 지원받을 수 있어요(중위 48% 이하).');

  // 차상위
  if (!onBasicLivelihood(p) && p.assets === 'low' && p.working !== 'yes')
    push('near-poor', 'maybe', '기초수급은 아니지만 소득이 낮으면 차상위에 해당될 수 있어요(중위 50% 이하).');

  // 장애인연금
  if (p.disability === 'severe') {
    if (LOW_INCOME(p)) push('disability-pension', 'likely', '심한 장애 + 소득 하위면 받으실 가능성이 높아요(18세 이상).');
    else push('disability-pension', 'maybe', '심한 장애가 있으면 소득에 따라 가능성이 있어요.');
  } else if (p.disability === 'unknown') push('disability-pension', 'need_info', '장애 등록 여부 확인이 필요해요.');

  // 에너지바우처
  if (onBasicLivelihood(p) && (isElderly(p) || (p.disability && p.disability !== 'none' && p.disability !== 'unknown')))
    push('energy-voucher', 'likely', '기초생활 수급 + 노인·장애 등 취약가구면 받으실 수 있어요. 신청기간을 놓치면 그 해 못 받아요.');
  else if (onBasicLivelihood(p)) push('energy-voucher', 'maybe', '기초생활 수급이면 가구 특성에 따라 가능성이 있어요.');

  // 근로장려금
  if (p.working === 'yes')
    push('eitc-ctc', 'maybe', '일해서 버는 소득이 있고 소득·재산이 기준 이하면 받으실 수 있어요(연 1회 신청).');

  // 긴급복지
  if (p.crisis === 'yes')
    push('emergency-welfare', 'likely', '갑작스러운 위기상황이면 긴급 생계·의료 지원을 신청하실 수 있어요.');

  // 노인일자리
  if (isElderly(p) && (p.basicPension === 'yes' || LOW_INCOME(p)))
    push('senior-jobs', 'maybe', '65세 이상(기초연금 수급자 우선)이면 공익활동형 일자리에 참여하실 수 있어요.');

  // 노인맞춤돌봄
  if (isElderly(p) && (onBasicLivelihood(p) || p.basicPension === 'yes') && (p.living === 'alone' || p.careNeed === 'yes'))
    push('senior-care', 'likely', '독거·돌봄이 필요한 취약 어르신이면 맞춤돌봄 대상이 될 수 있어요(장기요양과 중복 불가).');

  // 장기요양
  if (p.careNeed === 'yes' && (isElderly(p) || p.ageGte65 === 'unknown'))
    push('ltci', 'likely', '6개월 이상 일상생활이 힘들면 등급판정을 신청해 돌봄을 받으실 수 있어요.');

  const order: Record<Likelihood, number> = { receiving: 0, likely: 1, maybe: 2, need_info: 3, unlikely: 4 };
  return out.sort((a, b) => order[a.likelihood] - order[b.likelihood]);
}

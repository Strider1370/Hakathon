// web/lib/eligibility.ts — 결정론 판정 엔진 (신뢰 핵심)
//
// reference/01 §1.3: 고빈도·고위험 결정은 AI 자유분류가 아니라 키워드 매핑 테이블로 고정.
// 사용자의 '변동(change)'을 각 혜택의 renewal.cutoffTriggers(끊김 사유, 공식 출처에서 추출)에
// 키워드로 매칭해 끊김 위험을 판정한다. AI는 입력 해석(텍스트→change)만, 판정은 여기 코드가.

import type { Benefit, ChangeType, ResultCard, CheckInput } from '@/types/benefit';
import { loadBenefits } from '@/lib/benefits';

export const CHANGE_DEFS: Record<ChangeType, { label: string; keywords: string[] }> = {
  income_up: { label: '소득 증가·일 시작', keywords: ['소득', '근로', '사업소득', '취업', '일자리'] },
  asset_up: { label: '재산 증가', keywords: ['재산', '부동산', '금융재산', '소득환산', '부채'] },
  household_change: { label: '가구원 변동(합가·분가)', keywords: ['가구', '세대', '합가', '가구원', '부양'] },
  spouse_change: { label: '배우자 변동', keywords: ['배우자', '부부', '혼인', '이혼'] },
  moved: { label: '이사·해외 이주', keywords: ['이주', '거주', '전출', '국외', '주소'] },
  disability_recheck: { label: '장애 재심사', keywords: ['장애정도', '재심사', '등급'] },
};

function matchTrigger(
  b: Benefit,
  changes: ChangeType[],
): { trigger: string; change: ChangeType } | null {
  for (const c of changes) {
    const kws = CHANGE_DEFS[c].keywords;
    for (const t of b.renewal.cutoffTriggers) {
      if (kws.some((k) => t.includes(k))) return { trigger: t, change: c };
    }
  }
  return null;
}

function confidenceNote(b: Benefit): string | undefined {
  const c = b.confidence;
  const weak = [c.eligibility, c.renewal, c.documents].some((v) => v !== '확인');
  return weak
    ? '자격·갱신 정보 일부는 추정입니다. 최종 확인은 공식 페이지나 관할 기관에서 하세요.'
    : undefined;
}

/** 받는 혜택 + 변동 → 결과 카드(위험→갱신→유지 순 정렬). 순수 함수, 결정론적. */
export function evaluate(input: CheckInput): ResultCard[] {
  const all = loadBenefits();
  const cards: ResultCard[] = [];

  for (const id of input.receivingBenefits) {
    const b = all.find((x) => x.id === id);
    if (!b) continue;

    const hit = matchTrigger(b, input.changes);
    if (hit) {
      cards.push({
        benefitId: b.id,
        name: b.name,
        status: 'risk',
        headline: `${CHANGE_DEFS[hit.change].label} 때문에 끊길 수 있어요`,
        reason: hit.trigger,
        changeLabel: CHANGE_DEFS[hit.change].label,
        actions: [
          '변동 사항을 관할 읍·면·동(또는 담당기관)에 신고하세요 — 미신고로 과지급되면 환수·가산세 위험이 있어요.',
          '자격이 유지되는지 공식 채널에서 다시 확인하세요.',
        ],
        documents: b.documents,
        applyUrl: b.applyUrl,
        applyHowOneLine: b.applyHowOneLine,
        agency: b.agency,
        confidenceNote: confidenceNote(b),
      });
      continue;
    }

    if (b.renewal.type === 'annual_reapply') {
      cards.push({
        benefitId: b.id,
        name: b.name,
        status: 'renew',
        headline: '갱신·재신청 시기를 놓치면 끊겨요',
        renewWhen: b.renewal.renewWhen,
        actions: [`신청 기간 안에 다시 신청하세요 (${b.renewal.renewWhen}).`],
        documents: b.documents,
        applyUrl: b.applyUrl,
        applyHowOneLine: b.applyHowOneLine,
        agency: b.agency,
        confidenceNote: confidenceNote(b),
      });
      continue;
    }

    cards.push({
      benefitId: b.id,
      name: b.name,
      status: 'ok',
      headline: '지금 변동으로 끊길 위험은 낮아요',
      actions: [],
      documents: [],
      applyUrl: b.applyUrl,
      applyHowOneLine: b.applyHowOneLine,
      agency: b.agency,
    });
  }

  const order: Record<string, number> = { risk: 0, renew: 1, ok: 2 };
  return cards.sort((a, b) => order[a.status] - order[b.status]);
}

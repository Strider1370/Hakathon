// web/lib/verified-persona.ts — 본인인증(공공마이데이터 연계) 목업 결과 (클라이언트 안전)
//
// ⚠️ 시연용 목업. 실개인정보 아님(가상 페르소나). 실제 서비스는 본인인증 동의 후
// 행정안전부 공공마이데이터로 소득·재산을 불러온다. manifest: mocked.

export interface VerifiedDetail {
  benefitId: string;
  name: string;
  incomeLine: string; // 정확한 소득인정액 vs 기준
  margin: string; // 여유/초과 폭
  risk: string; // 변동 반영 시 끊김 설명
  recalcDate?: string; // 다음 재산정/확인 예정일 (D-day 계산용)
}

export const VERIFIED_PERSONA = {
  name: '김순자',
  age: 75,
  household: '아들과 합가(2인 → 가구원 추가)',
  incomeRecognizedWon: 2_380_000, // 목업 연계로 산정된 소득인정액
  details: [
    {
      benefitId: 'basic-pension',
      name: '기초연금',
      incomeLine: '소득인정액 238만원 / 선정기준 247만원(단독가구)',
      margin: '현재 여유 9만원',
      risk: '새로 생긴 근로소득이 반영되면 12월 정기 재산정에서 선정기준을 초과할 것으로 예상돼요.',
      recalcDate: '2026-12-12',
    },
    {
      benefitId: 'medical-benefit',
      name: '의료급여',
      incomeLine: '소득인정액 238만원 / 2종 기준(중위 40%)',
      margin: '가구원 합산 시 기준 변동',
      risk: '아들과 합가로 가구 소득·재산이 합산되면 자격 재검토 대상이 될 수 있어요.',
      recalcDate: '2026-12-12',
    },
  ] as VerifiedDetail[],
};

export function ddayTo(dateISO: string): number | null {
  const target = new Date(dateISO + 'T00:00:00');
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

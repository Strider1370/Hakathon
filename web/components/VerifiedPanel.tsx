'use client';

import { VERIFIED_PERSONA, ddayTo } from '@/lib/verified-persona';

// 본인인증(목업 연계) 후: 추정 → 정확. 정확한 소득인정액·기준·D-day 표시.
export function VerifiedPanel() {
  const p = VERIFIED_PERSONA;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-label-s font-bold text-white">
          ✓ 본인인증 연계 · 정확
        </span>
        <span className="text-body-s text-gray-60">
          {p.name}님 · 소득인정액 {(p.incomeRecognizedWon / 10000).toLocaleString()}만원
        </span>
      </div>

      {p.details.map((d) => {
        const dday = d.recalcDate ? ddayTo(d.recalcDate) : null;
        return (
          <article key={d.benefitId} className="rounded-krds-lg border-2 border-gray-30 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-heading-s-mobile font-bold text-gray-90 md:text-heading-s">{d.name}</h3>
              {dday != null && (
                <span className="shrink-0 rounded-full bg-danger-50 px-2.5 py-0.5 text-label-s font-bold text-white">
                  D-{dday}
                </span>
              )}
            </div>
            <p className="mt-2 rounded-krds bg-gray-5 px-3 py-2 text-body-m text-gray-80">
              <b>{d.incomeLine}</b> · {d.margin}
            </p>
            <p className="mt-2 text-body-m text-danger-60">{d.risk}</p>
            {d.recalcDate && (
              <p className="mt-1 text-detail-m text-gray-50">다음 정기 재산정: {d.recalcDate}</p>
            )}
          </article>
        );
      })}

      <p className="text-detail-m text-gray-40">
        ※ 공공마이데이터 연계를 가정한 목업 결과입니다(가상 인물). 실제 자격·금액은 주민센터·관할 기관에서
        확정됩니다.
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { ResultCard } from '@/types/benefit';
import { ResultCardView } from '@/components/ResultCardView';

// 변동 유형(어르신 친화 문구). id는 lib/eligibility.ts CHANGE_DEFS 키와 일치.
const CHANGES: { id: string; label: string }[] = [
  { id: 'income_up', label: '소득이 늘었어요 / 일을 시작했어요' },
  { id: 'household_change', label: '같이 사는 식구가 바뀌었어요 (합가·분가)' },
  { id: 'asset_up', label: '재산이 늘었어요 (집·예금 등)' },
  { id: 'spouse_change', label: '배우자가 바뀌었어요 (결혼·이혼·사별)' },
  { id: 'moved', label: '이사했어요 / 해외로 나가요' },
  { id: 'disability_recheck', label: '장애 정도 재심사가 있어요' },
];

export function CheckForm({
  benefits,
  initialPicked = [],
}: {
  benefits: { id: string; name: string }[];
  initialPicked?: string[];
}) {
  const [picked, setPicked] = useState<Set<string>>(new Set(initialPicked));
  const [changes, setChanges] = useState<Set<string>>(new Set());
  const [cards, setCards] = useState<ResultCard[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  async function onCheck() {
    setLoading(true);
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          receivingBenefits: [...picked],
          changes: [...changes],
        }),
      });
      const data = await res.json();
      setCards(data.cards ?? []);
    } finally {
      setLoading(false);
    }
  }

  const riskCount = cards?.filter((c) => c.status === 'risk').length ?? 0;

  return (
    <div className="space-y-8">
      {/* 1. 받는 혜택 */}
      <fieldset>
        <legend className="text-heading-s font-bold text-gray-90">
          1. 지금 받고 있는 혜택을 골라주세요
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
          {benefits.map((b) => {
            const on = picked.has(b.id);
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(picked, setPicked, b.id)}
                className={`rounded-krds border px-3 py-3 text-left text-body-m transition ${
                  on
                    ? 'border-primary-50 bg-primary-5 font-bold text-primary-60'
                    : 'border-gray-30 bg-white text-gray-80 hover:border-gray-50'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 2. 최근 변동 */}
      <fieldset>
        <legend className="text-heading-s font-bold text-gray-90">
          2. 최근에 달라진 점이 있나요?
        </legend>
        <div className="mt-3 flex flex-col gap-2">
          {CHANGES.map((c) => {
            const on = changes.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(changes, setChanges, c.id)}
                className={`rounded-krds border px-4 py-3 text-left text-body-l transition ${
                  on
                    ? 'border-danger-50 bg-danger-5 font-bold text-danger-60'
                    : 'border-gray-30 bg-white text-gray-80 hover:border-gray-50'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onCheck}
        disabled={picked.size === 0 || loading}
        className="w-full rounded-krds bg-primary-50 px-6 py-4 text-heading-s font-bold text-white transition hover:bg-primary-60 disabled:bg-gray-30 disabled:text-gray-50"
      >
        {loading ? '점검하는 중…' : '내 혜택 점검하기'}
      </button>

      {/* 결과 */}
      {cards && (
        <section aria-live="polite" className="space-y-4">
          <h2 className="text-heading-m font-bold text-gray-90">
            점검 결과
            {riskCount > 0 && (
              <span className="ml-2 text-danger-60">· 끊길 위험 {riskCount}건</span>
            )}
          </h2>
          {cards.length === 0 && (
            <p className="text-body-m text-gray-60">받는 혜택을 먼저 골라주세요.</p>
          )}
          {cards.map((c) => (
            <ResultCardView key={c.benefitId} card={c} />
          ))}
        </section>
      )}
    </div>
  );
}

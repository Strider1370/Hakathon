'use client';

import { useState } from 'react';
import type { ResultCard } from '@/types/benefit';
import { ResultCardView } from '@/components/ResultCardView';

// 변동을 한 문항씩 묻는 가이드 문진(예/아니요). value(yes)면 해당 ChangeType 적용.
const CHANGE_QUESTIONS: { change: string; ask: string; help?: string }[] = [
  { change: 'income_up', ask: '최근에 일을 시작했거나, 버는 돈이 늘었나요?', help: '아르바이트·근로·사업 소득이 새로 생긴 경우도 포함이에요.' },
  { change: 'household_change', ask: '함께 사는 식구가 바뀌었나요?', help: '자녀와 합치거나, 따로 살게 되거나, 사별하신 경우요.' },
  { change: 'asset_up', ask: '집·예금 같은 재산이 늘었나요?', help: '집을 사거나, 보험금·퇴직금 등 목돈이 생긴 경우요.' },
  { change: 'spouse_change', ask: '결혼·이혼·사별 등 배우자에 변화가 있었나요?' },
  { change: 'moved', ask: '이사를 했거나, 해외로 나갈 계획이 있나요?' },
  { change: 'disability_recheck', ask: '장애 정도 재심사 일정이 있나요?' },
];

export function ChangeFlow({
  receivingBenefits,
  onResults,
}: {
  receivingBenefits: string[];
  onResults?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [changes, setChanges] = useState<string[]>([]);
  const [cards, setCards] = useState<ResultCard[] | null>(null);
  const [loading, setLoading] = useState(false);

  const total = CHANGE_QUESTIONS.length;
  const q = CHANGE_QUESTIONS[step];

  async function answer(yes: boolean) {
    const nextChanges = yes ? [...changes, q.change] : changes;
    setChanges(nextChanges);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      await submit(nextChanges);
    }
  }

  async function submit(sel: string[]) {
    setLoading(true);
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ receivingBenefits, changes: sel }),
      });
      const data = await res.json();
      setCards(data.cards ?? []);
      onResults?.();
    } finally {
      setLoading(false);
    }
  }

  if (cards) {
    const riskCount = cards.filter((c) => c.status === 'risk').length;
    return (
      <section className="space-y-4" aria-live="polite">
        <div className="rounded-krds-lg bg-primary-5 px-4 py-4">
          <h2 className="text-heading-m font-bold text-gray-90">
            끊김 점검 결과
            {riskCount > 0 && <span className="ml-2 text-danger-60">· 끊길 위험 {riskCount}건</span>}
          </h2>
          <p className="mt-1 text-body-m text-gray-70">
            받고 계신 혜택에 말씀하신 변동을 대입해 코드가 판정했어요.
          </p>
        </div>
        {cards.length === 0 && (
          <p className="text-body-m text-gray-60">먼저 받는 혜택을 확인해 주세요.</p>
        )}
        {cards.map((c) => (
          <ResultCardView key={c.benefitId} card={c} />
        ))}
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4">
        <div className="h-2 w-full rounded-full bg-gray-20">
          <div className="h-2 rounded-full bg-primary-50 transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-label-m text-gray-60">달라진 점 확인 · {step + 1} / {total}</p>
      </div>

      <div className="rounded-krds-lg border border-gray-30 bg-white p-5">
        <h2 className="text-heading-m font-bold leading-snug text-gray-90">{q.ask}</h2>
        {q.help && <p className="mt-2 text-body-m text-gray-60">{q.help}</p>}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => answer(true)}
            className="rounded-krds border border-danger-40 bg-white px-4 py-4 text-left text-body-l font-bold text-danger-60 transition hover:bg-danger-5 disabled:opacity-50"
          >
            예, 그런 변화가 있었어요
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => answer(false)}
            className="rounded-krds border border-gray-30 bg-white px-4 py-4 text-left text-body-l text-gray-80 transition hover:border-gray-50 disabled:opacity-50"
          >
            아니요, 없었어요
          </button>
        </div>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="mt-4 text-label-m text-gray-50 underline">
            ← 이전 질문
          </button>
        )}
      </div>
      {loading && <p className="mt-4 text-center text-body-m text-gray-60">끊길 위험을 점검하고 있어요…</p>}
    </div>
  );
}

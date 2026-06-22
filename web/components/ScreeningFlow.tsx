'use client';

import { useRef, useState } from 'react';
import { QUESTIONS, type Profile, type ScreenResult, type Likelihood } from '@/lib/screening-questions';
import { VoiceMic } from '@/components/VoiceMic';

const QLABEL: Record<string, string> = Object.fromEntries(
  QUESTIONS.flatMap((q) => q.options.map((o) => [`${q.id}:${o.value}`, `${q.ask.slice(0, 10)}… ${o.label}`])),
);

const LIKELIHOOD_GROUP: Record<Likelihood, { label: string; tag: string; order: number }> = {
  receiving: { label: '이미 받고 계신 것 같아요', tag: 'bg-primary-50 text-white', order: 0 },
  likely: { label: '받으실 수 있을 가능성이 높아요', tag: 'bg-success-50 text-white', order: 1 },
  maybe: { label: '해당될 수 있어요 (확인 필요)', tag: 'bg-warning-50 text-gray-90', order: 2 },
  need_info: { label: '정보가 더 필요해요', tag: 'bg-gray-40 text-white', order: 3 },
  unlikely: { label: '해당 가능성이 낮아요', tag: 'bg-gray-30 text-gray-70', order: 4 },
};

export function ScreeningFlow({
  onContinue,
  onResults,
}: {
  onContinue: (receivingIds: string[]) => void;
  onResults?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({});
  const [income, setIncome] = useState('');
  const [results, setResults] = useState<ScreenResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef<Profile>({});

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;

  async function answer(value: string) {
    const next: Profile = { ...profile, [q.id]: value };
    if (q.numeric && value === 'yes' && income) next.incomeWon = Number(income.replace(/[^0-9]/g, '')) || null;
    profileRef.current = next;
    setProfile(next);
    setIncome('');
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      await submit(next);
    }
  }

  // 음성 도우미가 채운 답을 같은 프로필에 반영(판정은 동일하게 코드가).
  function applyVoice(id: string, value: string) {
    profileRef.current = { ...profileRef.current, [id]: value };
    setProfile({ ...profileRef.current });
  }
  function voiceFinish() {
    submit(profileRef.current);
  }

  async function submit(p: Profile) {
    setLoading(true);
    try {
      const res = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      onResults?.();
    } finally {
      setLoading(false);
    }
  }

  // ── 결과 화면 ──
  if (results) {
    const receivingIds = results.filter((r) => r.likelihood === 'receiving').map((r) => r.benefitId);
    const groups = Object.entries(LIKELIHOOD_GROUP)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([k, meta]) => ({ key: k as Likelihood, meta, items: results.filter((r) => r.likelihood === k) }))
      .filter((g) => g.items.length > 0);

    return (
      <div className="space-y-6">
        <div className="rounded-krds-lg bg-primary-5 px-4 py-5">
          <h2 className="text-heading-s-mobile font-bold text-gray-90 md:text-heading-m">점검 결과, 이런 혜택이 보여요</h2>
          <p className="mt-1 text-body-m text-gray-70">
            대화로 답해주신 내용을 바탕으로 코드가 골라낸 결과예요. 최종 자격은 공식 페이지·주민센터에서
            확인하세요.
          </p>
        </div>

        {groups.map((g) => (
          <section key={g.key} className="space-y-2">
            <h3 className="flex items-center gap-2 text-heading-s-mobile font-bold text-gray-90 md:text-heading-s">
              <span className={`rounded-full px-2.5 py-0.5 text-label-s font-bold ${g.meta.tag}`}>
                {g.items.length}
              </span>
              {g.meta.label}
            </h3>
            {g.items.map((r) => (
              <article key={r.benefitId} className="rounded-krds border border-gray-30 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-body-l font-bold text-gray-90">{r.name}</span>
                  <a
                    href={r.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-label-m font-bold text-primary-60 underline"
                  >
                    공식 안내 →
                  </a>
                </div>
                <p className="mt-1 text-body-s text-gray-70">{r.reason}</p>
              </article>
            ))}
          </section>
        ))}

        <div className="rounded-krds-lg border-2 border-danger-30 bg-danger-5 p-4">
          <p className="text-body-m text-gray-80">
            받고 계신 혜택은 <b>소득·가구가 바뀌면 끊길</b> 수 있어요. 이어서 끊길 위험을 점검해 보세요.
          </p>
          <button
            type="button"
            onClick={() => onContinue(receivingIds)}
            className="mt-3 w-full rounded-krds bg-danger-50 px-6 py-4 text-body-l font-bold text-white hover:bg-danger-60"
          >
            이어서 ‘끊길 위험’ 점검하기 →
          </button>
        </div>
      </div>
    );
  }

  // ── 질문 화면 ──
  const captured = Object.entries(profile).filter(([k]) => k !== 'incomeWon');
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <VoiceMic onAnswer={applyVoice} onFinish={voiceFinish} />

      {captured.length > 0 && (
        <div className="rounded-krds border border-gray-20 bg-white px-3 py-2">
          <p className="text-label-m font-bold text-gray-70">들은 내용 {captured.length}개</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {captured.map(([k, v]) => (
              <li key={k} className="rounded-full bg-white px-2.5 py-1 text-detail-m text-gray-70">
                {QLABEL[`${k}:${v}`] ?? `${k}: ${v}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center text-label-m text-gray-40">— 또는 직접 눌러서 답하기 —</div>

      <div>
        <div className="mb-4">
          <div className="h-2 w-full rounded-full bg-gray-20">
            <div
              className="h-2 rounded-full bg-primary-50 transition-all"
              style={{ width: `${((step + (loading ? 1 : 0)) / total) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-label-m text-gray-60">
            {step + 1} / {total}
          </p>
        </div>

      <div className="rounded-krds-lg border border-gray-30 bg-white p-5">
        <h2 className="text-heading-s-mobile font-bold leading-snug text-gray-90 md:text-heading-m">{q.ask}</h2>
        {q.help && <p className="mt-2 text-body-m text-gray-60">{q.help}</p>}

        {q.numeric && (
          <div className="mt-4">
            <label className="text-label-m text-gray-70">한 달 버는 돈 (대략, 원) — 몰라도 괜찮아요</label>
            <input
              inputMode="numeric"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="예: 500000"
              className="mt-1 w-full rounded-krds border border-gray-30 px-3 py-3 text-body-l"
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              disabled={loading}
              onClick={() => answer(o.value)}
              className="rounded-krds border border-gray-30 bg-white px-4 py-4 text-left text-body-l text-gray-90 transition hover:border-primary-50 hover:bg-primary-5 disabled:opacity-50"
            >
              {o.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="mt-4 text-label-m text-gray-50 underline"
          >
            ← 이전 질문
          </button>
        )}
        </div>
      </div>
      {loading && <p className="mt-4 text-center text-body-m text-gray-60">결과를 정리하고 있어요…</p>}
    </div>
  );
}

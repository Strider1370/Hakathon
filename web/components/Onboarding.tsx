'use client';

import { useState } from 'react';
import { ScreeningFlow } from '@/components/ScreeningFlow';
import { CheckForm } from '@/components/CheckForm';

// 두 단계 흐름: ① 자격 문진(첫 실행) → ② 끊김 점검(문진에서 받는 혜택을 이어받음).
export function Onboarding({ benefits }: { benefits: { id: string; name: string }[] }) {
  const [phase, setPhase] = useState<'screen' | 'check'>('screen');
  const [prefill, setPrefill] = useState<string[]>([]);

  if (phase === 'check') {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setPhase('screen')}
          className="text-label-m text-gray-50 underline"
        >
          ← 처음 문진으로
        </button>
        <CheckForm benefits={benefits} initialPicked={prefill} />
      </div>
    );
  }

  return (
    <ScreeningFlow
      onContinue={(ids) => {
        setPrefill(ids);
        setPhase('check');
      }}
    />
  );
}

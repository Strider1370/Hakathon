'use client';

import { useState } from 'react';
import { ScreeningFlow } from '@/components/ScreeningFlow';
import { ChangeFlow } from '@/components/ChangeFlow';

// 두 단계 흐름: ① 자격 문진(첫 실행) → ② 변동 문진(받는 혜택을 이어받아 끊길 위험 점검).
export function Onboarding({ benefits: _benefits }: { benefits: { id: string; name: string }[] }) {
  const [phase, setPhase] = useState<'screen' | 'check'>('screen');
  const [receiving, setReceiving] = useState<string[]>([]);

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
        <ChangeFlow receivingBenefits={receiving} />
      </div>
    );
  }

  return (
    <ScreeningFlow
      onContinue={(ids) => {
        setReceiving(ids);
        setPhase('check');
      }}
    />
  );
}

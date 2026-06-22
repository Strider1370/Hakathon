'use client';

import { useState } from 'react';
import { ScreeningFlow } from '@/components/ScreeningFlow';
import { ChangeFlow } from '@/components/ChangeFlow';
import { AuthGate } from '@/components/AuthGate';
import { VerifiedPanel } from '@/components/VerifiedPanel';

// 두 단계 흐름: ① 자격 문진(첫 실행) → ② 변동 문진(받는 혜택을 이어받아 끊길 위험 점검).
// 하단에 본인인증(공공마이데이터 목업) → 추정→정확 패널.
export function Onboarding({ benefits: _benefits }: { benefits: { id: string; name: string }[] }) {
  const [phase, setPhase] = useState<'screen' | 'check'>('screen');
  const [receiving, setReceiving] = useState<string[]>([]);
  const [started, setStarted] = useState(false); // 결과가 한 번이라도 나왔는지
  const [verified, setVerified] = useState(false);

  const verifyBlock = started ? (
    <div className="mt-8">
      {verified ? <VerifiedPanel /> : <AuthGate onVerified={() => setVerified(true)} />}
    </div>
  ) : null;

  if (phase === 'check') {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setPhase('screen')} className="text-label-m text-gray-50 underline">
          ← 처음 문진으로
        </button>
        <ChangeFlow receivingBenefits={receiving} onResults={() => setStarted(true)} />
        {verifyBlock}
      </div>
    );
  }

  return (
    <>
      <ScreeningFlow
        onResults={() => setStarted(true)}
        onContinue={(ids) => {
          setReceiving(ids);
          setPhase('check');
        }}
      />
      {verifyBlock}
    </>
  );
}

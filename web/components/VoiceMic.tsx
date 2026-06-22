'use client';

import { useRef, useState } from 'react';
import { z } from 'zod';
import { QUESTIONS } from '@/lib/screening-questions';

// 음성 문진. AI가 9문항을 한 번에 하나씩 묻고, strict 함수호출(set_answer)로 슬롯을 채운다.
// 판정·계산은 절대 AI가 하지 않음(코드가 함). 키 없거나 실패 시 폴백(탭 문진).
export function VoiceMic({
  onAnswer,
  onFinish,
}: {
  onAnswer: (id: string, value: string) => void;
  onFinish: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const sessionRef = useRef<{ close?: () => void } | null>(null);

  async function start() {
    setStatus('connecting');
    setMsg('');
    try {
      const tok = await fetch('/api/realtime-token', { method: 'POST' }).then((r) => r.json());
      if (!tok.value) {
        setStatus('error');
        setMsg('음성 키가 없어요. 아래에서 직접 눌러 답해 주세요.');
        return;
      }

      const { RealtimeAgent, RealtimeSession, tool } = await import('@openai/agents-realtime');

      const ids = QUESTIONS.map((q) => q.id) as [string, ...string[]];
      const setAnswer = tool({
        name: 'set_answer',
        description: '사용자의 답을 해당 질문 슬롯에 저장한다. 반드시 허용된 value 중 하나로 매핑.',
        parameters: z.object({
          questionId: z.enum(ids),
          value: z.string(),
        }),
        execute: async ({ questionId, value }: { questionId: string; value: string }) => {
          onAnswer(questionId, value);
          return '저장했어요';
        },
      });
      const finish = tool({
        name: 'finish_screening',
        description: '9개 질문에 모두 답을 받았으면 호출해 결과 점검을 시작한다.',
        parameters: z.object({}),
        execute: async () => {
          onFinish();
          return '점검을 시작할게요';
        },
      });

      const briefing = QUESTIONS.map(
        (q, i) => `${i + 1}. [${q.id}] "${q.ask}" — 허용값: ${q.options.map((o) => o.value).join(' | ')}`,
      ).join('\n');

      const agent = new RealtimeAgent({
        name: '복지 점검 도우미',
        instructions:
          `당신은 어르신의 복지 자격을 확인하는 따뜻하고 또박또박한 상담원입니다. ` +
          `아래 9개 질문을 '한 번에 하나씩' 천천히, 쉬운 말로 여쭙니다. ` +
          `어르신이 답하면 그 뜻을 '허용값' 중 하나로 골라 set_answer를 호출하고, 들은 내용을 한 번 되읽어 확인한 뒤 다음 질문으로 넘어갑니다. ` +
          `머뭇거려도 재촉하지 마세요. '잘 모르겠다'고 하면 value를 'unknown'으로 저장하고 넘어갑니다. ` +
          `9개를 다 받으면 finish_screening을 호출하세요. ` +
          `자격 여부나 금액은 절대 직접 말하지 마세요 — 판정은 코드가 합니다. 당신은 질문과 확인만 합니다.\n\n질문 목록:\n${briefing}`,
        tools: [setAnswer, finish],
      });

      const session = new RealtimeSession(agent, { model: tok.model || 'gpt-realtime' });
      sessionRef.current = session as unknown as { close?: () => void };
      await session.connect({ apiKey: tok.value });
      setStatus('live');
    } catch {
      setStatus('error');
      setMsg('음성 연결에 실패했어요. 아래에서 직접 눌러 답해 주세요.');
    }
  }

  function stop() {
    try {
      sessionRef.current?.close?.();
    } catch {
      /* noop */
    }
    sessionRef.current = null;
    setStatus('idle');
  }

  return (
    <div className="rounded-krds-lg border-2 border-primary-30 bg-primary-5 p-4">
      {status === 'idle' && (
        <>
          <p className="text-body-l font-bold text-gray-90">🎤 말로 답하기</p>
          <p className="mt-1 text-body-m text-gray-70">
            버튼을 누르고 편하게 말씀하시면, 도우미가 하나씩 여쭤보고 대신 채워드려요.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-3 w-full rounded-krds bg-primary-50 px-6 py-4 text-body-l font-bold text-white hover:bg-primary-60"
          >
            🎤 음성으로 시작하기
          </button>
        </>
      )}
      {status === 'connecting' && <p className="py-2 text-body-l text-gray-70">연결 중이에요…</p>}
      {status === 'live' && (
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-body-l font-bold text-primary-60">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-danger-50" /> 듣고 있어요 — 말씀하세요
          </p>
          <button type="button" onClick={stop} className="rounded-krds border border-gray-40 px-3 py-2 text-label-m text-gray-70">
            그만하기
          </button>
        </div>
      )}
      {status === 'error' && <p className="py-1 text-body-m text-danger-60">{msg}</p>}
    </div>
  );
}

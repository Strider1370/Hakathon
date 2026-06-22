'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { QUESTIONS } from '@/lib/screening-questions';

type ChatMsg = { id: string; role: string; text: string };

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
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const sessionRef = useRef<{ close?: () => void } | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // 새 말풍선이 오면 '말풍선 박스 내부'만 아래로 스크롤(페이지는 안 움직이게).
  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  // 언마운트(결과 화면으로 전환 등) 시 음성 세션·마이크 확실히 종료.
  useEffect(() => {
    return () => {
      try {
        sessionRef.current?.close?.();
      } catch {
        /* noop */
      }
      sessionRef.current = null;
    };
  }, []);

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
          `대화가 시작되면(연결되면) 먼저 "안녕하세요, 받으시는 복지가 끊기지 않게 몇 가지 여쭤볼게요"처럼 짧게 인사한 뒤 곧바로 1번 질문을 음성으로 여쭙니다. ` +
          `아래 9개 질문을 '한 번에 하나씩' 천천히, 쉬운 말로 여쭙니다. ` +
          `어르신이 답하면 그 뜻을 '허용값' 중 하나로 골라 set_answer를 호출하고, 들은 내용을 한 번 되읽어 확인한 뒤 다음 질문으로 넘어갑니다. ` +
          `머뭇거려도 재촉하지 마세요. '잘 모르겠다'고 하면 value를 'unknown'으로 저장하고 넘어갑니다. ` +
          `9개를 다 받으면 finish_screening을 호출하세요. ` +
          `자격 여부나 금액은 절대 직접 말하지 마세요 — 판정은 코드가 합니다. 당신은 질문과 확인만 합니다.\n\n질문 목록:\n${briefing}`,
        tools: [setAnswer, finish],
      });

      const session = new RealtimeSession(agent, { model: tok.model || 'gpt-realtime-2' });
      sessionRef.current = session as unknown as { close?: () => void };

      // 대화 이력(음성 전사)을 말풍선으로 — 도우미·사용자 발화를 텍스트로 표시.
      const sess = session as unknown as { on: (e: string, cb: (h: unknown) => void) => void };
      sess.on('history_updated', (history: unknown) => {
        const items = Array.isArray(history) ? history : [];
        const msgs: ChatMsg[] = items
          .filter((it) => (it as { type?: string }).type === 'message')
          .map((it) => {
            const m = it as { itemId?: string; role?: string; content?: { transcript?: string; text?: string }[] };
            const text = (m.content ?? [])
              .map((c) => c.transcript ?? c.text ?? '')
              .join(' ')
              .trim();
            return { id: m.itemId ?? String(Math.random()), role: m.role ?? 'assistant', text };
          })
          .filter((m) => m.text);
        setChat(msgs);
      });

      await session.connect({ apiKey: tok.value });
      setStatus('live');

      // 연결 직후 AI가 먼저 인사+첫 질문을 꺼내도록 트리거(사용자 발화를 기다리지 않게).
      try {
        const transport = (session as unknown as { transport?: { sendEvent?: (e: unknown) => void } }).transport;
        setTimeout(() => transport?.sendEvent?.({ type: 'response.create' }), 400);
      } catch {
        /* noop */
      }
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
    setChat([]);
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

      {chat.length > 0 && (
        <div ref={chatBoxRef} className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-krds bg-white p-3">
          {chat.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-wrap rounded-krds rounded-tr-none bg-[#FEE500] px-3 py-2 text-body-m text-gray-90">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex flex-col items-start">
                <span className="mb-0.5 ml-1 text-detail-m text-gray-50">복지 점검 도우미</span>
                <p className="max-w-[80%] whitespace-pre-wrap rounded-krds rounded-tl-none border border-gray-20 bg-gray-5 px-3 py-2 text-body-m text-gray-90">
                  {m.text}
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

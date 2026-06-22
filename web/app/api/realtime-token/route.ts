import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Realtime 임시키(ephemeral) 발급. 서버의 OPENAI_API_KEY로 1분짜리 client_secret을 만들어
// 클라가 WebRTC로 직접 연결하게 한다(진짜 키는 클라에 노출 안 됨). 키 없으면 {value:null} → 폴백.
// 모델은 OPENAI_REALTIME_MODEL(기본 gpt-realtime). reference/06: ID는 배포 직전 재확인.
export async function POST() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ value: null, provider: 'fallback' });

  // GPT-5급 추론 realtime(2026-05). 전사는 신규 스트리밍 STT. env로 교체 가능.
  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime-2';
  const transcribeModel = process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-realtime-whisper';
  try {
    const res = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model,
          audio: {
            input: {
              transcription: { model: transcribeModel, language: 'ko' }, // 사용자 음성→텍스트(한국어)
              turn_detection: { type: 'semantic_vad', eagerness: 'low' }, // 어르신: 머뭇거려도 안 끊김
              noise_reduction: { type: 'near_field' }, // 폰·헤드셋 잡음 감소
            },
            output: { voice: 'marin' },
          },
        },
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ value: null, error: detail.slice(0, 500) }, { status: 200 });
    }
    const data = await res.json();
    // GA 응답: { value: 'ek_...', expires_at, session: {...} }
    return NextResponse.json({
      value: data?.value ?? data?.client_secret?.value ?? null,
      expires_at: data?.expires_at ?? null,
      model,
    });
  } catch (e) {
    return NextResponse.json({ value: null, error: String(e) }, { status: 200 });
  }
}

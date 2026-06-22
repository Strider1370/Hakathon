'use client';

import { useState } from 'react';

// 본인인증 → 공공마이데이터 연계 (전부 목업). 성공 시 onVerified().
export function AuthGate({ onVerified }: { onVerified: () => void }) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function pick() {
    setLoading(true);
    // 공공마이데이터 연계 시뮬레이션
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setModal(false);
    onVerified();
  }

  return (
    <>
      <div className="rounded-krds-lg border-2 border-primary-30 bg-primary-5 p-4">
        <p className="text-body-l font-bold text-gray-90">🔒 정확한 결과가 궁금하세요?</p>
        <p className="mt-1 text-body-m text-gray-70">
          지금은 답해주신 내용으로 <b>추정</b>한 결과예요. 본인인증을 하면 실제 소득·재산을 연계해
          <b> 정확한 자격과 끊길 날짜(D-day)</b>까지 알려드려요.
        </p>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="mt-3 w-full rounded-krds bg-primary-50 px-6 py-4 text-heading-s font-bold text-white hover:bg-primary-60"
        >
          본인인증하고 정확히 보기 →
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-krds-lg bg-white p-5">
            <h3 className="text-heading-s font-bold text-gray-90">본인인증</h3>
            <p className="mt-1 text-body-s text-gray-60">
              간편인증으로 본인 확인 후, 동의하신 소득·재산 정보를 공공마이데이터로 불러옵니다.
            </p>

            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-20 border-t-primary-50" />
                <p className="mt-3 text-body-m text-gray-70">정부 시스템(공공마이데이터)과 연결 중…</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {['네이버 인증서', '카카오 인증서', '공동인증서(구 공인인증서)'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={pick}
                    className="rounded-krds border border-gray-30 px-4 py-4 text-left text-body-l text-gray-90 hover:border-primary-50 hover:bg-primary-5"
                  >
                    {p}로 인증
                  </button>
                ))}
                <button type="button" onClick={() => setModal(false)} className="mt-1 py-2 text-label-m text-gray-50 underline">
                  닫기
                </button>
              </div>
            )}

            <p className="mt-4 text-detail-m text-gray-40">
              ※ 시연용 목업입니다. 실제 서비스는 본인인증 동의 후 행정안전부 공공마이데이터로 소득·재산을
              불러옵니다. 입력값은 저장되지 않습니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

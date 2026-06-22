'use client';

import { useState } from 'react';
import type { ResultCard } from '@/types/benefit';

const STYLE = {
  risk: {
    wrap: 'border-danger-50 bg-danger-5',
    tag: 'bg-danger-50 text-white',
    tagText: '끊길 위험',
    icon: '🔴',
  },
  renew: {
    wrap: 'border-warning-50 bg-warning-5',
    tag: 'bg-warning-50 text-gray-90',
    tagText: '갱신 필요',
    icon: '🟡',
  },
  ok: {
    wrap: 'border-success-50 bg-success-5',
    tag: 'bg-success-50 text-white',
    tagText: '유지',
    icon: '🟢',
  },
} as const;

export function ResultCardView({ card }: { card: ResultCard }) {
  const [open, setOpen] = useState(card.status === 'risk');
  const s = STYLE[card.status];
  const hasAction = card.actions.length > 0;

  return (
    <article className={`rounded-krds-lg border-2 ${s.wrap} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-label-s font-bold ${s.tag}`}>
            {s.icon} {s.tagText}
          </span>
          <h3 className="mt-2 text-heading-s-mobile font-bold text-gray-90 md:text-heading-s">{card.name}</h3>
          <p className="mt-1 text-body-l text-gray-80">{card.headline}</p>
        </div>
      </div>

      {card.reason && (
        <p className="mt-2 rounded-krds bg-white/70 px-3 py-2 text-body-s text-gray-70">
          <span className="font-bold text-gray-80">근거</span> · {card.reason}
        </p>
      )}
      {card.renewWhen && (
        <p className="mt-2 rounded-krds bg-white/70 px-3 py-2 text-body-s text-gray-70">
          <span className="font-bold text-gray-80">갱신 시기</span> · {card.renewWhen}
        </p>
      )}

      {hasAction && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-label-l font-bold text-primary-60 underline"
        >
          {open ? '조치 방법 접기' : '그래서 뭘 해야 하나요? ▾'}
        </button>
      )}

      {open && hasAction && (
        <div className="mt-3 space-y-3 border-t border-gray-20 pt-3">
          <div>
            <p className="text-label-l font-bold text-gray-90">해야 할 일</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-body-m text-gray-80">
              {card.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

          {card.documents.length > 0 && (
            <div>
              <p className="text-label-l font-bold text-gray-90">필요한 서류</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {card.documents.map((d, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-gray-30 bg-white px-2.5 py-1 text-detail-m text-gray-70"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={card.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-krds bg-primary-50 px-4 py-2 text-label-l font-bold text-white hover:bg-primary-60"
            >
              공식 안내·신청 →
            </a>
            <span className="text-detail-m text-gray-60">{card.agency}</span>
          </div>

          {card.confidenceNote && (
            <p className="text-detail-m text-gray-50">※ {card.confidenceNote}</p>
          )}
        </div>
      )}
    </article>
  );
}

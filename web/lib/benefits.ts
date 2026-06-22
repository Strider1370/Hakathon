// web/lib/benefits.ts — 큐레이션 혜택 카탈로그 로더 (서버 전용)
// process.cwd()는 web/ → 상위 data/welfare/curated-benefits.json 을 fs로 읽는다.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Benefit } from '@/types/benefit';

let cache: Benefit[] | null = null;

export function loadBenefits(): Benefit[] {
  if (cache) return cache;
  const p = join(process.cwd(), '..', 'data', 'welfare', 'curated-benefits.json');
  cache = JSON.parse(readFileSync(p, 'utf8')) as Benefit[];
  return cache;
}

export function getBenefit(id: string): Benefit | undefined {
  return loadBenefits().find((b) => b.id === id);
}

// 입력 폼의 체크박스용 — 어르신 친화 표시명만 추린 목록
export function benefitOptions(): { id: string; name: string }[] {
  return loadBenefits().map((b) => ({ id: b.id, name: b.name }));
}

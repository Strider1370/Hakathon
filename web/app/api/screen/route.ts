import { NextResponse } from 'next/server';
import { classify } from '@/lib/screening';
import type { Profile } from '@/lib/screening-questions';

export const runtime = 'nodejs';

// 문진 프로필 → 12개 정책 해당 '가능성'. 키 불필요(순수 코드).
export async function POST(req: Request) {
  let p: Profile;
  try {
    p = (await req.json()) as Profile;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  return NextResponse.json({ results: classify(p ?? {}) });
}

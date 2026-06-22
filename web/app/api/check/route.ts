import { NextResponse } from 'next/server';
import { evaluate } from '@/lib/eligibility';
import type { CheckInput, ChangeType } from '@/types/benefit';

export const runtime = 'nodejs';

// 슬롯(받는 혜택 + 변동)을 받아 결정론 판정 카드 배열을 반환. 키 불필요(순수 코드).
export async function POST(req: Request) {
  let body: Partial<CheckInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }
  const receivingBenefits = Array.isArray(body.receivingBenefits)
    ? body.receivingBenefits.filter((x): x is string => typeof x === 'string')
    : [];
  const changes = Array.isArray(body.changes)
    ? (body.changes.filter((x) => typeof x === 'string') as ChangeType[])
    : [];

  const cards = evaluate({ receivingBenefits, changes });
  return NextResponse.json({ cards });
}

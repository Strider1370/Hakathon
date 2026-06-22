# 04. 계획 (Plan) — 작업분해·파일소유권·폴백

> 체크리스트 04. 스펙(`docs/03-spec.md`) 기준. 핵심경로부터, fixture=`curated-benefits.json`.

## 1. 핵심경로 (이게 막히면 데모 없음)
입력(슬롯) → **결정론 판정 엔진** → 결과 카드 3종(🔴🟡🟢) → 조치 패널. 이 한 줄을 먼저 끝낸다.

## 2. 작업분해 + 파일소유권 (충돌 방지)
| # | 산출 파일 | 내용 | 의존 |
|---|---|---|---|
| T1 | `web/types/benefit.ts` | 혜택/슬롯/결과카드 타입 | — |
| T2 | `web/lib/benefits.ts` | curated-benefits.json 서버사이드 로드(`../../data/welfare/...`) | T1 |
| T3 | `web/lib/eligibility.ts` | **결정론 판정 엔진** — 슬롯값+변동 → 끊김/갱신/유지 판정 | T1,T2 |
| T4 | `web/app/api/check/route.ts` | 슬롯 받아 카드 배열 반환(서버) | T2,T3 |
| T5 | `web/lib/extract.ts` + `/api/llm` | 자연어/음성 텍스트 → 슬롯 추출(AI), 실패 시 폴백 | 기존 llm.ts |
| T6 | `web/app/page.tsx` | 첫화면: 텍스트칩 입력 + (음성버튼) | T4,T5 |
| T7 | `web/components/ResultCard.tsx` `ActionPanel.tsx` | 결과 카드·조치 패널 UI(KRDS) | T1 |
| T8 | 음성 레이어(`web/lib/voice.ts`) | gpt-realtime, 키모달, 폴백 | T5,T6 (마지막) |

## 3. 빌드 순서 (핵심경로 우선)
1. **T1→T2→T3** 엔진을 fixture로 먼저(화면 없이 node로 검증).
2. **T4** API로 노출.
3. **T6+T7** 텍스트칩 입력 → 카드 렌더(여기서 데모 성립).
4. **T5** AI 슬롯 추출 얹기(텍스트).
5. **T8** 음성 레이어(스트레치, 폴백 보장).

## 4. 폴백 (정직성)
- AI 슬롯 추출 실패 → 텍스트칩 수동 입력.
- 음성 실패 → 텍스트 입력 / 사전 녹화.
- LLM 키 없음 → 규칙 기반 키워드 슬롯 매핑(소득↑·합가 등 고정 키워드).
- 판정 근거 약함 → "확인 필요" + 공식 URL(단정 금지).

## 5. 재사용 자산 (새로 만들지 말 것)
- `@krds-ui/core` (정부 디자인), `web/components/Header.tsx`·`Footer.tsx`.
- `web/lib/regions.ts` (시도→시군구) — 관할 안내.
- `web/lib/llm.ts` + `web/app/api/llm/route.ts` — AI 호출(단 키 런타임 주입 `x-llm-key` 갭 보완 필요).
- `data/welfare/curated-benefits.json` — 판정 fixture(12개).
- 전수 검색 보강 시 `data/snapshots/gov24-services.json`(서버사이드).

## 6. 판정 엔진 설계 (T3 핵심)
- 입력 슬롯: `applicantAge`, `householdType`, `receivingBenefits[]`, `changes[]`(income_up·asset_up·household_change·job_started…).
- 각 혜택 `renewal.cutoffTriggers`를 **변동 유형에 매핑**(키워드→트리거). 받는 혜택 중 변동과 매칭되면 🔴 위험.
- `renewal.type=annual_reapply` + 신청월 임박 → 🟡 갱신.
- 매칭 없음 → 🟢 유지.
- 출력: `{benefitId, status, reason, dday?, actions[], documents[], applyUrl, confidence}`.
- **AI 자유분류 금지** — 매핑 테이블은 코드 상수.

## 7. 발표용 manifest (기능 상태)
빌드하며 `docs/manifest.md`에 implemented/mocked/fallback/dropped 기록(07 데모검증·08 대본에서 사용).

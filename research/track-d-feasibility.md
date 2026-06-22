# TRACK D — 데이터·구현 현실성 평가

> 실제 번들 파일(`C:\hakathon\data\snapshots\*`, `web/` 스캐폴드)을 직접 열어 표본 확인한 결과. 모든 단정은 실파일 근거.

## 0. 한 줄 결론

- **K2(갱신·서류 체크리스트 타임라인)** 가 가장 빨리 "진짜 데이터로 도는 데모"가 된다 — 단, 날짜는 카탈로그가 아니라 **curated 손큐레이션 의존**.
- **K1(자격변동 조기경보)** 는 카탈로그가 산문이라 결정론적 룰을 **혜택당 손으로** 짜야 함 → curated 8~15개 위에서만 동작.
- **K3(음성 점검)** 은 기술 난이도 최상(WebRTC + Realtime SDK 미설치), 폴백 필수.

---

## 1. 데이터 실측 결과 (실파일 표본)

### 1-1. `gov24-services.json` — 본체 (10,957건, array)

실제 필드(21개):
```
등록일시 · 부서명 · 사용자구분 · 상세조회URL · 서비스ID · 서비스명 ·
서비스목적요약 · 서비스분야 · 선정기준 · 소관기관명 · 소관기관유형 ·
소관기관코드 · 수정일시 · 신청기한 · 신청방법 · 전화문의 · 접수기관 ·
조회수 · 지원내용 · 지원대상 · 지원유형
```

실제 예시값(서비스ID `000000465790`, "유아학비 (누리과정) 지원"):
- `신청기한`: `"상시신청"`
- `신청방법`: `"기타 온라인신청||방문신청"` (`||` 구분자)
- `지원유형`: `"현금(감면)"`
- `상세조회URL`: `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/000000465790` (공식 URL 인용 가능)
- `선정기준` / `지원대상`: **장문 산문** (줄바꿈·말머리표 섞인 자연어. 위 레코드는 선정기준만 ~600자)

`지원유형` 상위값(머신 카테고리로 쓸 수 있음): 현금 4336 · 현물 1254 · 기타 719 · 이용권 605 · 현금(감면) 585 · 서비스(의료) 515 · 시설이용 448 · 현금(보험) 403.

### 1-2. `welfare-central.json` (452건) / `welfare-local.json` (4,569건)

공통 필드(12개): `servId · servNm · servDgst · jurMnofNm · jurOrgNm · ctpvNm · sgguNm · servDtlLink · aplyMtdNm · lifeArray · trgterIndvdlArray · intrsThemaArray`

- **신청기한·선정기준 필드 자체가 없음.** 가진 건 한 줄 요약(`servDgst`) + 범주 태그뿐.
- `servDtlLink`: 복지로 상세 URL (단, `&amp;` HTML 이스케이프 포함 → 디코딩 필요).
- 범주 태그(`lifeArray` 생애주기 / `trgterIndvdlArray` 대상특성 / `intrsThemaArray` 주제)는 **중앙은 채워짐**(life 300/452, trgter 275, thema 442), **지자체는 전부 빈값**(0/4569).
  - central `trgterIndvdlArray` 분포: 저소득 141 · 장애인 114 · 보훈대상자 64 · 한부모·조손 53 · 다문화·탈북민 44 · 다자녀 17 → **K1 룰의 거친 1차 필터로 쓸 수 있는 유일한 구조화 신호.**
- `welfare-local`은 `ctpvNm`(시도) 4569/4569 채워짐, `sgguNm`(시군구)은 0 → **지역 필터는 시도 단위까지만.**

### 1-3. `curated-benefits.example.json` — 정밀 룰 양식 (빈 양식)

구조(예시 1건 + 빈 슬롯 1건):
```json
{
  "id": "example-1",
  "name": "예시: 청년월세 한시 특별지원",
  "agency": "국토교통부",
  "amount": "월 최대 20만원 (최대 12개월)",
  "rules": {
    "eligibility": ["age_between(19,34)", "no_home", "income_below(median*0.6)"],
    "slots": ["applicantAge", "isHomeless", "monthlyIncome"]
  },
  "applyUrl": "https://www.gov.kr/portal/rcvfvrSvc/main",
  "sampleData": true
}
```
→ `rules.eligibility`는 **사람이 산문을 읽고 코드 술어로 옮긴 것**. `slots`는 되물을 사용자 프로필 필드. `sampleData:true`로 "샘플임"을 정직 표시. **K1·K2 정밀 매칭은 전적으로 이 양식 손큐레이션에 의존.**

---

## 2. 핵심 질문 답변

### Q1. '신청기한/갱신시기'가 카탈로그에 일관되게 들어있나? → **사실상 NO**

- gov24: `신청기한` 필드는 **10,957건 전부 비어있지 않음(EMPTY 0)** 이지만 값은 **자유서술**.
  - 고유값 **2,510종**. 최빈값 `"상시신청"` 6,541건(60%), `"접수기관 별 상이"` 851, `"별도의 신청절차가 없음"` 103, `"신청불필요"`류 다수.
  - 실제 기한형 값은 `"매년 1~2월"`, `"매년 연말~연초"`, `"2월 말 공고(내용 및 신청기간) 확인 후 방문 신청"`처럼 **월 단위 산문** → **머신 파싱 가능한 날짜(YYYY-MM-DD)는 없음.**
- welfare(central/local): **신청기한 필드 부재.**

**결론: K2 타임라인은 카탈로그에서 날짜를 못 뽑는다. `curated-benefits`에 대표 혜택의 신청/갱신 시기를 손으로 채우는 게 유일한 현실적 경로.** (양식에 날짜 필드가 없으므로 `rules`에 `renewMonth`/`deadline` 같은 슬롯을 추가 정의해야 함.)

### Q2. '선정기준/지원대상'이 정밀 자격판정에 쓸 구조인가? → **NO, 산문**

- gov24 `선정기준`·`지원대상`은 줄바꿈·말머리표 섞인 수백 자 자연어(1-1 예시 참조). 결정론적 비교(`age<65`, `income<X`) 불가.
- 유일한 구조 신호는 welfare-central의 `trgterIndvdlArray`(저소득/장애인/한부모 등 6범주) — 그러나 **거친 분류일 뿐 임계값 없음.**
- **AI 연동 철칙(reference/06 §0)과 정합**: LLM은 값추출만, 판정은 코드. 즉 산문→슬롯값 추출은 LLM에, **자격 판정은 curated `rules.eligibility` 코드 술어로.**

**K1 조기경보에 필요한 손작업량**: 결정론적 룰을 **혜택 1건당 하나씩** 손으로 작성. 발표 데모 기준 **대표 8~15개**(curated 양식 권장 범위)면 충분. 각 혜택당 `eligibility` 술어 2~4개 + `slots` 2~4개 → 1건당 5~10분, 12건이면 ~2시간 수작업.

### Q3. K3 음성(GPT Realtime) — 난이도/리스크/폴백 (reference/06 파트 B 기준)

- **모델/방식**: `gpt-realtime-2`(reasoning low), 브라우저는 **WebRTC**(WebSocket 아님), 공식 SDK `@openai/agents-realtime`. → **현재 `web/package.json`에 미설치**(deps: @krds-ui/core, next, react, react-dom뿐). 추가 설치·연동 필요.
- **값추출은 strict 함수호출**: `set_field`/`get_missing_fields`/`submit_application`, 모든 도구 `strict:true` + enum 스키마, 판정은 코드. 되읽기(read-back) 확인.
- **리스크**:
  1. 발표장 소음·wifi (§B-8) — 인식 실패 위험.
  2. APK/WebView 마이크 이중권한(§B-7: RECORD_AUDIO + MODIFY_AUDIO_SETTINGS, HTTPS, onPermissionRequest override) — 웹 데모면 회피 가능, 앱 데모면 함정.
  3. 키 런타임 입력 통로(§A) — 현재 `lib/llm.ts`는 `process.env.OPENAI_API_KEY`만 읽음. Realtime은 클라가 런타임 키로 직접 연결해야 함 → **키 입력 UI/모달 미구현.**
- **폴백(필수)**: 타이핑 입력 + 드롭다운 + 녹화 백업. 키 없으면 폴백으로 완전 동작해야 함(§A-4). 핵심 1동작만 음성 시연 권장.

---

## 3. web/ 스캐폴드 재사용 가능 부품

스캐폴드는 **거의 빈 상태**(`page.tsx` 36줄 플레이스홀더, 폼·지도 없음. INDEX의 `UserInfoForm`은 아직 미존재).

| 부품 | 위치 | 상태/쓰임 |
|---|---|---|
| KRDS UI 컴포넌트 | `@krds-ui/core` (Display·Body·Badge·Label·Detail·Masthead 사용 확인) | 즉시 사용. 폼 컴포넌트는 확인 필요 |
| 지역 셀렉터 데이터 | `web/lib/regions.ts` (`SIGUNGU_BY_SIDO` 시도→시군구 맵) | 지역 필터 UI 바로 구성 가능 |
| LLM 호출 헬퍼 | `web/lib/llm.ts` (`openaiChat`, gpt-5/o 자동대응, 키 없으면 null) | 텍스트 LLM 재사용 가능 |
| LLM API 라우트 | `web/app/api/llm/route.ts` (POST system/user, 폴백 text:null) | 서버사이드 패턴 재사용 |
| Header/Footer | `web/components/` | 레이아웃 |
| 데이터 읽기 패턴 | INDEX §앱에서 읽는 법 | API route에서 `fs`로 `../data/snapshots/*` 읽어 필터 후 작은 결과만 반환 |

**갭(직접 구현 필요)**:
- 카탈로그 검색 API route (아직 `/api/llm`만 존재).
- 사용자 프로필 입력 폼(UserInfoForm).
- 런타임 키 입력 모달 + `x-llm-key` 헤더 주입(현재 env-only).
- K3용 `@openai/agents-realtime` 설치 + WebRTC 연결.

---

## 4. 각 킥 구현 난이도 & 추천

| 킥 | 난이도 | 근거 |
|---|---|---|
| **K2 갱신·서류 체크리스트 타임라인** | **중** | 카탈로그에 날짜 없음 → curated 손큐레이션 의존이지만, 큐레이션만 채우면 결정론적 타임라인 렌더는 단순. 가장 데모 친화적 |
| **K1 자격변동 조기경보** | **중~상** | 산문 자격기준 → 혜택당 결정론적 룰 수작업(8~15건). welfare `trgterIndvdlArray`로 거친 1차 필터 보강 가능 |
| **K3 어르신 음성 점검** | **상** | SDK 미설치, WebRTC/마이크권한/키모달 전부 신규, 발표장 리스크. 폴백 필수 |

### 가장 빨리 "진짜 데이터로 도는 데모" → **K2**
이유: gov24의 `서비스명·신청방법·지원내용·상세조회URL`은 진짜 데이터로 즉시 카드화 가능하고(공식 URL 인용), 부족한 "날짜"만 curated로 채우면 타임라인이 완성된다. K1처럼 복잡한 룰 엔진 없이도 "정직한 큐레이션 카드 + 실제 카탈로그 링크" 조합으로 데모가 선다.

### 추천 fixture 전략 (curated 정밀화 대상)
대표 혜택 **10~12개**를 `curated-benefits.json`에 손으로 채우되, **신청 시기가 명확하고 대상이 또렷한 것** 위주로 선정:
1. **시기 있는 갱신형**(K2 핵심): 기초연금·국민기초생활보장(연 1회 확인조사)·청년월세 한시지원·국가장학금(학기별)·근로/자녀장려금(5월 정기) — `renewMonth`/`deadline` 슬롯 추가 정의.
2. **자격경계 또렷한 것**(K1): 청년월세(나이 19~34 + 무주택 + 소득), 한부모·다자녀·장애 등 welfare `trgterIndvdlArray` 범주와 매칭되는 혜택.
3. 각 항목 `applyUrl`은 gov24 `상세조회URL` 또는 복지로 `servDtlLink`(디코딩) 실값 사용, `sampleData:true` 정직 표시.
4. 양식 확장 제안: `rules`에 `renewMonth`(갱신월), `deadline`(신청기한), `documents[]`(서류목록) 필드 추가 → K2 체크리스트·타임라인이 한 양식에서 구동.

> 원칙: 전수 카탈로그(16,000건)는 "잠재 후보 + 공식 URL"로 정직하게, **정밀 판정·타임라인은 curated 10~12개에 한정.** (AI는 값추출, 판정은 코드 — reference/06 §0 준수.)

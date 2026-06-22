# 회고 — 지킴e (복지 끊김 점검) 해커톤

> 이번 작업에서 **기억할 만한 것 + 시행착오**. 템플릿(키트) 브랜치에 반영할 거리 위주.
> 형식: 증상 → 원인 → 해결. 다음에 또 만날 함정을 줄이는 게 목적.

---

## 1. ⭐ ChatGPT Realtime 음성 연동 (이번 첫 시도)

가장 손이 많이 간 부분. **AI=듣기·말하기·값추출, 판정=코드** 원칙은 지키면서, 실기기 피드백 루프로 다듬었다.

### 1.1 모델·엔드포인트 (가장 먼저 막힌 곳)
| 증상 | 원인 | 해결 |
|---|---|---|
| `Invalid URL (POST /v1/realtime/sessions)` | 구 엔드포인트 폐기 | GA는 **`POST /v1/realtime/client_secrets`**, body `{ session: { type:'realtime', model } }` |
| 인식·품질 아쉬움 | 구형 모델 | **2026-05 신모델로**: 대화 `gpt-realtime-2`(GPT-5급), 전사 `gpt-realtime-whisper`. (처음엔 `gpt-realtime` + `gpt-4o-mini-transcribe`로 시작) |

- **아키텍처**: 서버 `/api/realtime-token`이 `OPENAI_API_KEY`로 **임시키(`ek_`)** 발급 → 클라가 `@openai/agents-realtime`로 **WebRTC** 연결. 진짜 키는 클라에 노출 안 됨.
- **신뢰**: `tool({ strict })` `set_answer`로 **슬롯만** 채우고, 자격 판정은 결정론 코드.
- 모델 ID는 자주 바뀐다 → **배포 직전 재확인**. env로 빼두면(`OPENAI_REALTIME_MODEL`) 현장 교체 쉬움.

### 1.2 동작 트러블슈팅 (실기기에서 하나씩 드러남)
| 증상 | 원인 | 해결 |
|---|---|---|
| 연결했는데 AI가 조용함 | Realtime은 사용자 발화를 기다림 | 연결 직후 `transport.sendEvent({type:'response.create'})` + 지침에 "먼저 인사하고 1번 질문" |
| 사용자 말이 자막에 안 뜸 | 입력 전사 비활성 | 세션에 `audio.input.transcription:{ model, language:'ko' }` |
| 자막 올 때마다 **화면 전체가 아래로** | `scrollIntoView`가 페이지를 스크롤 | 말풍선 박스 **컨테이너 `scrollTop`** 만 조정 |
| 음성 답해도 화면 질문 안 넘어감 | 음성이 상태만 채우고 step 안 옮김 | 답마다 다음 미응답 질문으로 `setStep` |
| 문진 끝나도 마이크 안 꺼짐 | 세션 종료 처리 없음 | 컴포넌트 **언마운트 cleanup에서 `session.close()`** + 9문항 다 차면 자동 종료(backstop) |
| 배경 소음에 과민 | `semantic_vad`는 임계값 제어 불가 | **`server_vad` + `threshold`/`silence_duration_ms`** (env로 현장 튜닝) |
| 영어 등 섞임 | 언어 미고정 | 전사 `language:'ko'` + 지침 "한국어로만" |

### 1.3 APK WebView 마이크 (놓치면 데모 실패)
- 매니페스트: **`RECORD_AUDIO` + `MODIFY_AUDIO_SETTINGS`** 둘 다(후자 없으면 권한 줘도 WebView로 마이크 전달 안 됨).
- `MainActivity`: **런타임 권한 요청** + `BridgeWebChromeClient.onPermissionRequest` **즉시 grant**.
- `adb shell pm grant <appId> android.permission.RECORD_AUDIO`로 데모 전 미리 부여하면 프롬프트 없이 깔끔.

> **키트 반영 제안**: `reference/06`의 모델 ID를 `gpt-realtime-2`/`gpt-realtime-whisper`로, 엔드포인트를 `client_secrets`로 갱신. server_vad 튜닝·response.create 초기 트리거·언마운트 종료를 "흔한 함정"으로 추가.

---

## 2. Slidev 발표 함정

| 증상 | 원인 | 해결 |
|---|---|---|
| 크롬에서 **검은 화면 + 탭 글자 깨짐**(Claude 프리뷰는 정상) | dev 서버가 `<meta charset="slidev:entry">`로 charset 오염, Content-Type에 charset 없음 | **`slidev build` 결과(dist) 정적 서빙** — 올바른 `utf-8`. (프리뷰는 utf-8 강제라 버그를 가렸음) |
| 발표에 **빈칸이 너무 많음** | 카드가 `<v-clicks>`로 감싸져 클릭 전엔 제목만 보임 | 생성기에 **`meta.clicks:false`**(점진표시 제거) 옵션 추가 |
| 일부 레이아웃 카드가 **번호만 보임** | 렌더러 필드명 불일치(`product-overview`는 `heading/body`, deck는 `title/desc`) | 렌더러에 `heading??title`, `body??desc` 폴백 |
| `demo-callout` 제목이 이미지에 가려짐 | split 본문 `align-content:center`라 내용 길면 위로 넘침 | `align-content:start` |

> **키트 반영 제안**: `reference/04`에 "dev 대신 build 정적 서빙", `meta.clicks` 옵션, 레이아웃 필드명 표를 명시.

---

## 3. 배포·인프라

| 증상/포인트 | 메모 |
|---|---|
| 배포 루프 | `tar … web data/welfare \| ssh "tar -x"` → 서버 `npm install && next build` → **`.next-build→.next` 심볼릭 링크** → `pm2 restart` |
| 추가한 public 파일이 404 | `next start`는 **재시작 전엔 새 public 파일 안 잡음** → `pm2 restart` 후 서빙(APK 다운로드 URL) |
| 음성이 배포에서 작동 | HTTPS(secure context) + 서버 `.env.local`에 키 → 폰 브라우저에서도 마이크 OK |
| APK 배포 | Capacitor `server.url=배포 https` 래퍼 → 화면은 서버 실시간 로드, **JS/CSS만 바뀌면 재빌드 불필요** |
| 심사위원 배포 | APK를 `web/public/`에 두고 `/jikime.apk`로 공개 + **QR** 제공 |

---

## 4. 검증 환경 도구

| 증상 | 해결 |
|---|---|
| Claude 프리뷰 스크린샷 30s 타임아웃 | **Playwright**(`scripts/shoot.mjs`)로 캡처. DOM 검증(eval/inspect)은 정상 |
| React 버튼을 한 틱에 빠르게 연속 클릭하면 마지막만 반영 | 상태 갱신은 비동기 → **클릭 사이 `await`**(테스트 아티팩트, 앱 버그 아님) |
| 모바일 타이포 과대 | KRDS **`-mobile` 타이포 토큰**(heading-m-mobile 등)을 모바일 우선 + `md:`로 데스크톱 |

---

## 5. 기획·프로세스

- **5트랙 병렬 리서치** + **6 병렬 스크랩 에이전트** → 공식 출처 기반 curated 혜택 12개(보건복지부·국세청·법령).
- **인사이트**: "복지는 받는 순간이 아니라 *유지하는 동안* 끊긴다" — 모두가 *받기*를 안내할 때 *끊김*을 경고(방향 전환). 경쟁(복지로 복지멤버십) 방어가 한 슬라이드로 끝남.
- **정직성**: 산문 자격은 단정 X("끊길 위험 + 공식 확인"), 소득인정액 정밀화는 본인인증(공공마이데이터) **목업**으로 정직 표기.

---

## 한 줄 교훈
**음성(Realtime)은 "되는 것"과 "데모에서 끝까지 도는 것"이 다르다** — 먼저 말 걸기, 자막, 종료, 소음 VAD, WebView 마이크까지 *실기기에서* 한 바퀴 돌려봐야 안다.

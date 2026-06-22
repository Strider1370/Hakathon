# 회고 — 해커톤 작업 (Realtime 음성 · 발표 · 배포 · APK)

> 이번 주제(음성 점검형 공공서비스)에서 얻은 **주제 무관 재사용 교훈 + 시행착오**. 템플릿(키트) 브랜치 반영용.
> 프로젝트 고유값은 placeholder로: `<앱이름>` · `<appId>`(예 `kr.example.app`) · `<배포 https URL>`(예 `https://example.com`) · `<app>.apk`.
> 형식: 증상 → 원인 → 해결. 다음에 또 만날 함정을 줄이는 게 목적.

---

## 0. 키트(템플릿)에 반영할 규칙 — action items

> 이번 작업에서 사용자가 명시한 **작업 방식 규칙**. 템플릿(키트) 문서에 그대로 반영할 것. (이 instance에는 적용하지 말고 템플릿 세션에서.)

1. **단계마다 승인받고 진행한다.** 한 단계를 끝내면 ① 결과를 짧게 요약 ② "다음 단계로 가도 될지" 사용자에게 확인. 받은 승인은 **다음 한 단계까지만** — "진행" 한마디로 여러 단계를 몰아 처리하지 말 것. 사용자가 명시적으로 위임("끝까지 알아서")한 경우에만 연속 진행.
   → 반영 위치: `PROCESS-CHECKLIST.md` cross-cutting 원칙 + `CLAUDE.md` 소통.
2. **발표 엔진은 Slidev로 고정. Notion 정적 HTML은 만들지 않는다.** `presentation:static`/`presentation:build`의 Notion 생성 단계는 돌리지 않는다(코드는 남겨두되 산출물 X). 발표·캡처는 `slidev build`(dist) 정적 서빙으로(§2 charset 함정 회피).
   → 반영 위치: `reference/04` 엔진 선택.
3. **발표 초안 문장은 최대한 풍부하게 채운다.** 빈칸·한 단어로 두지 말고 슬롯마다 **1~2문장 구체 내용**(숫자·근거). 어차피 사람이 초안을 보고 **덜어내며** 다듬으니 부족하게보다 **꽉 차게** 시작. `meta.clicks:false`로 모든 내용 즉시 노출(사람이 실제 밀도 판단). 오버플로만 §8로 점검.
   → 반영 위치: `reference/04` §5.2(a)(초안 풍부) + §6.2("짧게"는 최종 목표지 초안을 비우라는 뜻 아님).
4. **`copy.md`는 무조건 생성한다(선택 아님).** `deck.json`을 만들면 항상 `presentation/copy.md`(슬롯마다 "AI초안 + 내수정 자리")를 함께 만든다. 슬라이드 구조가 바뀌면 `copy.md`도 재생성.
   → 반영 위치: `reference/04` §5.2(a) + §7.
5. **산출물마다 점진 커밋 후 백그라운드 푸시.** 리서치 보고서·스펙·코드·발표 등 산출물이 나올 때마다 점진 커밋하고 origin에 **백그라운드로** 푸시한다(작업 흐름을 막지 않게). 완성형 대량 커밋 금지.
   → 반영 위치: `PROCESS-CHECKLIST.md` 당일 컴플라이언스/cross-cutting + `CLAUDE.md` 원칙("점진 커밋"에 "백그라운드 푸시" 추가).
6. **설치·병렬·장시간 작업은 백그라운드 서브에이전트로.** npm 설치, 다중 병렬 리서치, 데이터 스크랩 등 오래 걸리거나 병렬화 가능한 작업은 백그라운드 서브에이전트/잡으로 돌려 **본 작업 흐름(사용자와의 대화)을 막지 않는다.** 결과는 도착하는 대로 통합.
   → 반영 위치: `reference/02`(병렬 리서치) + `PROCESS-CHECKLIST.md` 운영 노트.
7. **로컬 dev 서버를 LAN 공유 가능하게(`--host`/0.0.0.0).** 같은 망의 동료가 작업 중 화면을 보려면 dev 서버가 `0.0.0.0`에 바인딩돼야 한다 — 특히 **Slidev(Vite)는 기본이 localhost 전용이라 `--host` 필수**(Next dev는 기본 0.0.0.0). 키트의 dev 스크립트에 `--host`를 넣거나 문서화한다.
   (※ Windows 방화벽 인바운드 허용·공유기 AP격리 해제는 **환경 측**이라 코드로 못 박지 못함 — 안내만. 더 확실한 공유는 배포 URL.)
   → 반영 위치: `presentation/slidev` dev 스크립트(`slidev --host`) + README 실행표.

---

## 1. ⭐ ChatGPT Realtime 음성 연동

가장 손이 많이 간 부분. **AI=듣기·말하기·값추출, 판정=코드** 원칙은 지키면서, 실기기 피드백 루프로 다듬었다.

### 1.1 모델·엔드포인트 (가장 먼저 막힌 곳)
| 증상 | 원인 | 해결 |
|---|---|---|
| `Invalid URL (POST /v1/realtime/sessions)` | 구 엔드포인트 폐기 | GA는 **`POST /v1/realtime/client_secrets`**, body `{ session: { type:'realtime', model } }` |
| 인식·품질 아쉬움 | 구형 모델 | **신모델로**: 대화 `gpt-realtime-2`(GPT-5급), 전사 `gpt-realtime-whisper`. (구형 `gpt-realtime` + `gpt-4o-mini-transcribe`에서 업그레이드) |

- **아키텍처**: 서버 토큰 라우트가 `OPENAI_API_KEY`로 **임시키(`ek_`)** 발급 → 클라가 `@openai/agents-realtime`로 **WebRTC** 연결. 진짜 키는 클라에 노출 안 됨.
- **신뢰**: `tool({ strict })`로 **슬롯만** 채우고, 판정·계산은 결정론 코드.
- 모델 ID는 자주 바뀐다 → **배포 직전 재확인**. env로 빼두면(`OPENAI_REALTIME_MODEL` 등) 현장 교체 쉬움.

### 1.2 동작 트러블슈팅 (실기기에서 하나씩 드러남)
| 증상 | 원인 | 해결 |
|---|---|---|
| 연결했는데 AI가 조용함 | Realtime은 사용자 발화를 기다림 | 연결 직후 `transport.sendEvent({type:'response.create'})` + 지침에 "먼저 인사하고 첫 질문" |
| 사용자 말이 자막에 안 뜸 | 입력 전사 비활성 | 세션에 `audio.input.transcription:{ model, language:'ko' }` |
| 자막 올 때마다 **화면 전체가 아래로** | `scrollIntoView`가 페이지를 스크롤 | 자막 박스 **컨테이너 `scrollTop`** 만 조정 |
| 음성 답해도 화면 단계 안 넘어감 | 음성이 상태만 채우고 step 안 옮김 | 답마다 다음 미응답 항목으로 `setStep` |
| 문진 끝나도 마이크 안 꺼짐 | 세션 종료 처리 없음 | 컴포넌트 **언마운트 cleanup에서 `session.close()`** + 항목 다 차면 자동 종료(backstop) |
| 배경 소음에 과민 | `semantic_vad`는 임계값 제어 불가 | **`server_vad` + `threshold`/`silence_duration_ms`** (env로 현장 튜닝) |
| 다른 언어 섞임 | 언어 미고정 | 전사 `language:'ko'` + 지침 "한국어로만" |

### 1.3 APK WebView 마이크 (놓치면 데모 실패)
- 매니페스트: **`RECORD_AUDIO` + `MODIFY_AUDIO_SETTINGS`** 둘 다(후자 없으면 권한 줘도 WebView로 마이크 전달 안 됨).
- `MainActivity`: **런타임 권한 요청** + `BridgeWebChromeClient.onPermissionRequest` **즉시 grant**.
- `adb shell pm grant <appId> android.permission.RECORD_AUDIO`로 데모 전 미리 부여하면 프롬프트 없이 깔끔.

> **키트 반영 제안**: `reference/06`의 모델 ID를 신형으로, 엔드포인트를 `client_secrets`로 갱신. server_vad 튜닝·`response.create` 초기 트리거·언마운트 종료를 "흔한 함정"으로 추가.

---

## 2. Slidev 발표 함정

| 증상 | 원인 | 해결 |
|---|---|---|
| 크롬에서 **검은 화면 + 탭 글자 깨짐**(미리보기 도구는 정상) | dev 서버가 `<meta charset="slidev:entry">`로 charset 오염, Content-Type에 charset 없음 | **`slidev build` 결과(dist) 정적 서빙** — 올바른 `utf-8`. (일부 미리보기는 utf-8 강제라 버그를 가림) |
| 발표에 **빈칸이 너무 많음** | 카드가 `<v-clicks>`로 감싸져 클릭 전엔 제목만 보임 | 생성기에 **`meta.clicks:false`**(점진표시 제거) 옵션 추가 |
| 일부 레이아웃 카드가 **번호/제목만** 보임 | 렌더러 필드명 불일치(예: `product-overview`는 `heading/body`, deck에 `title/desc`) | 렌더러에 `heading??title`, `body??desc` 폴백 |
| `demo-callout` 제목이 이미지에 가려짐 | split 본문 `align-content:center`라 내용 길면 위로 넘침 | `align-content:start` |

> **키트 반영 제안**: `reference/04`에 "dev 대신 build 정적 서빙", `meta.clicks` 옵션, 레이아웃별 슬롯 필드명 표를 명시.

---

## 3. 배포·인프라

| 증상/포인트 | 메모 |
|---|---|
| 배포 루프 | `tar … <앱폴더> \| ssh "tar -x"` → 서버 `npm install && next build` → **빌드 distDir 심볼릭 링크** → `pm2 restart` |
| 추가한 public 파일이 404 | `next start`는 **재시작 전엔 새 public 파일 안 잡음** → `pm2 restart` 후 서빙(예: APK 다운로드 URL) |
| 음성이 배포에서 작동 | HTTPS(secure context) + 서버 `.env.local`에 키 → 폰 브라우저에서도 마이크 OK |
| APK 배포 | Capacitor `server.url=<배포 https URL>` 래퍼 → 화면은 서버 실시간 로드, **JS/CSS만 바뀌면 재빌드 불필요** |
| 심사위원 배포 | APK를 `public/`에 두고 `/<app>.apk`로 공개 + **QR** 제공. (안드로이드 전용·"알 수 없는 출처" 안내 한 줄) |

---

## 4. 검증 환경 도구

| 증상 | 해결 |
|---|---|
| 미리보기 스크린샷 30s 타임아웃 | **Playwright** 캡처 스크립트로 대체. DOM 검증(eval/inspect)은 정상 |
| React 버튼을 한 틱에 빠르게 연속 클릭하면 마지막만 반영 | 상태 갱신은 비동기 → **클릭 사이 `await`**(테스트 아티팩트, 앱 버그 아님) |
| 모바일 타이포 과대 | KRDS **`-mobile` 타이포 토큰**(예 `heading-m-mobile`)을 모바일 우선 + `md:`로 데스크톱 |

---

## 5. 기획·프로세스 (주제 무관)

- **다중 병렬 리서치 트랙** + **병렬 스크랩 에이전트**로 공식 출처 기반 데이터를 단시간에 확보 → 데모가 "껍데기"가 아니라 진짜 데이터로 돈다.
- **인사이트는 기능이 아니라 관점 전환에서** — 남들이 다루는 방향을 뒤집으면 경쟁 방어가 한 슬라이드로 끝난다.
- **정직성**: 산문 자격은 단정 X(추정 + 공식 확인), 실연계가 어려운 부분은 **목업으로 정직 표기**(발표·화면 양쪽).

---

## 한 줄 교훈
**음성(Realtime)은 "되는 것"과 "데모에서 끝까지 도는 것"이 다르다** — 먼저 말 걸기·자막·종료·소음 VAD·WebView 마이크까지 *실기기에서* 한 바퀴 돌려봐야 안다.

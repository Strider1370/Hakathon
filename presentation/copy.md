# 발표 화면 카피 수정 양식 (copy.md)

> 화면에 박히는 글은 **사람이 쓴다.** 바꾸고 싶은 슬롯의 "내수정:" 칸에만 적으세요.
> 비워두면 AI초안 그대로 갑니다. 다 적은 뒤 저에게 "copy.md 반영해줘" 하시면
> `deck.json`에 옮기고 `npm run presentation:build`로 다시 만듭니다.
> (스피커 노트=말로 할 대본은 docs/08-script.md, 별도)

---

## slide-01 — hero (답먼저)
- eyebrow   | AI초안: 복지 끊김 점검                         | 내수정:
- title     | AI초안: 받던 복지, 끊기기 전에                  | 내수정:
- subtitle  | AI초안: 어르신이 말로 점검하는 자격 변동 비서    | 내수정:
- footnote  | AI초안: 음성 · KRDS · 공공데이터                | 내수정:

## slide-02 — problem-flow (문제)
- title     | AI초안: 복지는 받을 때가 아니라, 끊길 때 아프다 | 내수정:
- item1     | AI초안: 소득·가구가 바뀐다 / 일을 시작하거나 가족과 합치면 자격이 변한다 | 내수정:
- item2     | AI초안: 그대로 끊긴다 / 갱신·서류를 놓치면 받던 게 멈춘다 | 내수정:
- item3     | AI초안: 본인은 가장 늦게 안다 / 환수 통지로 안다 — 5년 1,140억, 가산세·지급제한 | 내수정:

## slide-03 — contrast (인사이트)
- title     | AI초안: 방향이 반대다                          | 내수정:
- lead      | AI초안: 받을 것을 찾아주는 서비스는 많다. 끊길 위험을 경고하는 건 없다. | 내수정:
- leftLabel | AI초안: 기존 (복지로·보조금24·토스)            | 내수정:
- left1/2/3 | AI초안: 받을 것 안내 / 앱·로그인·타이핑 전제 / 판정은 백오피스에 | 내수정:
- rightLabel| AI초안: 우리                                  | 내수정:
- right1/2/3| AI초안: 끊길 위험 경고 / 말로 점검 / 판정을 당사자 손에 | 내수정:

## slide-04 — insight-statement (한 문장)
- title     | AI초안: 복지는 유지하는 동안 끊긴다             | 내수정:
- subtitle  | AI초안: 끊기기 전에, 말로 점검한다              | 내수정:

## slide-05 — product-overview (솔루션)
- title     | AI초안: 세 단계를 한 흐름으로                   | 내수정:
- feat1     | AI초안: 말로 문진 / 받는 혜택을 찾아준다         | 내수정:
- feat2     | AI초안: 변동 점검 / 끊길 위험을 짚는다           | 내수정:
- feat3     | AI초안: 본인인증 / 추정을 정확으로               | 내수정:

## slide-06 — demo-callout (데모 리캡)
- title     | AI초안: 말 한마디면 된다                        | 내수정:
- callout1  | AI초안: "일 시작했고, 아들과 합쳐 살아요" / 음성으로 상황을 말한다 | 내수정:
- callout2  | AI초안: 🔴 기초연금·의료급여 끊길 위험 / 받기가 아니라, 끊김을 먼저 짚는다 | 내수정:
- callout3  | AI초안: D-day · 해야 할 일 · 서류 / 그래서 무엇을 언제 하나 | 내수정:
- points    | AI초안: 판정은 코드 / 출처는 공식 URL / 음성 + 자막 | 내수정:

## slide-07 — architecture (메커니즘)
- title     | AI초안: AI는 듣고, 코드가 판정한다              | 내수정:
- step1     | AI초안: 음성 이해 / 비정형 말 → 슬롯 추출 (strict 함수호출) | 내수정:
- step2     | AI초안: 결정론 판정 / 변동 → 공식 끊김 사유 매칭 (코드) | 내수정:
- step3     | AI초안: 공식 출처 카드 / 단정 대신 근거 + URL    | 내수정:
- result    | AI초안: 환각 없는 판정 — 틀려도 엉뚱한 결과가 안 나간다 | 내수정:

## slide-08 — big-number (임팩트)
- label     | AI초안: 변동 미신고 부적격 지급, 최근 5년       | 내수정:
- number    | AI초안: 1,140억                                | 내수정:
- caption   | AI초안: 해외 ex-parte 자동갱신은 갱신율 +28%p (Health Affairs 2025) | 내수정:

## slide-09 — limitation-guardrail (한계/가드레일)
- title     | AI초안: 정직하게                               | 내수정:
- limit1/2/3| AI초안: 자격은 추정 / 대표 12개 정밀 / 음성 폴백 | 내수정:
- guard1/2/3| AI초안: 판정은 결정론 코드 / 단정 금지 / 정부 연계는 목업 | 내수정:

## slide-10 — closing
- title     | AI초안: 받는 걸 돕는 복지는 많습니다            | 내수정:
- subtitle  | AI초안: 끊기지 않게 지키는 복지는, 여기서 시작합니다 | 내수정:
- cta       | AI초안: 라이브 데모                            | 내수정:
- tags      | AI초안: 어르신 / 음성 / 끊김 경고              | 내수정:
- contact   | AI초안: github.com/Strider1370/Hakathon       | 내수정:

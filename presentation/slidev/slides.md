---
# Engine ported from BaizeAI/talks (Apache-2.0) — glow background + fade transitions + reveals.
# See presentation/sources/ASSET_LICENSES.md
# theme 키 생략 = Slidev 기본 테마 (BaizeAI 와 동일 — heading 크기/레이아웃을 기본 테마가 제공).
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: "받던 복지, 끊기기 전에"
lang: ko
lineNumbers: false
mdc: true
clicks: 0
glowSeed: 284
glow: full
slideId: "slide-01"
semanticLayout: "hero"
durationSeconds: 20
impl: "implemented"
---
<div class="flex flex-col items-center justify-center text-center">

<div class="text-cyan-300 tracking-widest text-sm font-semibold uppercase opacity-90" data-addr="slide-01.content.eyebrow">복지 끊김 점검</div>

<h1 data-addr="slide-01.content.title">받던 복지, 끊기기 전에</h1>

<div class="mt-4 max-w-3xl opacity-80 text-lg" data-addr="slide-01.content.subtitle">어르신이 말로 점검하는 자격 변동 비서</div>
</div>

<div class="mt-8" data-addr="slide-01.content.footnote"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm opacity-80">음성(gpt-realtime-2) · KRDS · 공공데이터 16,000건</div></div>

<!--
복지의 진짜 문제는 못 받는 게 아니라, 받던 게 끊기는 겁니다. 우리는 그걸 끊기기 전에, 말로 점검합니다.
-->

---
class: px-14 py-10
title: "복지는 받을 때가 아니라, 끊길 때 아프다"
glowSeed: 285
glow: left
slideId: "slide-02"
semanticLayout: "problem-flow"
durationSeconds: 30
impl: "implemented"
---

<h1 data-addr="slide-02.content.title">복지는 받을 때가 아니라, 끊길 때 아프다</h1>

<div mt-8>
  <div data-addr="slide-02.content.items" border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>문제</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1 data-addr="slide-02.content.items.0">
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>소득·가구가 바뀌면 자격도 바뀐다</div><div text-sm opacity-80>일을 시작하거나 가족과 합치면 소득인정액이 오른다 — 본인은 신고 의무조차 모른다</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-02.content.items.1">
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>갱신·서류를 놓치면 그대로 끊긴다</div><div text-sm opacity-80>에너지바우처는 해마다 다시 신청 — 기간을 놓치면 그 해는 0원</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-02.content.items.2">
        <div i-carbon:warning-alt text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>본인은 환수 통지로 가장 늦게 안다</div><div text-sm opacity-80>최근 5년 부적격 지급 1,140억 원 + 가산세 + 2~5년 지급 제한</div></div>
      </div>
    </div>
  </div>
</div>

<!--
소득이 늘거나 가족과 합치면 자격이 바뀝니다. 본인은 모르고 지내다 환수 통지로 압니다. 최근 5년 부적격 지급이 1,140억, 가산세에 지급 제한까지 붙습니다.
-->

---
class: px-14 py-10
title: "방향이 반대다"
glowSeed: 286
glow: right
slideId: "slide-03"
semanticLayout: "contrast"
durationSeconds: 30
impl: "implemented"
---

<h1 data-addr="slide-03.content.title">방향이 반대다</h1>

<div text-xl opacity-70 mt-1 data-addr="slide-03.content.lead">받을 것을 찾아주는 서비스는 많다. 받던 게 끊길 위험을 경고하는 건 없다.</div>

<div mt-8 grid grid-cols-2 gap-6 items-start>
  <div data-addr="slide-03.content.left" border="2 solid red-800" bg="red-800/20" rounded-lg overflow-hidden>
    <div bg="red-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-red-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>기존 (복지로·보조금24·토스)</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.left.0">
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>받을 것만 안내</div><div text-sm opacity-80>신규 신청·마감 알림 중심 — 끊김은 빈칸</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.left.1">
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>앱·로그인·타이핑 전제</div><div text-sm opacity-80>고령층 디지털화 70.7%, 입력에서 막힌다</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.left.2">
        <div i-carbon:close text-red-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>판정은 백오피스에</div><div text-sm opacity-80>행복e음 안에 갇혀 당사자엔 안 보임</div></div>
      </div>
    </div>
  </div>
  <div data-addr="slide-03.content.right" border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:idea text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>우리</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.right.0">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>끊길 위험을 먼저 경고</div><div text-sm opacity-80>유지·갱신을 점검해 끊기기 전에</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.right.1">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>말로 점검</div><div text-sm opacity-80>타이핑 못 해도 음성·자막으로</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-03.content.right.2">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>판정을 당사자 손에</div><div text-sm opacity-80>공식 출처 근거로 직접 확인</div></div>
      </div>
    </div>
  </div>
</div>

<!--
받을 것 찾아주는 서비스는 많습니다. 복지멤버십도 그렇죠. 그런데 전부 방향이 받기입니다. 끊길 위험을 경고하는 건 없습니다. 방향을 뒤집었습니다.
-->

---
layout: center
title: "복지는 유지하는 동안 끊긴다"
glowSeed: 287
glow: center
slideId: "slide-04"
semanticLayout: "insight-statement"
durationSeconds: 15
impl: "implemented"
---

<div class="text-center">

<div class="text-cyan-300 font-bold tracking-widest text-sm">인사이트</div>

<h1 data-addr="slide-04.content.title">복지는 유지하는 동안 끊긴다</h1>

</div>

<div class="mt-8 mx-auto max-w-2xl"><div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 ">
<div class="opacity-90" data-addr="slide-04.content.subtitle">끊기기 전에, 말로 점검한다</div>
</div></div>

<!--
(한 박자 쉬고) 복지는 받는 순간이 아니라, 유지하는 동안 끊깁니다.
-->

---
class: px-14 py-10
title: "세 단계를 한 흐름으로"
glowSeed: 288
glow: bottom
slideId: "slide-05"
semanticLayout: "product-overview"
durationSeconds: 20
impl: "implemented"
---

<h1 data-addr="slide-05.content.title">세 단계를 한 흐름으로</h1>

<div mt-6 grid grid-cols-3 gap-4 h-75>



  <div data-addr="slide-05.content.features.0" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-cyan-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>말로 문진</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>쉬운 질문 9개를 음성·자막으로. 무엇을 받는지 몰라도 해당 혜택을 찾아준다</div>
    </div>
  </div>

  <div data-addr="slide-05.content.features.1" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-amber-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>변동 점검</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>받는 혜택 × 소득·가구 변동 → 끊길 위험을 코드가 판정. 근거·D-day·필요 서류까지</div>
    </div>
  </div>

  <div data-addr="slide-05.content.features.2" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-green-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>본인인증</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>공공마이데이터 연계로 추정을 정확한 소득인정액과 끊길 날짜로</div>
    </div>
  </div>



</div>

<!--
세 단계입니다. 말로 물어 받는 걸 찾고, 변동을 점검해 끊길 위험을 짚고, 본인인증하면 추정이 정확한 숫자로 바뀝니다. 직접 보시죠.
-->

---
class: px-14 py-10
title: "말 한마디면 된다"
glowSeed: 289
glow: top
slideId: "slide-06"
semanticLayout: "demo-callout"
durationSeconds: 15
impl: "implemented"
---

<h1 data-addr="slide-06.content.title">말 한마디면 된다</h1>

<div mt-6 grid grid-cols-2 gap-8 items-center>

<div>

<img src="/assets/demo-risk.png" alt="데모 화면" class="rounded-xl shadow-2xl mx-auto" data-addr="slide-06.assets.image" data-asset-status="real">

</div>

<div grid gap-3>



<div data-addr="slide-06.content.callout.0" border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-cyan-300 text-xl shrink-0 /><span font-medium text-lg>"일 시작했고, 아들과 합쳐 살아요"</span></div><div text-sm opacity-70 mt-1 pl-7>음성으로 상황을 말하면 자막으로도 보인다</div>
</div>

<div data-addr="slide-06.content.callout.1" border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-amber-300 text-xl shrink-0 /><span font-medium text-lg>🔴 기초연금·의료급여 끊길 위험</span></div><div text-sm opacity-70 mt-1 pl-7>받기가 아니라, 끊김을 먼저 짚는다</div>
</div>

<div data-addr="slide-06.content.callout.2" border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-5 py-3>
<div flex items-center gap-2><div i-carbon:checkmark text-green-300 text-xl shrink-0 /><span font-medium text-lg>D-day · 해야 할 일 · 서류</span></div><div text-sm opacity-70 mt-1 pl-7>그래서 무엇을 언제, 어디에 내나</div>
</div>



</div>

</div>

<div mt-4 text-sm opacity-70 data-addr="slide-06.content.points">
- 판정은 코드
- 출처는 공식 URL
- 음성 + 자막
</div>

<!--
방금 보신 것: 말 한마디에 끊길 위험이 먼저 떴습니다. 받기가 아니라 끊김을요.
-->

---
class: px-14 py-10
title: "AI는 듣고, 코드가 판정한다"
glowSeed: 290
glow: full
slideId: "slide-07"
semanticLayout: "architecture"
durationSeconds: 25
impl: "implemented"
---

<h1 data-addr="slide-07.content.title">AI는 듣고, 코드가 판정한다</h1>

<div mt-8>
  <div data-addr="slide-07.content.steps" border="2 solid blue-800" bg="blue-800/20" rounded-lg overflow-hidden>
    <div bg="blue-800/40" px-5 py-3 flex items-center>
      <div i-carbon:flow text-blue-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>동작 흐름</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-center gap-3 py-1 data-addr="slide-07.content.steps.0"><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>1</div><div><div font-medium text-lg>음성 이해</div><div text-sm opacity-70>비정형 말 → 점검 슬롯으로 (strict 함수호출, 환각 차단)</div></div></div>
      <div flex items-center gap-3 py-1 data-addr="slide-07.content.steps.1"><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>2</div><div><div font-medium text-lg>결정론 판정</div><div text-sm opacity-70>받는 혜택 × 변동 → 공식 끊김 사유 매칭 (규칙 코드)</div></div></div>
      <div flex items-center gap-3 py-1 data-addr="slide-07.content.steps.2"><div w-6 h-6 shrink-0 grid place-items-center rounded-full bg="blue-800/60" text-blue-100 text-sm font-bold>3</div><div><div font-medium text-lg>공식 출처 카드</div><div text-sm opacity-70>단정 대신 근거 + gov.kr·법령 URL</div></div></div>
    </div>
  </div>
</div>

<div mt-6 flex justify-center>
  <div border="2 solid white/5" bg="white/5" backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-3>
    <div i-carbon:idea text-yellow-300 text-2xl shrink-0 />
    <span text-lg><b>결과:</b> AI는 입력만, 판정은 코드 — 틀려도 엉뚱한 결과가 안 나간다</span>
  </div>
</div>

<!--
AI는 듣고 값만 뽑습니다. 자격 판정은 결정론 코드가 합니다. 그래서 똑똑함이 아니라 정직함이 차별점입니다.
-->

---
class: px-14 py-10
title: "근거 위에 — 공공데이터"
glowSeed: 291
glow: left
slideId: "slide-08"
semanticLayout: "card-grid"
durationSeconds: 20
impl: "implemented"
---

<h1 data-addr="slide-08.content.title">근거 위에 — 공공데이터</h1>

<div mt-6 grid grid-cols-2 gap-4 h-75>



  <div data-addr="slide-08.content.cards.0" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-cyan-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>보조금24 10,957건</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>공공서비스 전수 검색 모집단</div>
    </div>
  </div>

  <div data-addr="slide-08.content.cards.1" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-amber-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>복지서비스 5,021건</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>중앙·지자체 복지 카탈로그</div>
    </div>
  </div>

  <div data-addr="slide-08.content.cards.2" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-green-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>대표 12개 정밀</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>보건복지부·국세청·법령정보 큐레이션</div>
    </div>
  </div>

  <div data-addr="slide-08.content.cards.3" border="2 solid white/5" rounded-lg overflow-hidden bg="white/5" backdrop-blur-sm h-full>
    <div flex items-center bg="white/10" backdrop-blur px-3 py-2>
      <div i-carbon:dot-mark text-sky-300 text-xl mr-2 shrink-0 />
      <div font-semibold text-lg>출처 URL 동봉</div>
    </div>
    <div px-4 py-3 flex flex-col gap-2>
      <div text-sm opacity-80>gov.kr·복지로·국가법령정보</div>
    </div>
  </div>



</div>

<!--
검색 모집단은 보조금24와 복지서비스 16,000건 전수입니다. 그 위에 어르신 관련 대표 12개는 공식 출처에서 자격·갱신·서류를 직접 큐레이션했고, 출처 URL을 함께 보여줍니다.
-->

---
layout: center
title: "변동 미신고 부적격 지급, 최근 5년"
glowSeed: 292
glow: right
slideId: "slide-09"
semanticLayout: "big-number"
durationSeconds: 20
impl: "implemented"
---

<div class="text-center">

<div class="opacity-70 tracking-wide" data-addr="slide-09.content.label">변동 미신고 부적격 지급, 최근 5년</div>

<div class="my-3 text-7xl font-extrabold text-cyan-300 leading-none" data-addr="slide-09.content.number">1,140억</div>

<div class="mt-4 opacity-55 text-sm max-w-xl mx-auto" data-addr="slide-09.content.caption">해외 ex-parte 자동갱신은 절차상 탈락을 막아 갱신율 +28%p (Health Affairs 2025)</div>

</div>

<!--
문제의 크기는 5년 1,140억. 해외에선 정부 데이터로 미리 점검하는 ex-parte 방식이 갱신율을 28%p 올렸습니다. 우리가 그걸 당사자 편에서 합니다.
-->

---
class: px-14 py-10
title: "정직하게"
glowSeed: 314
glow: center
slideId: "slide-10"
semanticLayout: "limitation-guardrail"
durationSeconds: 25
impl: "implemented"
---

<h1 data-addr="slide-10.content.title">정직하게</h1>

<div mt-8 grid grid-cols-2 gap-6 items-start>
  <div data-addr="slide-10.content.limitations" border="2 solid amber-800" bg="amber-800/20" rounded-lg overflow-hidden>
    <div bg="amber-800/40" px-5 py-3 flex items-center>
      <div i-carbon:warning-alt text-amber-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>한계</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.limitations.0">
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>자격은 추정</div><div text-sm opacity-80>정확한 소득인정액은 본인인증 후에</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.limitations.1">
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>대표 12개만 정밀</div><div text-sm opacity-80>나머지 16,000건은 잠재 후보로 표시</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.limitations.2">
        <div i-carbon:dot-mark text-amber-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>음성은 폴백 필수</div><div text-sm opacity-80>소음·권한 대비 타이핑·스크린샷 백업</div></div>
      </div>
    </div>
  </div>
  <div data-addr="slide-10.content.guardrails" border="2 solid green-800" bg="green-800/20" rounded-lg overflow-hidden>
    <div bg="green-800/40" px-5 py-3 flex items-center>
      <div i-carbon:shield-checkmark text-green-300 text-2xl mr-2 shrink-0 />
      <span font-bold text-xl>안전장치</span>
    </div>
    <div px-5 py-4 flex flex-col gap-1>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.guardrails.0">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>판정은 결정론 코드</div><div text-sm opacity-80>AI 자유분류 금지</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.guardrails.1">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>단정 금지</div><div text-sm opacity-80>끊길 위험 + 공식 확인 안내</div></div>
      </div>
      <div flex items-start gap-2 py-1 data-addr="slide-10.content.guardrails.2">
        <div i-carbon:checkmark text-green-300 text-xl mt-1 shrink-0 />
        <div><div font-bold>정부 연계는 목업</div><div text-sm opacity-80>공공마이데이터 연계를 가정</div></div>
      </div>
    </div>
  </div>
</div>

<!--
정직하게 짚습니다. 로그인 전 자격은 추정이고, 정확한 값은 본인인증이 필요합니다. 정부 연계 부분은 공공마이데이터를 가정한 목업입니다.
-->

---
class: px-14 py-10
title: "여기서 더"
glowSeed: 315
glow: bottom
slideId: "slide-11"
semanticLayout: "expansion-map"
durationSeconds: 15
impl: "implemented"
---

<h1 data-addr="slide-11.content.title">여기서 더</h1>

<div mt-6 grid grid-cols-3 gap-4 h-75>



  <div data-addr="slide-11.content.tiers.0" border="2 solid sky-800" bg="sky-800/20" rounded-lg overflow-hidden h-full>
    <div bg="sky-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-lg>curated 룰 확대</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-sm opacity-80>대표 12개 → 핵심 수급 제도 전반</div>
    </div>
  </div>

  <div data-addr="slide-11.content.tiers.1" border="2 solid purple-800" bg="purple-800/20" rounded-lg overflow-hidden h-full>
    <div bg="purple-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-lg>공공마이데이터 실연계</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-sm opacity-80>목업 → 동의 기반 실제 소득·재산</div>
    </div>
  </div>

  <div data-addr="slide-11.content.tiers.2" border="2 solid indigo-800" bg="indigo-800/20" rounded-lg overflow-hidden h-full>
    <div bg="indigo-800/40" px-4 py-2 flex items-center justify-center>
      <span font-bold text-lg>국민비서 푸시 알림</span>
    </div>
    <div px-4 py-4 flex flex-col gap-1>
      <div text-sm opacity-80>끊길 D-day를 먼저 알려준다</div>
    </div>
  </div>



</div>

<!--
확장은 셋입니다. 큐레이션 룰을 늘리고, 공공마이데이터를 실연계하고, 국민비서로 끊길 날짜를 먼저 알립니다.
-->

---
layout: center
title: "받는 걸 돕는 복지는 많습니다"
glowSeed: 316
glow: top
slideId: "slide-12"
semanticLayout: "closing"
durationSeconds: 20
impl: "implemented"
---

<div class="text-center">

<h1 data-addr="slide-12.content.title">받는 걸 돕는 복지는 많습니다</h1>

<div class="opacity-70 mt-3 max-w-2xl mx-auto" data-addr="slide-12.content.subtitle">끊기지 않게 지키는 복지는, 여기서 시작합니다</div>

</div>

<div class="mt-8" data-addr="slide-12.content.cta"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-cyan-100"><span class="i-carbon:play" /> 라이브 데모</div></div>

<div class="mt-4 flex flex-wrap gap-2 justify-center" data-addr="slide-12.content.tags"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-xs opacity-75">어르신</div><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-xs opacity-75">음성 점검</div><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-xs opacity-75">끊김 경고</div><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-xs opacity-75">공공데이터</div></div>

<div class="mt-8" data-addr="slide-12.content.contact"><div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-sm opacity-80"><span class="i-carbon:logo-github" /> github.com/Strider1370/Hakathon</div></div>

<!--
받는 걸 돕는 복지는 많습니다. 끊기지 않게 지키는 복지는, 여기서 시작합니다. 감사합니다.
-->

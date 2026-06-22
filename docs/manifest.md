# 기능 상태 manifest (발표 정직성용)

> 발표·데모에서 "구현됨"만 단정한다. mocked/fallback/dropped는 그대로 말한다.

| 기능 | 상태 | 비고 |
|---|---|---|
| 자격 문진(`lib/screening.ts` 9문항 + 분류) | **implemented** | 첫 실행 단계별 질문 → 12개 정책 해당 '가능성' 분류(단정 금지). UI 9문항→결과 그룹 브라우저 검증 |
| 문진 API(`/api/screen`) | **implemented** | 프로필→가능성. 페르소나 8건 정상(200) |
| 두 단계 연결(`Onboarding`) | **implemented** | 문진 '받는 혜택'을 끊김 점검에 prefill. 브라우저 검증 |
| 결정론 판정 엔진(`lib/eligibility.ts`) | **implemented** | 변동→cutoffTriggers 키워드 매핑, 순수함수. node 검증 통과 |
| 큐레이션 데이터 12개(`curated-benefits.json`) | **implemented** | 권위 출처 스크랩, 끊김 트리거 4~7개/건, confidence 표기 |
| 점검 API(`/api/check`) | **implemented** | 키 불필요. 페르소나 4건 정상 반환(200) |
| 입력 폼(혜택+변동 선택) | **implemented** | KRDS 스타일, 모바일 그리드. 브라우저 검증 |
| 결과 카드(🔴🟡🟢 + 조치·서류·공식URL) | **implemented** | 위험/갱신/유지 색상 구분, 근거·정직성 문구 |
| 변동 가이드 문진(`ChangeFlow`) | **implemented** | 변동 6문항 예/아니요 → 끊김 판정. 브라우저 검증 |
| 본인인증→공공마이데이터 연계 | **mocked** | 목업: 인증 모달→가상 페르소나 정확 소득인정액·D-day 주입(추정→정확). 화면·발표 모두 '목업' 라벨 명시 |
| Realtime 임시키 발급(`/api/realtime-token`) | **implemented** | OPENAI_API_KEY로 ek_ 토큰 발급. 모델 gpt-realtime-2(GPT-5급), 전사 gpt-realtime-whisper(한국어)+semantic_vad+노이즈감소. 실호출 검증(200, ek_) |
| 음성 문진(`VoiceMic` + Agents SDK) | **implemented(구조)** | AI 9문항 음성 진행 + strict 함수호출(set_answer)로 슬롯 채움, 판정은 코드. 탭 폴백 공존. ⚠️ 실제 음성 대화는 마이크 있는 실기기에서 검증 필요 |
| 음성 대화 자막(카카오톡식 말풍선) | **implemented(구조)** | 입력 음성 전사 활성화 + history_updated 구독 → 도우미/사용자 발화 말풍선 표시(이중 확인 채널). 실기기 검증 필요 |
| AI 자연어 텍스트→슬롯(`/api/llm`) | **TODO(선택)** | 음성으로 대체되어 우선순위 낮음 |
| 전수 카탈로그 검색(16,000건) | **dropped(데모)** | 모집단은 있으나 데모는 curated 12개로 한정 |
| 푸시 알림 백엔드 | **dropped** | 발표서 'mocked' 명시 |

검증 시점 2026-06-22. 데모 페르소나: 기초연금·의료급여·에너지바우처·장기요양 수급 + 소득증가·합가 → 끊길 위험 3 + 갱신 1.

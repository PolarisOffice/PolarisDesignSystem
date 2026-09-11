/**
 * UX Writing 데이터 — 2026-08-25 신설.
 *
 * 근거 표시 규칙:
 *  · `source` 가 있는 항목 = 이미 컴포넌트 문서에 있던 규칙을 원칙 층위로 올린 것.
 *  · `source` 가 없는 항목 = 이 페이지가 새로 정하는 규칙(오너 결정 사항).
 * 컴포넌트 안에서만 통하는 규칙(Toast 길이, Tooltip 용처 등)은 **여기서 다시 정의하지 않는다** —
 * 각 컴포넌트 문서로 링크만 건다. 중복 정의는 두 문서가 갈라지는 지름길이다.
 */

/* '이 페이지가 정하는 것' 하위에 있던 섹션 개요 목록(SCOPE_HERE)은 2026-08-25 삭제 —
   우측 목차가 같은 구조를 이미 보여줘서 첫 화면에서 두 번 말하는 꼴이었다. 절에는 소개 문단과
   컴포넌트 경계 안내 바만 남는다. */



export interface Principle {
  n: string;
  title: string;
  desc: string;
  good: string;
  bad: string;
}

export const PRINCIPLES: Principle[] = [
  {
    n: '01',
    title: '결론이 먼저예요',
    desc: '사용자가 알아야 할 결과를 첫 문장에 둬요. 원인과 배경은 그다음이에요.',
    good: 'PDF로 변환하지 못했어요. 암호가 걸린 문서는 변환할 수 없어요',
    bad: '문서에 암호가 설정되어 있어 변환 처리 과정에서 오류가 발생했습니다',
  },
  {
    n: '02',
    title: '한 화면엔 한 목소리',
    desc: '같은 화면에 함께 뜨는 문구는 어미를 맞춰요. 모달과 그 위에 겹치는 토스트도 한 화면이에요.',
    good: '문서를 저장했어요 / 공유 링크를 복사했어요',
    bad: '문서를 저장했어요 / 공유 링크가 클립보드에 복사되었습니다',
  },
  {
    n: '03',
    title: '사용자를 탓하지 않아요',
    desc: '문장의 주어를 사용자로 만들지 않아요. 무엇이 안 되는지만 말하고 판단은 붙이지 않아요.',
    good: '올릴 수 없는 형식이에요. docx · hwp · pdf만 올릴 수 있어요',
    bad: '잘못된 형식의 파일을 선택하셨습니다',
  },
  {
    n: '04',
    title: '막다른 문구를 만들지 않아요',
    desc: '문제만 알리고 끝내지 않아요. 사용자가 지금 할 수 있는 일을 한 가지는 남겨요.',
    good: '저장하지 못했어요. 연결을 확인하고 다시 시도해 주세요',
    bad: '저장 실패',
  },
  {
    n: '05',
    title: '확인한 것만 말해요',
    desc: '시스템이 확인하지 않은 상태를 사실처럼 쓰지 않아요. 정확성·완전성을 주장하는 표현이 대표적이에요.',
    good: 'AI가 요약했어요. 중요한 내용은 원문과 비교해 주세요',
    bad: '문서의 핵심을 정확하게 요약했어요',
  },
  {
    n: '06',
    title: '길어지면 그릇을 바꿔요',
    desc: '문구를 억지로 줄이는 대신 컴포넌트를 바꾸는 게 답일 때가 많아요. 어떤 그릇에 무엇이 들어가는지는 각 컴포넌트 문서가 정해요.',
    good: '변환 옵션 설명 3문단 → 팝업 대신 도움말 페이지로 분리',
    bad: '토스트 한 줄에 원인 · 해결 방법 · 문의처를 모두 넣기',
  },
];

export interface SentenceRule {
  rule: string;
  desc: string;
  good: string;
  bad: string;
}

/**
 * 문장 다듬기 5종 — 2026-08-25 seed-design.io/foundations/writing 과 대조해 우리에게 없던 항목을 채운 것.
 * 전부 한국어 UI 에서 자주 나오는 실수라 '표기'보다 '문장' 층위에 둔다.
 */
export const SENTENCE_RULES: SentenceRule[] = [
  {
    rule: '쉬운 단어로',
    desc: '한자어·기술 용어 대신 일상어를 써요.',
    good: '문서를 열 수 없어요',
    bad: '문서 열람이 불가능합니다',
  },
  {
    rule: '존댓말은 어미까지만',
    desc: '해요체로 이미 존대가 돼요. 어미에 존칭을 겹쳐 넣지 않아요.',
    good: '문서를 10개까지 만들 수 있어요',
    bad: '문서를 10개까지 만드실 수 있어요',
  },
  {
    rule: '긍정문 먼저',
    desc: '같은 뜻이면 할 수 있는 쪽으로 써요. 금지형은 정말 금지일 때만 써요.',
    good: '이름은 한 달에 한 번만 바꿀 수 있어요',
    bad: '이름은 한 달에 한 번 넘게 바꿀 수 없어요',
  },
  {
    rule: '능동문 먼저',
    desc: '이중 피동은 특히 피해요. 다만 피동이 뜻을 더 정확히 전할 땐 피동을 써요.',
    good: '변경 내용을 저장했어요',
    bad: '변경 내용이 저장되어졌어요',
  },
  {
    rule: '상태값은 붙여 쓰기',
    desc: '화면에 찍히는 상태 이름은 붙이고, 문장 안에서 서술할 때는 띄어요.',
    good: '「편집중」 / 편집 중일 때는 내보낼 수 없어요',
    bad: '「편집 중」 / 편집중일 때는 내보낼 수 없어요',
  },
];

export interface ToneRow {
  situation: string;
  tone: string;
  good: string;
  bad: string;
}

/**
 * 상황별 톤 — **저장소에 근거가 있는 2행만** 둔다 (2026-08-25 결정).
 *
 * 처음 초안에는 7행(평상 편집·성공 알림·AI·결제·B2B 관리자 …)이 있었는데 전부 창작이었다.
 * 결제·구독은 범위에서 제외했고, 나머지는 근거가 없어 걷어냈다 — 특히 'B2B 관리자 화면'은
 * 제품에 해당 문서가 0건이라 검증할 방법이 없었다. 실제 제품 문구가 쌓이면 그때 근거로 늘린다.
 *
 * 남긴 2행의 출처:
 *  · 오류 — components/input/input.data.ts:57 '에러 발생 시 구체적인 원인을 Error Message로 안내'
 *  · 되돌릴 수 없는 동작 — components/popup/popup.data.ts:20 샘플 '삭제된 데이터는 복구할 수 없습니다'
 */
export const TONE_ROWS: ToneRow[] = [
  {
    situation: '오류 · 데이터 손실 위험',
    tone: '원인 + 다음 행동',
    good: '저장하지 못했어요. 연결을 확인해 주세요',
    bad: '문제가 발생했습니다',
  },
  {
    situation: '되돌릴 수 없는 동작',
    tone: '결과를 먼저',
    good: '삭제하면 되돌릴 수 없어요',
    bad: '정말요?',
  },
];

export interface StyleRow {
  place: string;
  rule: string;
  example: string;
}

export const STYLE_ROWS: StyleRow[] = [
  { place: '안내 · 설명', rule: '해요체 서술', example: '변경한 내용은 자동으로 저장돼요' },
  { place: '완료 · 실패 알림', rule: '해요체 과거형', example: '링크를 복사했어요' },
  { place: '사용자에게 요청', rule: '~해 주세요', example: '8자 이상 입력해 주세요' },
  { place: '절차 안내', rule: '~하세요', example: '저장한 뒤 다시 시도하세요' },
  { place: '법적 · 보안 고지', rule: '합니다체', example: '이 작업은 감사 기록에 남습니다' },
  { place: '문서 사이트 산문', rule: '해요체', example: '(이 페이지)' },
];

export interface PunctRow {
  mark: string;
  use: string;
  example: string;
}

export const PUNCT_ROWS: PunctRow[] = [
  { mark: '·', use: '병렬 나열 (쉼표보다 먼저)', example: 'docx · hwp · pdf' },
  { mark: '—', use: '문장 뒤 부연 (앞뒤 공백)', example: '삭제했어요 — 30일 안에는 되돌릴 수 있어요' },
  { mark: '–', use: '숫자 범위 전용', example: '1–2줄, 02:00–04:00' },
  { mark: '「」', use: '화면에 찍히는 UI 레이블 인용', example: '「저장 안 함」을 누르면 변경 내용이 사라져요' },
  { mark: '" "', use: '사용자 발화 · 개념 인용', example: '"이 문서 요약해 줘"' },
  { mark: '예)', use: '예시 도입', example: '예) 2026. 8. 30.' },
  { mark: '!', use: '쓰지 않아요', example: '—' },
];

export interface NumberRow {
  item: string;
  rule: string;
  example: string;
}

export const NUMBER_ROWS: NumberRow[] = [
  { item: '단위', rule: '숫자에 붙여 쓰기', example: '150ms, 60%, 12.4MB' },
  { item: '치수', rule: '곱셈기호 ×', example: '21×21px' },
  { item: '범위', rule: 'en dash', example: '2–5개, 360–767px' },
  { item: '천 단위', rule: '쉼표', example: '3,000ms' },
  { item: '개수', rule: '아라비아 숫자 + 개 · 종 · 단계', example: '문서 12개' },
  { item: '날짜 (본문)', rule: '~월 ~일', example: '8월 30일에 갱신돼요' },
  { item: '날짜 (목록 · 메타데이터)', rule: 'YYYY. M. D.', example: '2026. 8. 30.' },
  { item: '시각', rule: '24시간 HH:MM', example: '02:00–04:00' },
  { item: '용량', rule: '소수 첫째 자리까지', example: '12.4MB / 1.2GB' },
];

/** 에러 문구 3조각 템플릿의 실제 적용 예 — 세 조각이 모두 보이는 것만 싣는다 */
export const ERROR_CASES: { situation: string; copy: string }[] = [
  { situation: '저장 실패 (오프라인)', copy: '저장하지 못했어요. 연결이 끊겼어요 — 연결되면 자동으로 다시 저장해요.' },
  { situation: '동시 편집 충돌', copy: '다른 사람이 먼저 저장했어요. 내 변경 내용은 사본으로 저장할 수 있어요.' },
  { situation: '변환 실패 (암호 문서)', copy: 'PDF로 변환하지 못했어요. 암호가 걸린 문서예요 — 암호를 풀고 다시 시도해 주세요.' },
  { situation: '용량 초과', copy: '파일이 너무 커요. 한 번에 100MB까지 올릴 수 있어요 — 나눠서 올려 주세요.' },
  { situation: 'AI 요약 실패', copy: '요약을 만들지 못했어요. 문서는 그대로예요 — 잠시 뒤 다시 시도해 주세요.' },
];

export const AI_USAGE = {
  do: [
    '결과에 검토 여지 남기기: AI가 요약했어요. 중요한 내용은 원문과 비교해 주세요',
    '대기 중 무엇을 하는지 밝히기: 문서를 읽고 있어요',
    '실패 시 원본이 무사함을 알리기: 요약을 만들지 못했어요. 문서는 그대로예요',
    '사용자가 고르게 두기: 이 문단으로 바꿀까요?',
  ],
  dont: [
    '정확성 · 완전성을 단정하기: 정확하게 요약했어요',
    'AI를 사람처럼 말하게 하기: 제가 도와드릴게요',
    'AI가 한 일을 사용자가 한 것처럼 적기: 문서를 정리하셨어요',
    'AI가 아닌 기능에 AI 어휘 · 보라색 쓰기',
  ],
} as const;

export interface TermRow {
  use: string;
  avoid: string;
  note: string;
}

/** 용어 사전 — 2026-08-25 오너 확정: '요금제', '사용자' 채택 */
export const TERM_ROWS: TermRow[] = [
  { use: '문서', avoid: '파일 (사용자 콘텐츠를 가리킬 때)', note: '사람이 만들고 편집하는 것' },
  { use: '파일', avoid: '도큐먼트', note: '업로드 · 다운로드 대상' },
  { use: '저장', avoid: '세이브, 적용', note: '문서 상태를 남기는 동작' },
  { use: '공유', avoid: '퍼블리싱', note: '링크로 접근 권한을 여는 것' },
  { use: '초대', avoid: '사용자 추가', note: '사람을 지정해 권한을 주는 것' },
  { use: '내보내기', avoid: '익스포트', note: '다른 형식으로 꺼내는 것' },
  { use: '변환', avoid: '컨버팅', note: '형식이 바뀌는 것. 예) PDF로 변환' },
  { use: '휴지통', avoid: '삭제된 항목', note: '되돌릴 수 있는 삭제 보관함' },
  { use: '요금제', avoid: '플랜, 상품', note: '구독 등급' },
  { use: '사용자', avoid: '멤버, 유저', note: 'B2B 관리자 화면의 구성원' },
  { use: '용량', avoid: '저장공간, 스토리지', note: '쓰고 남은 양' },
  { use: '버전 기록', avoid: '히스토리', note: '이전 상태 목록' },
  { use: 'AI 요약', avoid: '자동 요약, 스마트 요약', note: 'AI 기능 이름' },
];

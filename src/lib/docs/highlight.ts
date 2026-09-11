import type { ReactNode } from 'react';

/**
 * 코드 하이라이팅 이음매 — **v1 은 항등함수**(하이라이팅 없음).
 *
 * 하이라이터를 안 넣은 이유:
 * · shiki 는 듀얼 테마가 `.dark` 클래스/미디어쿼리 기준이라 이 앱의 `html[data-theme]` 규약과
 *   싸운다. PORTING-NOTES §2 가 바로 그 셀렉터 불일치(원본에서 다크 토큰이 한 번도 발동 못 한
 *   원인)를 고친 기록이라, 같은 함정을 다시 들이지 않는다.
 * · prism·highlight.js 는 **변하지 않는 텍스트**를 위해 15~40KB 를 영구히 클라이언트에 싣는다.
 * · 스니펫이 짧고 우리가 직접 쓴 것들이라 색이 주는 이득이 작다.
 *
 * 색이 필요해지면 이 함수만 바꾸면 된다 — 서버에서 도는 순수 함수이므로, 60줄짜리 토크나이저로
 * `<span className={s.tokKeyword}>` 를 뱉고 `--docs-*` 토큰으로 칠하면 다크는 공짜로 따라온다.
 * 호출부(CodePanel)는 그대로 둔다.
 */
export function highlight(code: string): ReactNode {
  return code;
}

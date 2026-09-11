import type { Metadata } from 'next';
import Link from 'next/link';
import { H2, H3, H4 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import InfoNote from '@/components/docs/InfoNote';
import SpecTable, { SpecVal } from '@/components/docs/SpecTable';
import UsageGrid from '@/components/docs/UsageGrid';
import { pageMeta } from '@/lib/docs/pages';
import {
  AI_USAGE,
  ERROR_CASES,
  NUMBER_ROWS,
  PRINCIPLES,
  PUNCT_ROWS,
  SENTENCE_RULES,
  STYLE_ROWS,
  TERM_ROWS,
  TONE_ROWS,
} from './writing.data';
import s from './writing.module.css';

const meta = pageMeta('/foundation/writing')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * `/foundation/writing` — UX Writing. 2026-08-25 신설.
 *
 * 파운데이션에 두는 이유: 문구 기준은 색·타이포처럼 전 컴포넌트에 공통으로 걸리는 층위다.
 * Typography 가 '글자의 모양'을 정하니 그다음이 '글자의 내용' 자리다.
 *
 * ⚠️ 컴포넌트 안에서만 통하는 규칙(토스트 길이·툴팁 용처 등)을 여기에 옮겨 적지 않는다 —
 *    두 문서가 갈라진다. 경계는 첫 섹션의 표가 정하고, 나머지는 링크로 넘긴다.
 * ⚠️ 이 페이지 자체가 자기 규칙의 예시다 — 본문은 해요체로만 쓴다.
 */
export default function WritingPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        어떤 컴포넌트를 쓸지 토큰과 스펙이 정한다면, 그 안에 들어갈 말을 고르는 기준은 이 페이지가 정해요.
        토스트 길이나 팝업 제목 문형처럼 컴포넌트 안에서만 통하는 규칙은 각 컴포넌트 문서에 있어요.
      </PageLead>

      <H2>쓰기 기준</H2>
      <p>
        무엇을 말하고(원칙), 어떻게 쓰고(문장), 어떤 결로 말할지(톤)를 정해요. 개별 문구를 쓰기 전에 한 번
        읽어 두는 층이에요.
      </p>

      <H3>원칙</H3>
      <p>
        원칙에는 번호와 이름을 붙였어요. 리뷰 자리에서 &quot;3번을 어겼어요&quot;처럼 근거로 부를 수 있게
        하려는 거예요.
      </p>
      <SpecTable
        caption="여섯 가지 라이팅 원칙"
        columns={[
          { key: 'principle', header: '원칙', width: '32%' },
          { key: 'good', header: '✓ 이렇게', width: '34%' },
          { key: 'bad', header: '✗ 이러지 않기', width: '34%' },
        ]}
        rows={PRINCIPLES.map((p) => ({
          principle: (
            <>
              <span className={s.principleNum}>{p.n}</span>
              <strong className={s.principleTitle}>{p.title}</strong>
              <span className={s.principleDesc}>{p.desc}</span>
            </>
          ),
          good: p.good,
          bad: <span className={s.badCell}>{p.bad}</span>,
        }))}
      />

      <H3>문장</H3>
      <p>
        원칙이 &apos;무엇을 말할까&apos;라면 여기는 &apos;어떻게 쓸까&apos;예요. 아래 다섯 가지는 한국어
        UI에서 가장 자주 나오는 실수라, 표기를 맞추기 전에 먼저 걸러요.
      </p>
      <SpecTable
        caption="문장 다듬기 규칙"
        columns={[
          { key: 'rule', header: '규칙', width: '30%' },
          { key: 'good', header: '✓ 이렇게', width: '35%' },
          { key: 'bad', header: '✗ 이러지 않기', width: '35%' },
        ]}
        rows={SENTENCE_RULES.map((r) => ({
          rule: (
            <>
              <strong className={s.principleTitle}>{r.rule}</strong>
              <span className={s.principleDesc}>{r.desc}</span>
            </>
          ),
          good: r.good,
          bad: <span className={s.badCell}>{r.bad}</span>,
        }))}
      />
      <InfoNote>
        규칙보다 좋은 문장이 먼저예요. 능동문보다 피동문이 뜻을 더 정확히 전한다면 피동문을 쓰면 돼요.
        규칙은 판단을 대신하는 게 아니라 판단이 갈릴 때 기준을 주는 거예요.
      </InfoNote>

      <H3>보이스와 톤</H3>
      <p>
        목소리는 하나, 사용자의 일을 방해하지 않는 <strong>동료의 말투</strong>예요. 다만 사용자가 놓인
        상황에 따라 톤은 달라져요. 우리 제품은 사용자가 자기 일에 몰입한 편집 도구라서, 재치보다 예측
        가능성이 먼저예요.
      </p>
      <InfoNote>
        아래 두 상황은 컴포넌트 문서에 이미 근거가 있어서 먼저 적었어요. 오류 문구는{' '}
        <Link href="/components/input">Input Field</Link>가, 되돌릴 수 없는 동작은{' '}
        <Link href="/components/popup">Popup</Link>이 각각 규칙을 갖고 있어요. 나머지 상황은 실제 제품
        문구가 쌓이는 대로 근거와 함께 늘려요.
      </InfoNote>
      <SpecTable
        caption="상황별 톤"
        columns={[
          { key: 'situation', header: '상황', width: '22%' },
          { key: 'tone', header: '톤', width: '18%' },
          { key: 'good', header: '이렇게', width: '30%' },
          { key: 'bad', header: '이러지 않기', width: '30%' },
        ]}
        rows={TONE_ROWS.map((r) => ({
          situation: <strong>{r.situation}</strong>,
          tone: r.tone,
          good: r.good,
          bad: <span className={s.badCell}>{r.bad}</span>,
        }))}
      />
      <InfoNote>
        결제·구독 문구는 이 페이지 범위 밖이에요. 오작문 시 법적 책임이 따르고, 개인 결제와 B2B 청구는
        대상도 정보량도 달라서 별도로 다뤄야 해요.
      </InfoNote>

      <H2>표기 규칙</H2>
      <p>
        해외 디자인 시스템의 문법 절은 대문자·축약형 규칙이 알맹이라 한국어에 그대로 옮겨지지 않아요. 이
        절은 우리가 직접 정한 기준이에요.
      </p>

      <H3>문체</H3>
      <p>
        제품 UI와 문서 모두 <strong>해요체가 기본</strong>이에요. 법적·보안 고지처럼 격식이 필요한 자리만
        합니다체를 써요.
      </p>
      <SpecTable
        caption="자리별 문체"
        columns={[
          { key: 'place', header: '자리', width: '28%' },
          { key: 'rule', header: '기준', width: '30%' },
          { key: 'example', header: '예', width: '42%' },
        ]}
        rows={STYLE_ROWS.map((r) => ({ place: r.place, rule: <strong>{r.rule}</strong>, example: r.example }))}
      />
      <InfoNote>
        지금 문서에는 합니다체 산문이 더 많아요(실측 기준 합니다체가 해요체의 약 2배). 이 기준을 세운
        시점이 2026년 8월이라, 그 전에 쓴 문서는 순차로 고쳐 나가요.
      </InfoNote>
      <p>
        호칭은 쓰지 않아요. &quot;고객님&quot;·&quot;회원님&quot; 없이 주어를 생략하고, 서비스를
        &quot;저희&quot;로 부르지 않아요.
      </p>

      <H3>문장부호</H3>
      <SpecTable
        caption="문장부호 용법"
        columns={[
          { key: 'mark', header: '기호', width: '12%' },
          { key: 'use', header: '용도', width: '40%' },
          { key: 'example', header: '예', width: '48%' },
        ]}
        rows={PUNCT_ROWS.map((r) => ({ mark: <SpecVal>{r.mark}</SpecVal>, use: r.use, example: r.example }))}
      />
      <UsageGrid
        do={[
          '명사구 목록 항목은 마침표 없이 끝내기',
          '화면에 나가는 완결 문장은 마침표로 끝내기 (단, 표·목록 안의 짧은 예시는 표기라서 생략해요)',
          '파일명·토큰명은 코드 표기로 감싸기',
        ]}
        dont={['링크 텍스트나 문장 전체를 통째로 굵게 처리', '파일명·토큰명을 따옴표로 감싸기', '느낌표로 감정 얹기']}
      />

      <H3>숫자 · 날짜 · 단위</H3>
      <SpecTable
        caption="숫자와 단위 표기"
        columns={[
          { key: 'item', header: '항목', width: '26%' },
          { key: 'rule', header: '기준', width: '34%' },
          { key: 'example', header: '예', width: '40%' },
        ]}
        rows={NUMBER_ROWS.map((r) => ({ item: r.item, rule: r.rule, example: <SpecVal>{r.example}</SpecVal> }))}
      />

      <H3>영문</H3>
      <UsageGrid
        do={[
          'PDS 고유 이름(컴포넌트 · variant · 상태)은 영문 그대로: Primary, Fill, Selected',
          '일반 UI 개념은 한글로: 배경, 버튼, 상태, 레이블',
          '레이블 없는 아이콘 버튼에는 화면 문구와 같은 말로 접근 이름 지정',
        ]}
        dont={[
          "같은 대상을 한 화면에서 '토스트'와 'Toast'로 번갈아 쓰기",
          '한 문장 안에서 영문 조사 처리를 섞기 (붙여 쓰든 띄어 쓰든 문서 안에서 통일)',
        ]}
      />

      <H2>상황별 문구</H2>
      <p>실제 화면에서 자주 마주치는 자리들이에요. 위의 기준을 이 자리에 적용한 결과라고 보면 돼요.</p>

      <H3>상태 메시지</H3>
      <p>
        화면을 만들 때 성공 화면만 만들고 끝내지 않아요. 목록·데이터 화면에는 빈 상태와 에러 상태 문구가
        함께 있어야 해요.
      </p>

      <H4>에러</H4>
      <p>
        <strong>무엇이 일어났는지 → 왜 → 다음에 무엇을 할지</strong> 순서로 써요. 세 번째 조각이 없으면
        원칙 04를 어긴 거예요. 원인을 구체적으로 알려 주는 건{' '}
        <Link href="/components/input">Input Field</Link> 문서의 규칙이기도 해요.
      </p>
      <SpecTable
        caption="에러 문구 예시"
        columns={[
          { key: 'situation', header: '상황', width: '26%' },
          { key: 'copy', header: '문구', width: '74%' },
        ]}
        rows={ERROR_CASES.map((r) => ({ situation: r.situation, copy: r.copy }))}
      />

      <H4>빈 상태와 로딩</H4>
      <p>
        <strong>지금 왜 비어 있는지 → 무엇을 하면 채워지는지</strong>. 첫 사용과 검색 결과 없음은 다른
        문구예요. 첫 사용은 시작을 권하고, 검색 결과 없음은 조건을 바꾸도록 안내해요.
      </p>
      <UsageGrid
        do={[
          '첫 사용: 아직 문서가 없어요. 새 문서를 만들어 시작해 보세요',
          "검색 결과 없음: '분기 보고서'와 일치하는 문서가 없어요. 다른 검색어로 찾아보세요",
          '권한 없음: 이 폴더를 볼 권한이 없어요. 소유자에게 요청할 수 있어요',
        ]}
        dont={['빈 화면에 문구 없이 일러스트만 두기', '검색 결과 없음에 첫 사용 문구를 그대로 쓰기']}
      />
      <p>
        아직 채워지는 중이라면 기다림이 1초를 넘을 때 무엇을 하고 있는지 밝혀요. 「로딩중」보다 「문서를
        읽고 있어요」가 같은 시간을 짧게 느끼게 해요.
      </p>

      <H3>AI 기능</H3>
      <p>
        보라색이 AI 전용 신호색인 것처럼, AI 문구도 AI 기능의 진입·실행·결과에만 써요. 사용자가 결과를 검토할
        여지를 남기는 게 이 영역의 기본이에요.
      </p>
      <UsageGrid do={[...AI_USAGE.do]} dont={[...AI_USAGE.dont]} />

      <H3>용어 사전</H3>
      <p>
        같은 개념을 화면마다 다르게 부르면 학습 비용이 바로 생겨요. 왼쪽 말만 써요. 이 표는 i18n 키를 지을
        때도 그대로 기준이 돼요.
      </p>
      <SpecTable
        caption="제품 용어 사전"
        columns={[
          { key: 'use', header: '쓰는 말', width: '20%' },
          { key: 'avoid', header: '쓰지 않는 말', width: '34%' },
          { key: 'note', header: '구분 기준', width: '46%' },
        ]}
        rows={TERM_ROWS.map((r) => ({
          use: <strong>{r.use}</strong>,
          avoid: <span className={s.badCell}>{r.avoid}</span>,
          note: r.note,
        }))}
      />
      <InfoNote>
        한 흐름 안에서는 같은 대상을 같은 말로 불러요. 버튼은 「내보내기」인데 안내 문구만
        「다운로드」로 갈라 쓰지 않아요.
      </InfoNote>
    </>
  );
}

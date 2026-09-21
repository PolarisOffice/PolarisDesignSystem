import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import { H2 } from '@/components/docs/Heading';
import { CHANGELOG, type ChangelogEntry } from '@/lib/docs/changelog';
import s from './changelog.module.css';
import { pageMeta } from '@/lib/docs/pages';

const meta = pageMeta('/changelog')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * 절 제목은 버전만 — 앵커(`_1-1-0`)가 발행일을 채워도 안 바뀌게. 날짜는 제목 아래 한 줄.
 * 추가/변경/수정은 헤딩이 아니라 굵은 라벨 — 버전마다 반복되는 텍스트가 목차·앵커 규약
 * (같은 텍스트 헤딩은 명시 id)과 부딪히고 목차만 길어진다. AI Integration 의 라벨 문단과 같은 문법.
 */
const SECTIONS: { key: keyof Pick<(typeof CHANGELOG)[number], 'added' | 'changed' | 'fixed'>; label: string }[] = [
  { key: 'added', label: '추가' },
  { key: 'changed', label: '변경' },
  { key: 'fixed', label: '수정' },
];

/** x.y.0(첫 발행·minor)만 내용을 펼친다 — patch 는 버전·날짜만 남기고 내용은 접는다(2026-09-18) */
const isMajorOrMinor = (v: string) => v.split('.')[2] === '0';

/** 연속된 patch 항목을 한 덩어리로 묶는다 — 내림차순 그대로 */
type Group = { kind: 'full'; entry: ChangelogEntry } | { kind: 'patches'; entries: ChangelogEntry[] };
const groups: Group[] = [];
for (const entry of CHANGELOG) {
  if (isMajorOrMinor(entry.version)) groups.push({ kind: 'full', entry });
  else {
    const last = groups[groups.length - 1];
    if (last?.kind === 'patches') last.entries.push(entry);
    else groups.push({ kind: 'patches', entries: [entry] });
  }
}

function Details({ entry }: { entry: ChangelogEntry }) {
  return SECTIONS.map(({ key, label }) => {
    const items = entry[key];
    if (!items?.length) return null;
    return (
      <div key={key}>
        {/* 눈썹 라벨 — 항목(14 본문)보다 작고 흐리게. 종전 14/600 굵은 문단은 항목과 층이 안 나뉘었다(2026-09-18) */}
        <p className={s.eyebrow}>{label}</p>
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  });
}

/**
 * 변경 이력 — changelog.ts 를 버전 내림차순으로 그린다(2026-09-18 신설).
 * 날짜가 없는 항목은 아직 발행 전(release:pds 가 채운다)이라 그렇게 표시한다.
 * 첫 발행·minor(x.y.0)만 절로 펼치고, 사이의 patch 들은 한 덩어리로 접어 버전·날짜만 보인다 —
 * 값 하나 고친 릴리스까지 다 펼치면 새 컴포넌트가 묻힌다(사용자 결정). 접힌 안엔 내용이 그대로 있다.
 */
export default function ChangelogPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        <code>@polarisoffice/pds-react</code> 버전별 변경 사항이에요. 푸터 업데이트 날짜와 New 표시가 이 이력을 따라요.
      </PageLead>

      {groups.map((g) =>
        g.kind === 'full' ? (
          <section key={g.entry.version}>
            <H2>{g.entry.version}</H2>
            {/* 제목에 딸린 메타 — 문단이 아니라 12px 흐린 글자로 제목 바로 아래 */}
            <p className={s.meta}>{g.entry.date ? `${g.entry.date} 발행` : '발행 준비 중(다음 릴리스에 나갑니다)'}</p>
            <Details entry={g.entry} />
          </section>
        ) : (
          <details key={g.entries[0].version} className={s.patches}>
            <summary className={s.patchesSummary}>
              {g.entries[g.entries.length - 1].version} – {g.entries[0].version} · 패치 릴리스 {g.entries.length}건
            </summary>
            {g.entries.map((entry) => (
              <div key={entry.version} className={s.patch}>
                <p className={s.patchHead}>
                  <strong>{entry.version}</strong> <span className={s.meta}>{entry.date ?? '발행 준비 중'}</span>
                </p>
                <Details entry={entry} />
              </div>
            ))}
          </details>
        ),
      )}
    </>
  );
}

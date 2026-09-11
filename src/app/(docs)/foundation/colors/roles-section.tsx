import { Fragment } from 'react';
import { H2, H3 } from '@/components/docs/Heading';
import SpecTable, { SpecToken, SpecVal } from '@/components/docs/SpecTable';
import { PROP_BADGES, PROP_LABEL, PROPERTY_ROWS, ROLE_SECTIONS, VARIANT_ROWS } from './color-roles.data';
import { PALETTE_FAMILIES } from './palette.data';
import s from './color-roles.module.css';

/**
 * 구 `/foundation/color-roles` 페이지의 본문 — 2026-08-19 Color 개요와 한 페이지로 병합
 * (개요/Roles 역할 구분이 독자에게 혼란이라는 결정). 헤딩 텍스트·구조는 그대로라 앵커 id 불변,
 * 구 URL 은 next.config 308 로 이 페이지에 온다. 렌더는 seed 문법(표)으로 통일.
 */
export function RolesSection() {
  return (
    <>
      <H2>Property</H2>
      <p>토큰명에 속성이 명시되어 있지 않지만, 각 카테고리는 아래 세 가지 속성 중 하나에 대응해요.</p>
      <ul className={s.propLegend}>
        {PROP_BADGES.map((b) => (
          <li key={b.kind}>{b.label}</li>
        ))}
      </ul>
      <SpecTable
        columns={[
          { key: 'category', header: '카테고리', width: '24%' },
          { key: 'prop', header: '속성', width: '18%' },
          { key: 'desc', header: '설명', width: '58%' },
        ]}
        rows={PROPERTY_ROWS.map((r) => ({
          category: r.categories.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && ', '}
              <SpecToken>{c}</SpecToken>
            </Fragment>
          )),
          prop: <strong>{r.prop}</strong>,
          desc: r.desc,
        }))}
      />

      <H2>Role</H2>
      {ROLE_SECTIONS.map((sec) => (
        <section key={sec.heading}>
          <H3>{sec.heading}</H3>
          <p className={s.roleIntro}>{sec.intro}</p>
          {sec.groups.map((g) => (
            <div key={g.name} className={s.roleGroup}>
              <div className={s.roleGroupHead}>
                <span className={s.roleGroupName}>{g.name}</span>
                {g.desc && <span className={s.roleGroupDesc}>{g.desc}</span>}
              </div>
              <SpecTable
                caption={`${g.name} 토큰`}
                columns={[
                  { key: 'token', header: '토큰', width: '36%' },
                  { key: 'value', header: '값', width: '20%' },
                  { key: 'desc', header: '설명', width: '34%' },
                  { key: 'prop', header: '속성', width: '10%' },
                ]}
                rows={g.tokens.map((t) => ({
                  token: (
                    <>
                      <SpecToken>{t.name}</SpecToken>
                      <span className={s.roleCss}>{t.css}</span>
                    </>
                  ),
                  value: (
                    <span className={s.val}>
                      {/* #ffffff 만 라인 — 흰 칩은 표 배경과 붙어 라인 없이는 안 보인다 */}
                      <span
                        className={isWhiteHex(t.swatch) ? `${s.chip} ${s.chipBordered}` : s.chip}
                        style={{ background: t.swatch }}
                        aria-hidden="true"
                      />
                      <SpecVal>{t.hex}</SpecVal>
                    </span>
                  ),
                  desc: t.desc,
                  prop: t.label ?? PROP_LABEL[t.prop],
                }))}
              />
            </div>
          ))}
        </section>
      ))}

      <H2>Variant (변형)</H2>
      <p>같은 역할이라도 강조 강도에 따라 단계가 나뉘어요.</p>
      <SpecTable
        columns={[
          { key: 'category', header: '카테고리', width: '20%' },
          { key: 'steps', header: '단계 (약함 → 강함)', width: '45%' },
          { key: 'note', header: '비고', width: '35%' },
        ]}
        rows={VARIANT_ROWS.map((r) => ({
          category: <SpecToken>{r.category}</SpecToken>,
          steps: r.steps,
          note: r.note,
        }))}
      />
    </>
  );
}

/** #ffffff/#fff 판별 — 흰 칩만 라인을 받는다 (2026-08-28 요청) */
function isWhiteHex(hex: string): boolean {
  return /^#(?:fff|ffffff)$/i.test(hex.trim());
}

/**
 * Primitive 팔레트 — seed 의 Palette 탭처럼 패밀리별 단계 스케일 + Tokens 표.
 * 2026-08-28 Figma Variables 전량(15패밀리 134값) 반영 — 변수명·참조는 데이터가 들고 온다
 * (palette.data.ts 헤더 참고, 이름 파생 함수는 폐기).
 */
export function PaletteSection() {
  return (
    <>
      <H2>Palette (Primitive)</H2>
      <div className={s.palList}>
        {PALETTE_FAMILIES.map((f) => (
          <div key={f.title} className={s.palFamily}>
            <div className={s.palName}>{f.title}</div>
            <div className={s.palSteps}>
              {f.swatches.map((sw) => (
                <div key={sw.step} className={s.palStep} title={`${f.title} ${sw.step} · ${sw.hex}`}>
                  <span
                    className={sw.bordered ? `${s.palTile} ${s.palTileBordered}` : s.palTile}
                    style={{ background: sw.hex }}
                  />
                  <span className={s.palLabel}>{sw.step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <H3>Tokens</H3>
      <p>
        Primitive 변수명과 값, 그리고 그 값을 참조하는 Semantic 토큰이에요. 참조가 없는 원시값은
        아직 Semantic 계층에 배선되지 않은 예비 색상이에요.
      </p>
      <SpecTable
        caption="Primitive 팔레트 토큰"
        columns={[
          { key: 'name', header: '이름', width: '36%' },
          { key: 'value', header: '값', width: '22%' },
          { key: 'ref', header: '참조하는 Semantic 토큰', width: '42%' },
        ]}
        rows={PALETTE_FAMILIES.flatMap((f) =>
          f.swatches.map((sw) => ({
            name: <SpecToken>{sw.cssVar}</SpecToken>,
            value: (
              <span className={s.val}>
                <span
                  className={sw.bordered ? `${s.chip} ${s.chipBordered}` : s.chip}
                  style={{ background: sw.hex }}
                  aria-hidden="true"
                />
                <SpecVal>{sw.hex}</SpecVal>
              </span>
            ),
            ref: sw.refs.length ? (
              sw.refs.map((r, i) => (
                <Fragment key={r}>
                  {i > 0 && ' '}
                  <SpecToken>{r}</SpecToken>
                </Fragment>
              ))
            ) : (
              <span className={s.palNoRef}>—</span>
            ),
          })),
        )}
      />
    </>
  );
}

import type { Metadata } from 'next';
import { H2 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import SpecTable from '@/components/docs/SpecTable';
import { pageMeta } from '@/lib/docs/pages';
import { SIZE_VARIATIONS } from './iconography.data';
import GridIllustration from './GridIllustration';
import s from './iconography.module.css';
import { withBase } from '@/lib/basePath';

const meta = pageMeta('/foundation/iconography')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/**
 * 원본: PDS `docs/foundation/iconography.md`.
 *
 * 삽화는 **Figma 정본 렌더**다 (2026-08-28 디자인팀장 검토 — "피그마 파일에 있는 이미지로
 * 적용해주세요. 현재 가이드페이지 이미지는 설명과 매치되지 않음"). 구 손그림 SVG(키라인
 * 오류·스트로크 미물림·라운드 부재)는 폐기하고 파운데이션 캔버스(0:1)의 Iconography 프레임을
 * 원본 해상도로 잘라 public/iconography/ 에 두었다 — Figma 쪽 개정 시 같은 프레임에서 다시
 * 추출해 교체할 것(파일명 유지).
 */
export default function IconographyPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      {/* 원본 리드는 영어("Icons are visual representations of …") — 다른 페이지와 맞춰 한국어로 (2026-08-19) */}
      <PageLead>아이콘은 명령, 기능, 디렉터리, 자주 쓰는 동작을 시각적으로 나타내는 기호예요.</PageLead>

      <H2>Style</H2>
      <p className={s.sectionDesc}>
        아이콘은 명료함, 일관성, 중립성을 지향해요. 전체적으로 생동한 이미지를 위해 모서리 부분이
        둥근 것이 특징이에요.
      </p>
      {/* 아이콘 스타일 프리뷰 (2026-08-28 검토 반영, 참고: seed iconography) —
          Figma 아이콘 세트 정본(1252:1667)을 3배 해상도로 내려받아 투명 배경 + 흰 획으로
          가공(하단 두 줄 컷). 파란 면은 이미지가 아니라 diagramWrapBlue 가 소유한다 */}
      <div className={`${s.diagramWrap} ${s.diagramWrapBlue}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={s.figmaIllus}
          src={withBase('/iconography/style-icons.png')}
          alt="PDS 기본 아이콘 세트 미리보기"
          width={790}
          height={359}
        />
      </div>

      <H2>Grid</H2>
      <p className={s.sectionDesc}>
        Grid는 24x24px를 기본으로 하며, 크기 및 목적에 따라 조정될 수 있어요.
      </p>
      {/* 인라인 SVG + 토큰 색 — 구워진 배경판 없이 양 테마 대응 (2026-08-31 피드백) */}
      <div className={s.diagramWrap}>
        <GridIllustration className={s.gridIllus} />
      </div>

      <H2>Stroke</H2>
      <p className={s.sectionDesc}>
        기본 Stroke는 1.5pt이며 아이콘의 크기, 위치 및 목적에 따라 변경될 수 있어요. Stroke의
        outline이 픽셀에 물리도록 제작하는 것을 권장해요.
      </p>
      {/* 배경 투명 + 회색 계열만 다크용으로 명도 리매핑한 2벌을 테마로 스왑
          (2026-08-31 피드백 — 구워진 회색판 제거) */}
      <div className={s.diagramWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.figmaIllus} ${s.illusLight}`}
          src={withBase('/iconography/stroke.png')}
          alt="1.5pt 스트로크가 그리드 아웃라인에 물린 문서 아이콘"
          width={481}
          height={311}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.figmaIllus} ${s.illusDark}`}
          src={withBase('/iconography/stroke-dark.png')}
          alt=""
          aria-hidden="true"
          width={481}
          height={311}
        />
      </div>

      <H2>Keyline Shapes</H2>
      <p className={s.sectionDesc}>
        서로 다른 셰이프가 같은 크기로 보이도록 맞추는 기준선이에요. 원·정사각형·직사각형이 키라인
        위에서 광학적으로 동일한 크기가 돼요.
      </p>
      <div className={s.diagramWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.figmaIllus} ${s.illusLight}`}
          src={withBase('/iconography/keyline-shapes.png')}
          alt="Circle · Square · Horizontal Rectangle · Vertical Rectangle 키라인"
          width={702}
          height={230}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${s.figmaIllus} ${s.illusDark}`}
          src={withBase('/iconography/keyline-shapes-dark.png')}
          alt=""
          aria-hidden="true"
          width={702}
          height={230}
        />
      </div>

      <H2>Size Variation</H2>
      <p className={s.sectionDesc}>
        기본 Stroke는 1.5pt이며 아이콘의 크기, 위치 및 목적에 따라 변경될 수 있어요. Stroke의
        outline이 픽셀에 물리도록 제작하는 것을 권장해요.
      </p>
      <SpecTable
        columns={[
          { key: 'size', header: 'Size', width: '15%' },
          { key: 'stroke', header: 'Stroke', width: '15%' },
          { key: 'padding', header: 'Padding', width: '20%' },
          { key: 'liveArea', header: 'Live area', width: '20%' },
          {
            key: 'outerPadding',
            header: (
              <>
                외부 Padding <span className={s.thSub}>터치 영역 확보를 위한</span>
              </>
            ),
            width: '30%',
          },
        ]}
        rows={SIZE_VARIATIONS.map((r) => ({
          size: <span className={s.svVal}>{r.size}</span>,
          stroke: r.stroke,
          padding: <span className={s.svMono}>{r.padding}</span>,
          liveArea: r.liveArea,
          outerPadding: <span className={s.svMono}>{r.outerPadding}</span>,
        }))}
      />
    </>
  );
}

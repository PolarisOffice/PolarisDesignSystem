import type { Metadata } from 'next';
import AssetCard, { AssetPair } from '@/components/docs/AssetCard';
import { H2, H3 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import InfoNote from '@/components/docs/InfoNote';
import { slugify } from '@/lib/docs/slug';
import { pageMeta } from '@/lib/docs/pages';
import SpecTable from '@/components/docs/SpecTable';
import DownloadButton from '@/components/docs/DownloadButton';
import DownloadMenu from '@/components/docs/DownloadMenu';
import Po26Actions from './Po26Actions';
import {
  LOGO_DONTS,
  LOGO_MEDIUMS,
  LOGO_VERSIONS,
  PO26_ALL_ITEMS,
  PO26_DONT_LOGO,
  PO26_GUIDE_COMING_SOON,
  PO26_GUIDE_PDF,
  PO26_LOGOS,
  PO26_SMALL,
  type LogoDontDemo,
  type Po26Asset,
} from './logo.data';
import s from './logo.module.css';
import { withBase } from '@/lib/basePath';

const meta = pageMeta('/brand/logo')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 금지 사항 Do/Don't 비주얼 카드 노출 — 결과가 별로라는 피드백으로 잠정 숨김 (2026-08-25).
 * 데이터·컴포넌트(LOGO_DONTS, DontCard 등)는 그대로 두고 플래그만 끈다 — 재검토 후 복원. */
const SHOW_LOGO_DONTS: boolean = false;

/** 화이트 로고 프리뷰 배경 — 폴라리스 딥블루(라이트·다크 공통 고정) */
const DARK_BG = '#0046b9';

/** kind → 프리뷰 이미지 크기 클래스 */
const KIND_CLASS: Record<Po26Asset['kind'], string> = {
  h: s.logoH,
  v: s.logoV,
  icon: s.logoIcon,
};

/** LogoDontDemo.demoClass → logo.module.css 변형 클래스 (img 에 그대로 씌우는 케이스만) */
const DONT_DEMO_CLASS: Record<string, string> = {
  dontRotate: s.dontRotate,
  dontColor: s.dontColor,
  dontBusyBg: s.dontBusyBg,
  dontLowRes: s.dontLowRes,
  dontCrop: s.dontCrop,
};

/** 카드별 프리뷰 안쪽 내용만 — 바깥 `.dontPreview` 틀 + ✕ 배지는 DontCard 가 한 곳에서 씌운다 */
function DontPreviewInner({ item }: { item: LogoDontDemo }) {
  if (item.kind === 'pattern') {
    return null; // .dontPatternWrap 배경 자체가 콘텐츠 — DontCard 가 wrapClass 로 씌움
  }
  if (item.kind === 'font') {
    return <span className={s.dontFontText}>POLARIS OFFICE</span>;
  }
  if (item.kind === 'ai') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={withBase(PO26_DONT_LOGO)} alt="" className={`${s.dontLogo} ${s.dontAi}`} />;
  }
  if (item.demoClass === 'dontCrowd') {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBase(PO26_DONT_LOGO)} alt="" className={`${s.dontLogo} ${s.dontCrowdLogo}`} />
        {/* 로고 오른쪽에 겹쳐서 '주변 요소가 가장자리에 밀착'한 것처럼 — ✕ 배지(top-right)와
            안 겹치게 로고 몸통 쪽(중간~하단)에 배치 */}
        <span className={s.crowdChip} style={{ background: '#f46060', top: '38%', left: '52%' }} />
        <span className={s.crowdChip} style={{ background: '#87cc25', top: '62%', left: '60%' }} />
      </>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBase(PO26_DONT_LOGO)}
      alt=""
      className={`${s.dontLogo} ${item.demoClass ? DONT_DEMO_CLASS[item.demoClass] : ''}`}
    />
  );
}

/** 프리뷰 배경만 바뀌는 케이스(패턴·시끄러운 배경·주변요소)의 wrap 클래스 */
function dontWrapClass(item: LogoDontDemo): string {
  if (item.kind === 'pattern') return s.dontPatternWrap;
  if (item.demoClass === 'dontBusyBg') return s.dontBusyBgWrap;
  if (item.demoClass === 'dontCrowd') return s.dontCrowdWrap;
  return '';
}

/**
 * 금지 사항 Do/Don't 카드 — 실제 화면용 SVG(PO26_DONT_LOGO)를 CSS 로 변형해 위반 사례를
 * 재현한다(가짜 일러스트 아님). 프리뷰 배경엔 옅은 에러톤 워시 + 우상단 ✕ 배지로
 * '틀렸다'는 신호를 준다.
 */
function DontCard({ item }: { item: LogoDontDemo }) {
  return (
    <div className={s.dontCard}>
      <div className={`${s.dontPreview} ${dontWrapClass(item)}`}>
        <DontPreviewInner item={item} />
        <span className={s.dontBadge} aria-hidden="true">
          ✕
        </span>
      </div>
      <p className={s.dontLabel}>{item.label}</p>
    </div>
  );
}

/** 공식 패키지 카드 — 프리뷰 + '화면용 ▾' 메뉴/개별 칩 (데이터: logo.data.ts PO26_*) */
function Po26Card({ asset, size = 'lg' }: { asset: Po26Asset; size?: 'lg' | 'sm' }) {
  const first = asset.screen?.[0] ?? asset.formats?.[0];
  return (
    <AssetCard
      name={asset.name}
      href={first?.href ?? asset.preview}
      size={size}
      previewBg={asset.previewBg ?? (asset.dark ? DARK_BG : 'var(--logo-preview-light)')}
      actions={<Po26Actions screen={asset.screen} formats={asset.formats} size={size} />}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={KIND_CLASS[asset.kind]} src={withBase(asset.preview)} alt={asset.name} />
    </AssetCard>
  );
}

/** 원본: PDS `docs/brand/logo.md` + 「POLARIS OFFICE LOGO 2026」 공식 배포 패키지(2026-08-24) */
export default function BrandLogoPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        폴라리스 브랜드 로고 에셋을 다운로드할 수 있어요. 로고는 브랜드 일관성을 위해 규정을
        엄격히 준수해야 해요.
      </PageLead>
      {/* 로고는 브랜드 자산 라이선스 대상 — 규칙 본문은 /terms 3절이 담고, 여기서는 그리로 안내만 한다
          (2026-09-04 결정: "사내·승인 사용자만" 문구 대신 약관 준수 안내). 앵커는 헤딩 텍스트를 사이트
          slugify 로 만든다 — 한글 앵커가 조합형 자모(NFKD)라 손으로 쓴 NFC 문자열은 id 와 불일치.
          문자열은 terms/page.tsx 의 3절 H2 텍스트와 같아야 한다 */}
      <InfoNote>
        로고 에셋은 브랜드 자산 가이드를 따라요. 사용 전에{' '}
        <a href={withBase(`/terms#${slugify('3. 브랜드 자산 (Brand Assets License)')}`)}>이용약관의 브랜드 자산 조항</a>을
        확인하고, 그 조건을 지켜 사용해 주세요.
      </InfoNote>

      <div className={s.titleRow}>
        <H2>폴라리스오피스 로고</H2>
        <DownloadMenu label="전체 다운로드" items={PO26_ALL_ITEMS} menuWidth={168} icon />
      </div>
      {/* 2026-08-28 검토 반영 — "리본"·"폴라리스 블루" 명칭 삭제, 버전 선택 기준의 핵심
          ("컬러 로고가 기본")을 상단으로 끌어올린다. 상세 기준 표는 아래 섹션 유지. */}
      <p>
        컬러 심볼과 워드마크로 구성돼요. <strong>컬러 로고가 기본</strong>이고, 흑백·회색조는 컬러
        표현이 제한되는 경우에만 보완적으로 사용해요. 어두운 배경에서는 워드마크만 흰색으로 바뀌어요.
      </p>

      <AssetPair>
        {PO26_LOGOS.slice(0, 2).map((a) => (
          <Po26Card key={a.name} asset={a} />
        ))}
      </AssetPair>
      <AssetPair>
        {PO26_LOGOS.slice(2, 4).map((a) => (
          <Po26Card key={a.name} asset={a} />
        ))}
      </AssetPair>

      {/* 아이콘·흑백·회색조 — 소형 카드 한 줄 (2026-08-24: 정사각 아이콘 대형 프리뷰가 부담스럽다는 피드백).
          AssetGrid(auto-fill)는 빈 트랙이 생겨 카드가 좁아지므로 고정 3열 */}
      <div className={s.smallRow}>
        {PO26_SMALL.map((a) => (
          <Po26Card key={a.name} asset={a} size="sm" />
        ))}
      </div>

      {/* 정본: 「Polaris Office Logo Usage Basics」 (디자인팀 7섹션 PDF, 2026-08-13 반영).
          H2 텍스트는 기존 앵커(사용-가이드라인) 보존을 위해 유지, 내용은 PDF 전면 대체.
          가이드 PDF 다운로드 버튼은 하단 별도 섹션 대신 이 타이틀 줄에 배치 (2026-08-25 피드백).
          PDF 수정 중이라 잠금(2026-09-04): 버튼 비활성 + hover 툴팁(시안 A). 파일 자체도 public 과
          전체 패키지 zip 에서 뺐다 — 수정본을 PO26_GUIDE_PDF 경로에 올리고 zip 에 넣은 뒤
          comingSoon prop 을 제거한다. */}
      <div className={s.titleRow}>
        <H2>사용 가이드라인</H2>
        <DownloadButton href={PO26_GUIDE_PDF} icon comingSoon={PO26_GUIDE_COMING_SOON}>
          가이드 문서 (PDF · 2.8MB)
        </DownloadButton>
      </div>

      <H3>화면용 / 인쇄용 구분</H3>
      <p>
        용도에 맞지 않는 로고를 사용하면 색상이 다르게 표현될 수 있어요. 외주 업체에 전달하는 경우{' '}
        <strong>AI(Adobe Illustrator) 파일</strong>을 사용해요. 예) 영상 제작 시{' '}
        <code>화면용_전체로고.ai</code>, 명함·현수막 제작 시 <code>인쇄용_전체로고.ai</code> 전달.
      </p>
      <SpecTable
        caption="화면용/인쇄용 구분"
        columns={[
          { key: 'name', header: '구분', width: '14%' },
          { key: 'mode', header: '색 공간', width: '12%' },
          { key: 'purpose', header: '목적', width: '28%' },
          { key: 'examples', header: '예시', width: '46%' },
        ]}
        rows={LOGO_MEDIUMS.map((m) => ({
          name: <strong>{m.name}</strong>,
          mode: m.mode,
          purpose: m.purpose,
          examples: m.examples,
        }))}
      />

      <H3>로고 버전 선택 기준</H3>
      <p>
        <strong>컬러 로고가 기본</strong>이에요. 흑백·회색조는 컬러 표현이 제한되는 경우에만
        보완적으로 사용해요.
      </p>
      <SpecTable
        caption="로고 버전별 사용 기준"
        columns={[
          { key: 'name', header: '버전', width: '14%' },
          { key: 'rule', header: '지위', width: '14%' },
          { key: 'desc', header: '기준', width: '42%' },
          { key: 'examples', header: '예시 상황', width: '30%' },
        ]}
        rows={LOGO_VERSIONS.map((v) => ({
          name: <strong>{v.name}</strong>,
          rule: v.rule,
          desc: v.desc,
          examples: v.examples,
        }))}
      />

      {SHOW_LOGO_DONTS && (
        <>
          <H3>금지 사항</H3>
          {/* '생성형 AI 왜곡' 데모(.dontAi)가 참조하는 SVG 필터 — 시각 출력은 없고(0×0) 정의만
              제공. DOM 어디에 있든 id 참조는 유효하지만 섹션 바로 위에 둬 데이터 종속을 명확히. */}
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
            <filter id="dontAiWarp">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <div className={s.dontGrid}>
            {LOGO_DONTS.map((d) => (
              <DontCard key={d.label} item={d} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

import type { ReactNode } from 'react';
import AssetDownload from './AssetDownload';
import { assetFormats } from '@/lib/docs/assetFiles';
import s from './AssetCard.module.css';
import { withBase } from '@/lib/basePath';

/**
 * 로고·폰트 등 에셋 다운로드 카드 — 원본 custom.css 의 `.asset-card`(대형)와
 * `.asset-card-sm`(소형)을 `size` prop 하나로 합친 것.
 *
 * 이미지는 next/image 를 쓰지 않는다 — 대상이 전부 SVG 라 최적화 이득이 없고,
 * 킷을 정적 배포할 때 이미지 최적화 서버 의존을 만들지 않기 위해서다.
 */
export default function AssetCard({
  src,
  alt,
  name,
  href,
  size = 'lg',
  previewBg,
  children,
  multiFormat = false,
  formats,
  actions,
}: {
  /** 미리보기 이미지 경로. children 을 주면 무시된다 */
  src?: string;
  alt?: string;
  /** 파일명 라벨 */
  name: string;
  /** 다운로드 링크 */
  href: string;
  size?: 'lg' | 'sm';
  /** 밝은 로고를 어두운 면 위에 얹는 등 프리뷰 배경이 필요한 경우 */
  previewBg?: string;
  /** 이미지 대신 임의 미리보기를 넣을 때 */
  children?: ReactNode;
  /**
   * SVG 외 포맷(PNG·AI)까지 버튼으로 제공할지. href 가 `.svg` 일 때만 의미가 있다 —
   * 파생 파일 탐지는 [assetFiles.ts](@/lib/docs/assetFiles) 규약을 따른다(서버에서 존재 검사).
   */
  multiFormat?: boolean;
  /**
   * 포맷 버튼을 **명시적으로** 지정 (같은-이름 파생 규약을 못 따르는 공식 배포 패키지용 —
   * 2026-08-24 폴라리스오피스 로고 2026). 주면 href/multiFormat 다운로드 렌더를 대체한다.
   * 첫 항목이 기본(강조) 버튼.
   */
  formats?: { label: string; href: string }[];
  /**
   * 버튼 영역을 임의 노드로 통째 대체 (드롭다운 메뉴 등 인터랙티브 액션 — Po26Actions).
   * formats 보다 우선한다.
   */
  actions?: ReactNode;
}) {
  return (
    <div className={size === 'sm' ? `${s.card} ${s.cardSm}` : s.card}>
      <div className={s.preview} style={previewBg ? { background: previewBg } : undefined}>
        {children ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name} />
        )}
      </div>
      <div className={s.meta}>
        <span className={s.name}>{name}</span>
        {actions ? (
          actions
        ) : formats ? (
          <span className={s.formats}>
            {formats.map((f, i) => (
              <a key={f.href} className={i === 0 ? s.download : s.formatBtn} href={withBase(f.href)} download>
                {f.label}
              </a>
            ))}
          </span>
        ) : multiFormat && href.endsWith('.svg') ? (
          <AssetDownload formats={assetFormats(href)} />
        ) : (
          <a className={s.download} href={href} download>
            다운로드
          </a>
        )}
      </div>
    </div>
  );
}

/** 소형 에셋 카드용 그리드 — 원본 brand/logo.md 의 계열사·BI 로고 배치 */
export function AssetGrid({ children }: { children: ReactNode }) {
  return <div className={s.smallGrid}>{children}</div>;
}

/**
 * 대형 카드 2장을 한 줄에 — 컬러/화이트처럼 짝을 이루는 에셋용(2026-08-21).
 * 카드 하나가 본문 폭을 꽉 채우면 시각적으로 부담스럽다는 피드백에서 나왔다.
 */
export function AssetPair({ children }: { children: ReactNode }) {
  return <div className={s.pair}>{children}</div>;
}

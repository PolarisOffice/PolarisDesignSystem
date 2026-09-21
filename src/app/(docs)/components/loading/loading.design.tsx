import { H2, H3 } from '@/components/docs/Heading';
import Anatomy from '@/components/docs/Anatomy';
import AnatomyFigure from '@/components/docs/AnatomyFigure';
import { CaseList, CaseBlock } from '@/components/docs/CaseList';
import SpecTable from '@/components/docs/SpecTable';
import UsageGrid from '@/components/docs/UsageGrid';
import { DemoCol, DemoRow, DemoSurface } from '@/components/docs/Demo';
import { Button, Dim, ProgressBar, ProgressCircle, Skeleton } from '@polarisoffice/pds-react';
import {
  BAR_MOTION,
  BAR_SPECS,
  BAR_TYPES,
  BAR_USAGE,
  CIRCLE_COLORS,
  CIRCLE_MOTION,
  CIRCLE_SIZES,
  CIRCLE_USAGE,
  DURATION_RULES,
  LOADING_ANATOMY,
  SKELETON_MOTION,
  SKELETON_SHAPES,
  SKELETON_USAGE,
} from './loading.data';

/**
 * Loading — Design 탭.
 *
 * 원형(ProgressCircle)·막대(ProgressBar)·Skeleton 을 한 페이지에서 다룬다. 셋은 **소요 시간**이라는
 * 같은 기준으로 갈라지므로 따로 두면 고르는 근거가 흩어진다(2026-09-18 병합, Skeleton 은 같은 날 합류).
 * 절 순서는 다른 컴포넌트 문서와 같다(Anatomy → Properties → Case → Guidelines → Specification —
 * 2026-09-18 정렬: 처음엔 컴포넌트별 H2 로 갈라 놓아 Anatomy 가 없고 순서도 달랐다).
 * 값은 Figma `Feedback → Loading`(3192:233) 실측이다.
 */
export default function LoadingDesign() {
  return (
    <>
      <H2>Anatomy</H2>
      {/* 세 가지를 나란히 — Skeleton 은 aria-hidden 뿐이라 셀렉터용 data-part 래퍼를 둔다 */}
      <AnatomyFigure
        parts={[
          { n: '01', selector: '[role="status"]' },
          { n: '02', selector: '[role="progressbar"]' },
          { n: '03', selector: '[data-part="skeleton"]' },
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <ProgressCircle size={32} />
          <div style={{ width: 160 }}>
            <ProgressBar type="determinate" value={60} />
          </div>
          <div data-part="skeleton" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skeleton shape="circle" width={32} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton shape="text" width={120} height={12} />
              <Skeleton shape="text" width={80} height={12} />
            </div>
          </div>
        </div>
      </AnatomyFigure>
      <Anatomy items={[...LOADING_ANATOMY]} />

      <H2>Properties</H2>

      <H3>Type</H3>
      <p>걸리는 시간으로 골라요. 세 가지 모두 같은 기준을 써요.</p>
      <SpecTable
        caption="소요 시간별 로딩 표시 기준"
        columns={[
          { key: 'duration', header: '소요 시간', width: '24%' },
          { key: 'rule', header: '표시', width: '76%' },
        ]}
        rows={DURATION_RULES.map((r) => ({ duration: r.duration, rule: r.rule }))}
      />

      <H3>Size</H3>
      <p>Progress Circle 은 박스 크기를 정하면 링과 선 두께가 따라와요. 18·24·32는 아이콘 박스, 48은 전체 화면 딤용이에요.</p>
      <DemoSurface>
        <DemoRow gap="wide">
          {CIRCLE_SIZES.map((s) => (
            <DemoCol key={s.size} label={`${s.size}`}>
              <ProgressCircle size={s.size} />
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>
      <p>Progress Bar 는 높이 4px 에 부모 폭을 따라요. Skeleton 은 실제 콘텐츠 크기에 맞추고, 아래는 모양별 기본값이에요.</p>
      <DemoSurface>
        <DemoRow gap="wide" align="center">
          {SKELETON_SHAPES.map((s) => (
            <DemoCol key={s.shape} label={s.label}>
              <Skeleton
                shape={s.shape}
                width={s.shape === 'rect' ? 160 : undefined}
                height={s.shape === 'rect' ? 80 : undefined}
              />
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>

      <H3>Bar Type</H3>
      <DemoSurface>
        <DemoRow stack align="left" gap="wide">
          {BAR_TYPES.map((t) => (
            <DemoCol key={t.type} label={t.label} align="left">
              <div style={{ width: 280 }}>
                <ProgressBar type={t.type} value={60} />
              </div>
            </DemoCol>
          ))}
        </DemoRow>
      </DemoSurface>
      <SpecTable
        caption="막대 타입"
        columns={[
          { key: 'label', header: '타입', width: '24%' },
          { key: 'desc', header: '설명', width: '76%' },
        ]}
        rows={BAR_TYPES.map((t) => ({ label: t.label, desc: t.desc }))}
      />

      <H3>Color</H3>
      <p>
        Progress Circle 은 트랙 없이 호 하나만 돌고, 색은 화면에 맞춰 바꿔요. Skeleton 은{' '}
        <code>--color-fill-normal</code> 하나만 써요.
      </p>
      <SpecTable
        caption="맥락별 색"
        columns={[
          { key: 'context', header: '맥락', width: '30%' },
          { key: 'token', header: '토큰', width: '34%' },
          { key: 'desc', header: '설명', width: '36%' },
        ]}
        rows={CIRCLE_COLORS.map((c) => ({ context: c.context, token: <code>{c.token}</code>, desc: c.desc }))}
      />

      <H2>Case</H2>
      <CaseList>
        <CaseBlock badge="01" title="버튼 안" sub="아이콘 자리에 18 스피너가 들어가요. 라벨을 진행 문구로 바꾸거나 스피너만 두되, 버튼 폭과 색은 그대로예요. 회색은 비활성 몫이에요.">
          <DemoSurface>
            <DemoRow gap="wide">
              <DemoCol label="라벨 유지">
                <Button variant="primary" size={40} loading>
                  저장중
                </Button>
              </DemoCol>
              <DemoCol label="라벨 없음">
                <Button variant="primary" size={40} loading aria-label="저장중" style={{ width: 79 }} />
              </DemoCol>
            </DemoRow>
          </DemoSurface>
        </CaseBlock>

        <CaseBlock badge="02" title="전체 화면" sub="딤 위 화면 가운데에 48을 둬요.">
          <DemoSurface pad="tall">
            <div style={{ position: 'relative', width: '100%', minHeight: 200, borderRadius: 12, overflow: 'hidden' }}>
              <Dim loading label="불러오는 중" />
            </div>
          </DemoSurface>
        </CaseBlock>

        <CaseBlock badge="03" title="화면 상단" sub="화면 전체 진행은 헤더 바로 아래 전체 폭으로 둬요.">
          <DemoSurface>
            <div
              style={{
                width: '100%',
                maxWidth: 375,
                border: '1px solid var(--color-line-normal)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 14 }}>
                최근 문서
              </div>
              <ProgressBar type="determinate" value={60} />
              <div style={{ height: 72 }} />
            </div>
          </DemoSurface>
        </CaseBlock>

        <CaseBlock badge="04" title="항목 아래" sub="항목별 진행은 그 항목 아래에, 진행률을 알면 숫자와 함께 둬요.">
          <DemoSurface>
            <div style={{ width: '100%', maxWidth: 375, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>3분기 매출 보고서.xlsx</span>
                  <span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>60%</span>
                </div>
                <ProgressBar type="determinate" value={60} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>문서를 분석하고 있어요</span>
                <ProgressBar />
              </div>
            </div>
          </DemoSurface>
        </CaseBlock>

        <CaseBlock badge="05" title="목록" sub="Skeleton 은 실제 콘텐츠와 같은 자리·크기로 놓고, 마지막 줄은 짧게 해요.">
          <DemoSurface>
            <div style={{ width: '100%', maxWidth: 375, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Skeleton shape="circle" width={40} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <Skeleton shape="text" width="100%" />
                    <Skeleton shape="text" width="60%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          </DemoSurface>
        </CaseBlock>
      </CaseList>

      <H2>Guidelines</H2>
      <UsageGrid
        do={[...CIRCLE_USAGE.do, ...BAR_USAGE.do, ...SKELETON_USAGE.do]}
        dont={[...CIRCLE_USAGE.dont, ...BAR_USAGE.dont, ...SKELETON_USAGE.dont]}
      />

      <H2>Specification</H2>

      <H3>Progress Circle</H3>
      <SpecTable
        caption="원형 크기별 치수"
        columns={[
          { key: 'size', header: '박스', width: '14%' },
          { key: 'ring', header: '링', width: '14%' },
          { key: 'stroke', header: '선 두께', width: '16%' },
          { key: 'use', header: '쓰는 자리', width: '56%' },
        ]}
        rows={CIRCLE_SIZES.map((s) => ({
          size: `${s.size}px`,
          ring: `${s.ring}px`,
          stroke: `${s.stroke}px`,
          use: s.use,
        }))}
      />
      <p>2초에 한 바퀴 돌며 호 길이가 함께 변해요. 멈춰 보이는 구간이 없어요.</p>
      <SpecTable
        caption="원형 애니메이션 값"
        columns={[
          { key: 'prop', header: '항목', width: '24%' },
          { key: 'value', header: '값', width: '36%' },
          { key: 'desc', header: '근거', width: '40%' },
        ]}
        rows={CIRCLE_MOTION.map((m) => ({ prop: m.prop, value: <code>{m.value}</code>, desc: m.desc }))}
      />

      <H3>Progress Bar</H3>
      <SpecTable
        caption="막대 치수와 색"
        columns={[
          { key: 'prop', header: '속성', width: '24%' },
          { key: 'value', header: '값', width: '32%' },
          { key: 'desc', header: '설명', width: '44%' },
        ]}
        rows={BAR_SPECS.map((s) => ({ prop: s.prop, value: <code>{s.value}</code>, desc: s.desc }))}
      />
      <SpecTable
        caption="막대 애니메이션 값"
        columns={[
          { key: 'prop', header: '항목', width: '28%' },
          { key: 'value', header: '값', width: '38%' },
          { key: 'desc', header: '근거', width: '34%' },
        ]}
        rows={BAR_MOTION.map((m) => ({ prop: m.prop, value: <code>{m.value}</code>, desc: m.desc }))}
      />

      <H3>Skeleton</H3>
      <SpecTable
        caption="스켈레톤 모양별 기본값"
        columns={[
          { key: 'label', header: '모양', width: '16%' },
          { key: 'size', header: '기본 크기', width: '20%' },
          { key: 'radius', header: 'radius', width: '28%' },
          { key: 'use', header: '쓰는 자리', width: '36%' },
        ]}
        rows={SKELETON_SHAPES.map((s) => ({ label: s.label, size: s.size, radius: <code>{s.radius}</code>, use: s.use }))}
      />
      <p>투명도가 100%와 30% 사이를 오가요. shimmer 는 쓰지 않아요.</p>
      <SpecTable
        caption="스켈레톤 애니메이션 값"
        columns={[
          { key: 'prop', header: '항목', width: '24%' },
          { key: 'value', header: '값', width: '38%' },
          { key: 'desc', header: '근거', width: '38%' },
        ]}
        rows={SKELETON_MOTION.map((m) => ({ prop: m.prop, value: <code>{m.value}</code>, desc: m.desc }))}
      />
    </>
  );
}

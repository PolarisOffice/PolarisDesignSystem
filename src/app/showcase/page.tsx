'use client';

import { useState } from 'react';

import {
  Badge,
  Button,
  Checkbox,
  Menu,
  Credit,
  Dim,
  InputField,
  MenuItem,
  Popup,
  ProgressBar,
  ProgressCircle,
  Radio,
  SegmentControl,
  Select,
  Skeleton,
  Table,
  Tabs,
  Toast,
  Toggle,
  Tooltip,
} from '@polarisoffice/pds-react';
import '@polarisoffice/pds-react/tokens.css';

import { DarkStage, Row, Section } from './parts';

import type { ButtonSize, ButtonVariant } from '@polarisoffice/pds-react';

/**
 * 패키지 컴포넌트 전수 쇼케이스 — 디자이너·담당자 공유용.
 *
 * 가이드 페이지는 DESIGN.md 를 거쳐 렌더되므로 변형이 스펙 맵 축에 묶인다.
 * 여기서는 패키지에서 직접 import 해 **Figma 의 변형을 그대로 펼친다**.
 * 문구도 Figma 견본을 그대로 쓴다(버튼 / Text / title …).
 */
const VARIANTS: ButtonVariant[] = [
  'primary', 'default', 'ai', 'sub', 'gray', 'black', 'delete', 'ghost', 'blackGhost', 'deleteGhost',
];
const SIZES: ButtonSize[] = [64, 54, 48, 40, 32, 24];

type Row = { a: string; b: string; c: string };

const OPTIONS = [
  { value: 'a', label: 'Text' },
  { value: 'b', label: 'Text' },
  { value: 'c', label: 'Text' },
  { value: 'd', label: 'Text' },
  { value: 'e', label: 'Text' },
];

export default function Showcase() {
  const [tab, setTab] = useState('a');
  const [tab2, setTab2] = useState('a');
  const [seg, setSeg] = useState('a');
  const [seg2, setSeg2] = useState('a');
  const [seg3, setSeg3] = useState('a');
  const [sel, setSel] = useState<Record<string, string | undefined>>({});
  const [menu, setMenu] = useState('a');
  const [chk, setChk] = useState(false);
  const [rad, setRad] = useState('a');
  const [tg1, setTg1] = useState(false);
  const [tg2, setTg2] = useState(true);
  const [tg3, setTg3] = useState(true);
  const [badge, setBadge] = useState(true);
  const [popup, setPopup] = useState<null | 'one' | 'two'>(null);
  const [toast, setToast] = useState<null | 'success' | 'error'>(null);

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '40px 24px 120px' }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px' }}>
          Polaris Design System — 패키지 컴포넌트
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--color-label-neutral)', lineHeight: 1.6 }}>
          <code style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>@polarisoffice/pds-react</code> 에서 직접
          가져와 렌더한 것입니다. 치수·색은 Figma 실측이고, 견본 문구도 Figma 그대로입니다.
        </p>
      </header>

      <Section title="Button" note="Type 10종 × Size 6종. hover 는 마우스를 올려 확인합니다.">
        {SIZES.map((s) => (
          <Row key={s} label={`size ${s}`}>
            {VARIANTS.slice(0, 7).map((v) => (
              <Button key={v} variant={v} size={s}>버튼</Button>
            ))}
          </Row>
        ))}
        <Row label="ghost">
          {(['ghost', 'blackGhost', 'deleteGhost'] as ButtonVariant[]).map((v) => (
            <Button key={v} variant={v} size={48}>버튼</Button>
          ))}
        </Row>
        <Row label="disabled">
          <Button variant="primary" size={48} disabled>버튼</Button>
          <Button variant="default" size={48} disabled>버튼</Button>
        </Row>
        <Row label="loading">
          <Button variant="primary" size={48} loading>버튼</Button>
        </Row>
      </Section>

      <Section title="Input" note="Status 4종이 하나의 배치에서 파생됩니다 — 제목은 필드 안 상단으로 올라옵니다.">
        <Row label="default" align="start"><div style={{ width: 398 }}><InputField label="title" placeholder="placholder" fullWidth /></div></Row>
        <Row label="filled" align="start"><div style={{ width: 398 }}><InputField label="title" defaultValue="Text" fullWidth /></div></Row>
        <Row label="error" align="start"><div style={{ width: 398 }}><InputField label="title" defaultValue="Text" error="Error text" fullWidth /></div></Row>
        <Row label="password" align="start"><div style={{ width: 398 }}><InputField label="title" defaultValue="secret" revealToggle fullWidth /></div></Row>
        <Row label="disabled" align="start"><div style={{ width: 398 }}><InputField label="title" defaultValue="Text" disabled fullWidth /></div></Row>
      </Section>

      <Section title="Toggle" note="켜짐/꺼짐 상태를 즉시 전환할 때 사용">
        <Row label="off / on">
          <Toggle checked={tg1} onChange={setTg1} aria-label="토글 1" />
          <Toggle checked={tg2} onChange={setTg2} aria-label="토글 2" />
          <Toggle checked size="sm" aria-label="작은 토글" />
        </Row>
        <Row label="labelled"><Toggle checked={tg3} onChange={setTg3} label="Text" aria-label="토글 3" /></Row>
        <Row label="disabled"><Toggle checked={false} onChange={() => {}} disabled aria-label="토글 4" /></Row>
      </Section>

      <Section title="Checkbox / Radio" note="다중 선택은 Checkbox, 단일 선택은 Radio">
        <Row label="checkbox">
          <Checkbox checked={chk} onChange={setChk} />
          <Checkbox checked />
          <Checkbox indeterminate />
          <Checkbox checked tone="ai" />
          <Checkbox checked disabled />
          <Checkbox checked={chk} onChange={setChk} label="Text" />
        </Row>
        <Row label="radio">
          <Radio name="sc" value="a" checked={rad === 'a'} onChange={() => setRad('a')} />
          <Radio name="sc" value="b" checked={rad === 'b'} onChange={() => setRad('b')} />
          <Radio name="sc2" value="c" checked tone="ai" onChange={() => {}} />
          <Radio name="sc3" value="d" checked disabled onChange={() => {}} />
          <Radio name="sc" value="e" checked={rad === 'e'} onChange={() => setRad('e')} label="Text" />
        </Row>
      </Section>

      <Section title="Tab" note="페이지 또는 카테고리가 이동할 때 사용">
        <Row label="primary" align="start">
          <div style={{ width: 360 }}>
            <Tabs value={tab} onChange={setTab} variant="primary" items={OPTIONS.slice(0, 3)} />
          </div>
        </Row>
        <Row label="secondary" align="start">
          <div style={{ width: 360 }}>
            <Tabs value={tab2} onChange={setTab2} variant="secondary" items={OPTIONS.slice(0, 3)} />
          </div>
        </Row>
      </Section>

      <Section title="Segment" note="선택 또는 필터링하는 컨트롤 영역에서 사용">
        <Row label="pill">
          <SegmentControl value={seg} onChange={setSeg} variant="pill"
            items={[{ value: 'a', label: 'Text', count: 'num' }, { value: 'b', label: 'Text', count: 'num' }]} />
        </Row>
        <Row label="filled">
          <SegmentControl value={seg2} onChange={setSeg2} variant="filled" items={OPTIONS.slice(0, 2)} />
        </Row>
        <Row label="outlined">
          <SegmentControl value={seg3} onChange={setSeg3} variant="outlined" items={OPTIONS.slice(0, 2)} />
        </Row>
      </Section>

      <Section title="Select" note="옵션이 5개 이상일 때 사용. 눌러서 메뉴를 열어보세요.">
        {(['lg', 'md', 'sm'] as const).map((s) => (
          <Row key={s} label={s} align="start">
            <div style={{ width: 312 }}>
              <Select size={s} options={OPTIONS} value={sel[s]} onChange={(v) => setSel((p) => ({ ...p, [s]: v }))} />
            </div>
          </Row>
        ))}
      </Section>

      <Section title="Menu Item / Context Menu" note="base는 fill로 두고, 전체 width를 조절하여 사용">
        <Row label="menu" align="start">
          <Menu width={152}>
            <MenuItem label="Text" selected={menu === 'a'} onClick={() => setMenu('a')} />
            <MenuItem label="Text" selected={menu === 'b'} onClick={() => setMenu('b')} />
            <MenuItem label="Text" hasSubmenu hideCheck />
            <MenuItem label="Text" disabled hideCheck />
          </Menu>
        </Row>
      </Section>

      <Section title="Badge / Credit" note="Badge 는 선택·필터 태그, Credit 은 AI 크레딧 잔량">
        <Row label="badge">
          <Badge>Text</Badge>
          <Badge selected>Text</Badge>
          <Badge selected={badge} onClick={() => setBadge((v) => !v)}>Text</Badge>
        </Row>
        <Row label="credit">
          <Credit value={10} />
          <Credit value={10} available={false} />
        </Row>
      </Section>

      <Section title="Table" note="padding은 최소 24/16을 유지하며 그 이상 너비 조절은 콘텐츠의 길이를 고려하여 설정한다.">
        <Table<Row>
          columns={[
            { key: 'a', header: '제목' },
            { key: 'b', header: '제목' },
            { key: 'c', header: '제목' },
          ]}
          rows={[
            { a: '내용', b: '내용', c: '내용' },
            { a: '내용', b: '내용', c: '내용' },
          ]}
        />
      </Section>

      <Section title="Tooltip" note="강조하고자 하는 요소에서 8px 상단 노출. 마우스를 올리면 600ms 뒤 뜹니다.">
        <Row label="placement">
          {(['top', 'bottom', 'left', 'right'] as const).map((pl) => (
            <Tooltip key={pl} content="Text" placement={pl}>
              <Button variant="default" size={40}>{pl}</Button>
            </Tooltip>
          ))}
        </Row>
        <Row label="열린 상태">
          <Tooltip content="Text" placement="top" open>
            <Button variant="default" size={40}>항상 열림</Button>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Toast" note="노출 위치는 상,하 50px 여백을 두고 노출">
        <Row label="열기">
          <Button variant="default" size={40} onClick={() => setToast('success')}>성공</Button>
          <Button variant="default" size={40} onClick={() => setToast('error')}>실패</Button>
        </Row>
      </Section>

      <Section title="Popup" note="확인·선택이 꼭 필요할 때만. 버튼은 최대 2개.">
        <Row label="열기">
          <Button variant="default" size={40} onClick={() => setPopup('one')}>ONE BTN</Button>
          <Button variant="default" size={40} onClick={() => setPopup('two')}>TWO BTN</Button>
        </Row>
      </Section>

      <Section title="Loading" note="ProgressCircle 4크기 · ProgressBar 2종 · Skeleton 3모양. 버튼 안 스피너는 loading 으로 켠다.">
        <Row label="ProgressCircle">
          <ProgressCircle size={18} />
          <ProgressCircle size={24} />
          <ProgressCircle size={32} />
          <ProgressCircle size={48} />
        </Row>
        <Row label="버튼 안">
          <Button variant="primary" size={40} loading>저장중</Button>
          {/* 라벨 없이 스피너만 — 버튼 폭은 라벨이 있을 때 그대로 둔다 */}
          <Button variant="primary" size={40} loading aria-label="저장중" style={{ width: 79 }} />
        </Row>
        <Row label="ProgressBar" align="start">
          <div style={{ width: 240 }}><ProgressBar /></div>
          <div style={{ width: 240 }}><ProgressBar type="determinate" value={60} /></div>
        </Row>
        <Row label="Skeleton" align="start">
          <Skeleton />
          <Skeleton shape="circle" />
          <Skeleton shape="text" />
        </Row>
      </Section>

      <Section title="Dim" note="loading=True / loading=false">
        <Row label="변형" align="start">
          <DarkStage><Dim loading /></DarkStage>
          <DarkStage><Dim loading={false} /></DarkStage>
        </Row>
      </Section>

      {toast && (
        <Toast type={toast} onClose={() => setToast(null)}
          message={toast === 'success' ? '성공 메세지를 전달하는 토스트 팝업입니다.' : '실패 메세지를 전달하는 토스트 팝업입니다.'} />
      )}
      {popup === 'one' && (
        <Popup title="Title" onClose={() => setPopup(null)} closable={false}
          footer={<Button variant="primary" size={48} onClick={() => setPopup(null)}>버튼</Button>}>
          Body
        </Popup>
      )}
      {popup === 'two' && (
        <Popup title="Title" onClose={() => setPopup(null)}
          footer={
            <>
              <Button variant="default" size={48} onClick={() => setPopup(null)}>버튼</Button>
              <Button variant="primary" size={48} onClick={() => setPopup(null)}>버튼</Button>
            </>
          }>
          Body
        </Popup>
      )}
    </div>
  );
}

import type { ReactNode } from 'react';
import {
  Button,
  Checkbox,
  DownloadIcon,
  InputField,
  Menu,
  MenuItem,
  ProgressBar,
  ProgressCircle,
  Radio,
  SegmentControl,
  Select,
  Table,
  Tabs,
  Toast,
  Toggle,
  Tooltip,
} from '@polarisoffice/pds-react';
import { TABLE_SAMPLE_COLUMNS, TABLE_SAMPLE_ROWS } from './table/table.data';
import s from './component-previews.module.css';

/**
 * Component Overview 카드의 실물 프리뷰(2026-09-21) — 전부 패키지 컴포넌트 렌더라 토큰·구현이
 * 바뀌면 카드도 같이 바뀐다. 장식용(PreviewCard 가 aria-hidden·pointer-events 없음으로 감싼다).
 * Popup 만 실물이 아니다 — 진짜 Popup 은 fixed 다이얼로그라 카드에 못 넣어 미니 패널로 그린다.
 * 키 = 카탈로그 slug(components-catalog.ts). 컴포넌트가 늘면 여기에 프리뷰를 하나 더 둔다.
 */
export const COMPONENT_PREVIEWS: Record<string, ReactNode> = {
  loading: (
    <div className={s.row}>
      <ProgressCircle size={24} aria-hidden />
      <div style={{ width: 96 }}>
        <ProgressBar type="determinate" value={64} />
      </div>
    </div>
  ),
  popup: (
    <div className={s.popupMini}>
      <span className={s.popupTitle}>정말 삭제할까요?</span>
      <span className={s.popupBtns}>
        <Button variant="default" size={24}>
          취소
        </Button>
        <Button variant="delete" size={24}>
          삭제
        </Button>
      </span>
    </div>
  ),
  toast: <Toast className={s.toastStatic} message="저장되었습니다." type="success" hideCloseButton />,
  tooltip: (
    <div className={s.tooltipTile}>
      <Tooltip content="다운로드" open>
        <Button variant="gray" size={32} leftIcon={<DownloadIcon size={18} />} aria-label="다운로드" />
      </Tooltip>
    </div>
  ),
  button: (
    <div className={s.row}>
      <Button variant="primary" size={32}>
        확인
      </Button>
      <Button variant="sub" size={32}>
        취소
      </Button>
    </div>
  ),
  checkbox: (
    <div className={s.row}>
      <Checkbox defaultChecked label="동의" />
      <Radio checked label="선택" />
    </div>
  ),
  input: (
    <div style={{ width: 160 }}>
      <InputField label="이메일" defaultValue="polaris@" />
    </div>
  ),
  'segment-control': (
    <SegmentControl
      variant="filled"
      size="sm"
      defaultValue="a"
      items={[
        { value: 'a', label: '리스트' },
        { value: 'b', label: '그리드' },
      ]}
    />
  ),
  tabs: (
    <Tabs
      layout="hug"
      size="small"
      defaultValue="a"
      items={[
        { value: 'a', label: '전체' },
        { value: 'b', label: '최근' },
      ]}
    />
  ),
  toggle: <Toggle defaultChecked label="알림" />,
  'context-menu': (
    <div className={s.menuTile}>
      <Menu>
        <MenuItem selected>자동 저장</MenuItem>
        <MenuItem>환경 설정</MenuItem>
      </Menu>
    </div>
  ),
  select: (
    <Select
      size="sm"
      width={150}
      value="a"
      options={[
        { value: 'a', label: '문서' },
        { value: 'b', label: '스프레드시트' },
      ]}
    />
  ),
  table: (
    <div className={s.tableTile}>
      <Table columns={TABLE_SAMPLE_COLUMNS} rows={TABLE_SAMPLE_ROWS.slice(0, 2)} />
    </div>
  ),
};

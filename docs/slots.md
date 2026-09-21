# PDS 컴포넌트 구멍 명세

가이드 템플릿에 뚫을 **구멍(슬롯)** 과, 거기에 꽂힐 패키지 컴포넌트의 대응표입니다.

- 패키지: `@polarisoffice/pds-react`
- 문서 사이트: `/components/{slug}` 의 **Code 탭** — 실제 배선 지점
- 전 변형 한눈에: `/showcase`
- 연결점: `src/lib/docs/package.ts` — 패키지명·라이브 목록이 여기 하나
- 값 출처: Figma `📚Polaris Design System` 실측 — md 산문이 아니라 디자인이 정본입니다

---

## 구멍 이름 규약

Figma 의 변형 축을 그대로 씁니다. 축이 여럿이면 `/` 로 잇습니다.

```
button/primary/48          Type=Primary, Size=48
input/error                Status=Error
toggle/on                  Status=on
segment/filled             Type=Primary(채움)
```

축이 없는 컴포넌트(Table·Popup 등)는 컴포넌트 이름만 씁니다.

---

## 1. Button

**Figma** `Action → Button` · Type 10 × Size 6

```
구멍   button/{variant}/{size}
연결   <Button variant={variant} size={size}>버튼</Button>   // size 는 숫자
```

| 축 | 값 |
|---|---|
| `variant` | `primary` · `default` · `ai` · `sub` · `gray` · `black` · `delete` · `ghost` · `blackGhost` · `deleteGhost` |
| `size` | `64` · `54` · `48` · `40` · `32` · `24` (숫자) |

**상태** — 구멍을 따로 뚫지 않습니다. `hover` 는 컴포넌트가 처리하고, 비활성은 `disabled`, 진행 중은 `loading` 을 넘깁니다.

**아이콘** — `leftIcon` / `rightIcon` 에 ReactNode 를 넘깁니다(24×24 자리).

---

## 2. Input Field

**Figma** `Action → Input Filed` · Status 4

```
구멍   input/{status}  또는  input-with-icon
연결   <InputField label="title" placeholder="placholder" />
```

Status 는 prop 이 아니라 **상호작용과 값으로 결정**됩니다. 구멍을 뚫을 때 이렇게 대응하세요.

| Figma Status | 만드는 방법 |
|---|---|
| `default` | 값 없음 — 제목이 placeholder 자리에 있습니다 |
| `Focus` | 클릭하면 제목이 필드 안 상단으로 올라갑니다 |
| `Done` | `defaultValue="Text"` — 값이 있으면 그 배치를 유지합니다 |
| `Error` | `error="Error text"` |

| 옵션 | prop |
|---|---|
| 좌측 아이콘 | `leftIcon={<Icon/>}` (18×18) |
| 비밀번호 표시/숨김 | `revealToggle` |
| 가로 채움 | `fullWidth` |

---

## 3. Toggle

**Figma** `Action → Toggle Switch` · Status off/on · 라벨형 별도

```
구멍   toggle/{off|on}  ·  toggle-labelled
연결   <Toggle checked={on} onChange={setOn} aria-label="…" />
       <Toggle checked={on} onChange={setOn} label="Text" />
```

`label` 을 주면 넓은 형태(61×25), 없으면 기본(35×20)입니다. 비활성은 `disabled`.

---

## 4. Checkbox

**Figma** `Action → checkbox` · unchecked / checked / indeterminate + tone

```
구멍   checkbox/{unchecked|checked|indeterminate}
연결   <Checkbox checked onChange={…} />
```

| 축 | 값 |
|---|---|
| 상태 | `checked` · `indeterminate` · (둘 다 없으면 unchecked) |
| `tone` | `brand`(기본) · `ai` |
| 기타 | `disabled` · `label` |

---

## 5. Radio

**Figma** `Action → radio-btn` · default / blue / purple

```
구멍   radio/{default|checked|ai}
연결   <Radio name="g" value="a" checked onChange={…} />
```

| 축 | 값 |
|---|---|
| `tone` | `accent`(파랑) · `ai`(보라) |
| 기타 | `checked` · `disabled` · `label` · `name` · `value` |

---

## 5-1. RadioGroup

```
구멍   radio-group
연결   <RadioGroup name="plan" defaultValue="basic">
         <Radio value="basic" label="Basic" />
         <Radio value="pro" label="Pro" />
       </RadioGroup>
```

**구멍 하나 = 라디오 묶음 전체**입니다. `name`·선택 상태·`tone` 을 자식에게 내려주므로 낱개 Radio 를 쓸 때처럼 name 을 손으로 맞추지 않아도 됩니다. 제어(`value`)·비제어(`defaultValue`) 둘 다 받습니다.

---

## 6. Tab

**Figma** `Action → Tab` · Type 2 × Status 3

```
구멍   tab/{primary|secondary}
연결   <Tabs value={v} onChange={setV} variant="primary" items={[…]} />
```

**한 구멍 = 탭 묶음 하나**입니다(개별 탭이 아닙니다). `items` 는 `{ value, label, disabled? }` 배열이고, 선택·hover 는 컴포넌트가 처리합니다.

`fill`(기본 true)이면 항목을 균등 분할합니다 — 3~5개일 때 씁니다.

---

## 7. Segment

**Figma** `Action → SegmentControl` · Type 3 × Status 3

```
구멍   segment/{pill|filled|outlined}
연결   <SegmentControl value={v} onChange={setV} variant="pill" items={[…]} />
```

| Figma Type | prop |
|---|---|
| `solid-round` | `pill` — 캡슐형. `count` 로 개수 배지 |
| `Primary` | `filled` — 선택 항목을 accent 로 채움 |
| `secondary` | `outlined` — 선택 항목이 흰 배경 + 그림자 |

**주의** — 선택해도 항목 폭이 변하지 않아야 합니다(디자인은 140 고정). `filled`·`outlined` 는 자동으로 균등 분할됩니다.

---

## 8. Select

**Figma** `Overlay → DropdownList` · Property 1 = Default / Variant2(열림)

```
구멍   select/{lg|md|sm}
연결   <Select size="lg" options={[…]} value={v} onChange={setV} />
```

| 축 | 값 |
|---|---|
| `size` | `lg`(52) · `md`(38) · `sm`(26) |

열림 상태는 클릭하면 나옵니다 — 테두리가 accent 로 바뀌고 메뉴가 트리거와 같은 너비로 열립니다. 메뉴는 Context & Menu Item 을 그대로 씁니다.

⚠️ **`md`·`sm` 수치는 Figma 가 아니라 PDS 문서 사이트에서 왔습니다.** Figma 에는 `lg` 만 있습니다 — 확인이 필요합니다.

---

## 9. Menu Item / Menu

**Figma** `Overlay → MenuItem` · Default / Hover / Selected

```
구멍   menu-item/{default|selected}  ·  menu
연결   <Menu width={152}>
         <MenuItem selected>Text</MenuItem>
       </Menu>
```

| prop | 뜻 |
|---|---|
| `selected` | 좌측 체크 + 글자 진해짐 |
| `hasSubmenu` | 우측 화살표 |
| `hideCheck` | 좌측 체크 자리 없앰 |
| `disabled` | 비활성 |

폭은 부모를 채웁니다 — 고정 px 를 주지 않는 것이 규칙입니다.

---

## 10. Badge

**Figma** `Contents → badge` · Status Default / Selected

```
구멍   badge/{default|selected}
연결   <Badge>Text</Badge>
       <Badge selected onClick={…}>Text</Badge>
```

`onClick` 을 주면 `<button>` 으로 렌더됩니다(누를 수 있는 필터 태그).

---

## 11. Credit

**Figma** `Contents → credit` · Property 1 = true / false

```
구멍   credit/{available|unavailable}
연결   <Credit value={10} />
       <Credit value={10} available={false} />
```

보라(`ai-normal`)는 AI 기능 전용 색입니다 — 다른 맥락에 쓰지 않습니다.
`icon` prop 으로 실제 크레딧 아이콘을 넘길 수 있습니다(현재 기본값은 임시 글리프).

---

## 12. Table

**Figma** `Contents → Table`

```
구멍   table
연결   <Table columns={[{ header, cell }]} rows={[…]} />
```

헤더는 항상 포함합니다. 열 구분선은 `columnDividers` 로 켜되 꼭 필요할 때만 씁니다.

---

## 13. Tooltip

**Figma** `Feedback → Tooltip` · 화살표 방향 5

```
구멍   tooltip/{top|bottom|left|right|none}
연결   <Tooltip content="Text" placement="top"><button/></Tooltip>
```

**감싸는 컴포넌트**입니다 — 구멍 안에 트리거가 들어갑니다. 첫 호버 600ms, 이어지는 호버 100ms(케스케이드).

`open` 을 주면 항상 열린 상태로 고정됩니다(문서용).

⚠️ 미구현: 가장자리 자동 반전. `placement` 로 지정한 방향에 그대로 붙습니다.

---

## 14. Toast

**Figma** `Feedback → toast` · type success / fail

```
구멍   toast/{default|success|error}
연결   toast.success('…')   // 명령형 — Toaster 는 첫 호출 때 자동 마운트
```

화면 가장자리에 고정됩니다(`placement` = `top`/`bottom`, 여백 50px). 3초 뒤 자동으로 닫힙니다. **안에 버튼·링크를 넣지 않습니다.**

견본으로 보여줄 때는 "열기" 버튼을 두는 편이 낫습니다 — 타일 안에 눕히면 실제 성질이 안 보입니다.

---

## 15. Popup

**Figma** `Feedback → Popup` · ONE BTN 3케이스 / TWO BTN 2케이스

```
구멍   popup/{one|one-x|one-dont|two|two-dont}
연결   <Popup title="Title" body="Body"
              primaryAction={{ label: '버튼', onClick }}
              secondaryAction={{ label: '버튼', onClick }}   // TWO BTN
              onClose={…} showCloseButton={false}            // X 숨김
              dontShowAgain={{ checked, onChange }} />
```

| Figma 케이스 | 만드는 방법 |
|---|---|
| ONE BTN | `primaryAction` 만 + `showCloseButton={false}` |
| ONE BTN + X BTN | `primaryAction` + `onClose` |
| 다시보지않기 | `dontShowAgain` 추가 |
| TWO BTN | `secondaryAction` 추가 — X 는 자동으로 숨겨집니다 |

`onClose` 는 Esc·딤 클릭에 연결됩니다. X 표시는 `showCloseButton` 이 따로 정합니다 — 레이블이 '닫기'면 끕니다.

---

## 16. Dim

**Figma** `Overlay → dim` · loading true / false

```
구멍   dim/{loading|plain}
연결   <Dim loading />        <Dim loading={false} />
```

부모를 덮습니다(`position: absolute`) — **구멍이 크기를 가져야** 보입니다. 화면 전체를 덮으려면 `fullscreen`.

스피너는 Loading 스펙의 `ProgressCircle` 48 을 씁니다 — 딤 위에서는 색 규칙대로 `static/white` 입니다(18번).

---

## 17. Icon Button

**Figma** 없음 — md 스펙(`icon-button`)만 있습니다.

```
구멍   icon-button/{40|32|28}
연결   <IconButton icon={<UserIcon />} aria-label="내 정보" />
```

레이블이 없으니 **`aria-label` 을 반드시** 주고, PDS 규칙대로 `Tooltip` 을 함께 붙입니다. 파괴적 액션에는 쓰지 않습니다(레이블 있는 버튼을 씁니다).

`icon` 을 안 주면 자리표시 글리프를 그립니다 — 문서에서 모양만 볼 때 씁니다.

---

## 18. Progress Circle

**Figma** `Feedback → Loading / ProgressCircle` · Size 18 / 24 / 32 / 48

```
구멍   progress-circle/{18|24|32|48}
연결   <ProgressCircle size={24} />
       <ProgressCircle size={48} color="var(--color-static-white)" />
```

박스 18/24/32/48 안에 링 12/16/22/32, 선 두께 1.5/2/3/4 입니다. 트랙(옅은 원)은 **없습니다** — 호 하나가 길어졌다 짧아지며 돕니다.

색은 `color` 로 바꿉니다. 기본 `label/alternative`, 어두운 배경·Black 버튼 위는 `static/white`, 버튼 안은 라벨을 따르도록 `currentColor` 입니다. 버튼은 `loading` 을 켜면 아이콘 자리에 자동으로 들어갑니다.

⚠️ 회전은 주기당 **356.4도**입니다(360 아님). 뒤끝이 99%→0 으로 되돌아가며 생기는 3.6도를 상쇄해 이음매를 감춥니다 — 360 으로 고치면 매 주기 튑니다.

---

## 19. Progress Bar

**Figma** `Feedback → Loading / ProgressBar` · Type Indeterminate / Determinate

```
구멍   progress-bar/{indeterminate|determinate}
연결   <ProgressBar />
       <ProgressBar type="determinate" value={60} />
```

높이 4, 너비는 영역에 맞춥니다(기본 100%) — **구멍이 폭을 가져야** 보입니다. Indeterminate 는 전체 너비의 30% 구간이 1.5초 주기로 좌에서 우로 지나가고, Determinate 는 `value`(0~100)를 200ms ease-out 으로 채웁니다.

4초 이상이며 진행률을 계산할 수 있는 작업에 씁니다. 10초를 넘으면 예상 소요 시간을 함께 보여 줍니다.

---

## 20. Skeleton

**Figma** `Feedback → Loading / Skeleton` · Shape Rect / Circle / Text

```
구멍   skeleton/{rect|circle|text}
연결   <Skeleton />
       <Skeleton shape="circle" width={40} />
       <Skeleton shape="text" width={200} height={12} />
```

실제 콘텐츠와 **같은 위치·같은 크기**로 둡니다. `Circle` 은 아바타, `Text` 는 문장 한 줄 — 여러 줄은 쌓고 마지막 줄을 짧게 만듭니다.

움직임은 블록 전체의 투명도가 100%↔30% 를 오가는 것입니다. **쓸고 지나가는 빛(shimmer)이 아닙니다** — 그라데이션을 넣지 마세요.

---

## 확인 방법

```bash
npm run verify:figma     # 렌더 결과를 Figma 실측값과 대조 (111건)
npm run verify:slots     # 이 문서의 짝 figma/slots.json 을 패키지와 대조 (41건)
npm run dev              # /showcase 에서 전 변형 확인
```

## 아직 정리되지 않은 것

- **아이콘** — 체크·화살표는 임시 글리프이고 `DownloadIcon`·`UserIcon` 둘만 예제용으로 있습니다. PDS 아이콘 라이브러리를 받으면 교체합니다
- **Select `md`·`sm`** — Figma 에 없는 크기입니다(위 참조)
- **Figma 에 없는 컴포넌트** — `avatar` · `status-dot` · `thumbnail-card` 는 md 스펙 맵에만 있고 디자인에 없습니다 (`icon-button` 은 문서가 요구해 md 스펙대로 만들었습니다 — 17번)

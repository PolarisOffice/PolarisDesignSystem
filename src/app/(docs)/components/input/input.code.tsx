'use client';

import { useState } from 'react';

import { InputField, UserIcon } from '@polarisoffice/pds-react';

import { CodeExample, CodeTabShell, type CodeExampleSpec } from '@/components/docs/CodeExample';
import { DemoRow, DemoCol } from '@/components/docs/Demo';
import { PDS_PACKAGE } from '@/lib/docs/package';

const IMPORT = `import { InputField } from '${PDS_PACKAGE}';`;

/**
 * Controlled 는 겉모습이 Base 와 같아서, 값을 밖에서 쥐고 있다는 게 화면에
 * 드러나지 않는다 — 붙잡고 있는 state 를 옆에 같이 보여 준다.
 */
function ControlledDemo() {
  const [email, setEmail] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <InputField
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 입력"
      />
      <span style={{ fontSize: 13, color: 'var(--color-label-alternative)' }}>
        email = {email ? `"${email}"` : '""'}
      </span>
    </div>
  );
}

export const EXAMPLES: CodeExampleSpec[] = [
  {
    id: 'base',
    title: 'Base',
    desc: 'Simple(placeholder 만)과 Labeled(title 포함). 폼 입력에는 Labeled 를 권장해요.',
    previewName: 'InputField',
    preview: (
      <DemoRow>
        <DemoCol label="Simple">
          <InputField placeholder="placeholder" />
        </DemoCol>
        <DemoCol label="Labeled">
          <InputField label="title" placeholder="placeholder" />
        </DemoCol>
      </DemoRow>
    ),
    code: `${IMPORT}

<InputField placeholder="placeholder" />
<InputField label="title" placeholder="placeholder" />`,
  },
  {
    id: 'password',
    title: 'Password',
    desc: '비밀번호 필드에는 항상 눈 아이콘(Right Icon)을 제공해요. 기본 상태는 숨김(eye-off).',
    previewName: 'InputField',
    preview: (
      <DemoRow>
        <InputField type="password" label="비밀번호" placeholder="비밀번호 입력" />
      </DemoRow>
    ),
    code: `${IMPORT}

<InputField type="password" label="비밀번호" placeholder="비밀번호 입력" />`,
  },
  {
    id: 'left-icon',
    title: 'Left Icon',
    desc: '이메일·아이디처럼 입력 유형을 아이콘으로 암시할 때. 좌측 아이콘이 있으면 padding-x 는 46px.',
    previewName: 'InputField',
    preview: (
      <DemoRow>
        <InputField leftIcon={<UserIcon />} label="아이디" placeholder="아이디 입력" />
      </DemoRow>
    ),
    code: `${IMPORT}
// 해당 아이콘은 임시 아이콘이라 교체해서 써야 해요.
import { UserIcon } from '${PDS_PACKAGE}';

<InputField leftIcon={<UserIcon />} label="아이디" placeholder="아이디 입력" />`,
  },
  {
    id: 'error',
    title: 'Error',
    desc: '빨간 테두리만으론 부족해요. 반드시 Error Message 로 원인을 구체적으로 알려요.',
    previewName: 'InputField',
    preview: (
      <DemoRow>
        <InputField
          label="이메일"
          defaultValue="polaris@"
          error="이메일 형식이 올바르지 않습니다."
        />
      </DemoRow>
    ),
    code: `${IMPORT}

<InputField
  label="이메일"
  value="polaris@"
  error="이메일 형식이 올바르지 않습니다."
/>`,
  },
  {
    id: 'controlled',
    title: 'Controlled',
    desc: '값과 에러를 바깥에서 관리할 때.',
    previewName: 'InputField',
    preview: (
      <DemoRow>
        <ControlledDemo />
      </DemoRow>
    ),
    code: `${IMPORT}
import { useState } from 'react';

const [email, setEmail] = useState('');

<InputField
  label="이메일"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="이메일 입력"
/>`,
  },
];

export default function InputCode() {
  return (
    <CodeTabShell live>
      {EXAMPLES.map((ex) => (
        <CodeExample key={ex.id} {...ex} />
      ))}
    </CodeTabShell>
  );
}

import type { Metadata } from 'next';
import PageLead from '@/components/docs/PageLead';
import DocTabs from '@/components/docs/DocTabs';
import { pageMeta } from '@/lib/docs/pages';
import { isComponentLive } from '@/lib/docs/package';
import DatePickerDesign, { DatePickerSpecification } from './date-picker.design';
import DatePickerCode from './date-picker.code';

const meta = pageMeta('/components/date-picker')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 2026-10-14 신설 */
export default function DatePickerPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        날짜 하나나 기간을 고르는 입력칸과 달력이에요. 달력에서 누르거나 입력칸에 직접 칠 수 있어요.
      </PageLead>
      <DocTabs
        design={<DatePickerDesign />}
        code={
          <>
            <DatePickerCode />
            <DatePickerSpecification />
          </>
        }
        codeBadge={isComponentLive('date-picker') ? undefined : '준비 중'}
      />
    </>
  );
}

import type { ReactNode } from 'react';
import s from './Anatomy.module.css';

export interface AnatomyItem {
  /** 번호 라벨 — "01", "02" … */
  n: string;
  /** 콜아웃이 가리킬 실제 컴포넌트 견본 (legend 전용으로 쓸 땐 생략) */
  sample?: ReactNode;
  title: string;
  desc?: string;
}

/**
 * 구성 요소 설명 — 원본 컴포넌트 문서의 Anatomy 섹션(9개 페이지, `.anat-*` 67회).
 *
 * 원본은 위쪽 번호 콜아웃(`.anat-num`+`.anat-line`+`.anat-dot`)과 아래쪽 번호별 설명 목록이
 * **서로 다른 마크업으로 따로** 쓰여 있어 번호·문구가 어긋날 수 있었다. 같은 `items` 배열로
 * 둘 다 그리면 구조적으로 어긋날 수 없다.
 *
 * `callout` 은 견본이 있는 항목만 그린다 — 설명만 있는 항목은 legend 에만 나온다.
 */
export default function Anatomy({ items }: { items: AnatomyItem[] }) {
  const withSample = items.filter((i) => i.sample);
  return (
    <>
      {withSample.length > 0 && (
        <div className={s.wrap}>
          {withSample.map((item) => (
            <div key={item.n} className={s.item}>
              <span className={s.num}>{item.n}</span>
              <span className={s.line} aria-hidden="true" />
              <span className={s.dot} aria-hidden="true" />
              {item.sample}
            </div>
          ))}
        </div>
      )}
      <ul className={s.legend}>
        {items.map((item) => (
          <li key={item.n} className={s.legendItem}>
            <span className={s.legendNum}>{item.n}</span>
            <div>
              <div className={s.legendTitle}>{item.title}</div>
              {item.desc && <div className={s.legendDesc}>{item.desc}</div>}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

import type { Metadata } from 'next';
import { H2, H3 } from '@/components/docs/Heading';
import PageLead from '@/components/docs/PageLead';
import { pageMeta } from '@/lib/docs/pages';
import s from './terms.module.css';
import { withBase } from '@/lib/basePath';
import { IS_HOSTED } from '@/lib/hosting';

const meta = pageMeta('/terms')!;
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** 브랜드 자산 사용 허가·문의처 — public/brand-assets/LICENSE.md §10 과 동일 값 (법무팀 지정) */
const BRAND_CONTACT = 'jhchae@polarisoffice.com';
/** PDS 일반 문의 — AX추진팀 (2026-09-04 지정) */
const GENERAL_CONTACT = { team: 'AX추진팀', email: 'vibeops_admin@polarisoffice.com' };

/**
 * `/terms` — 이용약관 (2026-09-04 초안, 몬타주 terms-of-use 구성 참고).
 *
 * 독자는 **PDS를 쓰는 사용자**(디자이너·개발자)다 — 파일명·폴더명·조항 번호·의존성 같은
 * 저장소 내부 문맥은 쓰지 않는다(2026-09-04 피드백). 근거 문서와의 대응은 여기 주석에만 둔다:
 *  · 2절 = LICENSE(Apache-2.0) 요약 — 특허 조항은 사용자 관점에서 생략, 원문이 규율
 *  · 3절 = public/brand-assets/LICENSE.md(법무팀 확정 문안) 10개 조항 순서 그대로 — 원문이 바뀌면 여기도
 *  · 7절 = 실제 동작(분석 스크립트 없음, /kit 업로드는 로컬 designs/ 저장)에 근거
 * 이 페이지는 **요약**이라 원문 우선 문장을 1절에 둔다.
 *
 * 문장 규칙: 해요체(UX Writing "문서 사이트 산문") · 한 줄에 한 문장 · 나열은 목록.
 * 헤딩 텍스트는 검색 정답지(headings.json)·슬러그 검사와 묶여 있으니 바꾸면
 * `npm run docs:headings-refresh` 를 다시 돌린다.
 */
export default function TermsPage() {
  return (
    <>
      <h1>{meta.title}</h1>
      <PageLead>
        Polaris Design System을 사용할 때 적용되는 조건이에요. 코드와 문서는 자유롭게 쓸 수 있고, 로고 등
        브랜드 자산은 별도 라이선스를 따라요.
      </PageLead>

      <div className={s.body}>
        <H2>1. 약관 적용</H2>
        <p>Polaris Design System(이하 PDS)을 사용하면 이 약관이 적용돼요.</p>
        {/* GitHub 저장소 공개 시 '문서 사이트, npm 패키지, GitHub 저장소로' 로 바꾸고 저장소 링크를 단다 */}
        <p>PDS는 폴라리스오피스가 만든 디자인 시스템이에요. 문서 사이트와 npm 패키지로 제공해요.</p>
        <p>PDS에는 두 가지 라이선스가 적용돼요.</p>
        <ul>
          <li>
            <strong>코드와 문서</strong>는{' '}
            <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noreferrer">
              Apache License 2.0
            </a>
            을 따라요. 자유롭게 쓸 수 있어요.
          </li>
          <li>
            <strong>로고 등 브랜드 자산</strong>은 별도의{' '}
            <a href={withBase('/brand-assets/LICENSE.md')}>브랜드 자산 라이선스</a>를 따라요. 오픈소스 라이선스에 포함되지
            않아요.
          </li>
        </ul>
        <p>다음 목적으로는 PDS를 쓸 수 없어요.</p>
        <ul>
          <li>피싱, 사기, 개인정보 탈취처럼 불법이거나 공익에 반하는 목적</li>
          <li>폴라리스오피스를 사칭하거나, 폴라리스오피스가 만든 것처럼 보이게 하는 방식</li>
        </ul>

        <H2>2. 라이선스</H2>
        <p>PDS의 코드, 디자인 토큰, 컴포넌트, 문서는 Apache License 2.0 오픈소스예요.</p>
        <p>상업적 목적을 포함해 어떤 용도로든 사용, 수정, 배포할 수 있어요.</p>
        <H3>허용 사항</H3>
        <ul>
          <li>상업적 목적을 포함해 어떤 용도로든 쓸 수 있어요.</li>
          <li>수정하고 파생 저작물을 만들 수 있어요.</li>
          <li>원본이나 수정본을 배포할 수 있어요.</li>
          <li>개인적으로 써도 돼요.</li>
        </ul>
        <H3>의무 사항</H3>
        <ul>
          <li>배포할 때는 라이선스 전문과 저작권 고지를 함께 넣어요.</li>
          <li>수정해서 배포하면 수정했다는 사실을 표시해요.</li>
          <li>원본에 있는 저작권·상표 고지를 지우지 않아요.</li>
        </ul>
        <H3>제한 사항</H3>
        <ul>
          <li>폴라리스오피스의 이름, 로고, 상표를 쓸 권한은 포함되지 않아요. 3절을 따라요.</li>
          <li>PDS는 있는 그대로 제공하고, 어떤 보증도 하지 않아요. 6절에 있어요.</li>
          <li>1절의 불법·사칭 목적으로는 쓸 수 없어요.</li>
        </ul>

        <H2>3. 브랜드 자산 (Brand Assets License)</H2>
        <p>폴라리스오피스와 계열사의 브랜드 자산은 오픈소스 라이선스에 포함되지 않아요.</p>
        <p>브랜드 자산에는 다음이 포함돼요.</p>
        <ul>
          <li>로고, 로고마크, 워드마크</li>
          <li>상표, 서비스 마크, 상호, 제품명</li>
          <li>아이콘, 브랜드 그래픽, 브랜드 색 조합, 시각 아이덴티티 요소</li>
          <li>그 밖의 관련 디자인 자료</li>
        </ul>
        <p>로고 에셋 페이지에서 내려받는 파일도 모두 브랜드 자산이에요.</p>
        <H3>권리의 보유</H3>
        <ul>
          <li>브랜드 자산의 모든 권리는 폴라리스오피스에 있어요.</li>
          <li>브랜드 자산 라이선스에 적힌 제한적인 권리 외에는 어떤 권리도 주지 않아요.</li>
          <li>PDS를 쓸 수 있다고 해서 브랜드 자산까지 써도 되는 건 아니에요.</li>
        </ul>
        <H3>사용할 수 있는 경우</H3>
        <p>폴라리스오피스가 서면으로 허용하거나 브랜드 가이드라인에서 허용한 경우에만 쓸 수 있어요.</p>
        <p>그때도 다음을 지켜요.</p>
        <ul>
          <li>허용된 범위, 기간, 매체, 형식을 그대로 따라요.</li>
          <li>허용에 없다면 변형, 재채색, 자르기, 합성, 애니메이션을 하지 않아요.</li>
          <li>오해를 일으키거나 폴라리스오피스의 평판을 해칠 수 있는 방식으로 쓰지 않아요.</li>
          <li>승인된 관계가 아니라면 후원, 제휴, 인증 관계가 있는 것처럼 보이게 쓰지 않아요.</li>
        </ul>
        <H3>금지되는 사용</H3>
        <p>허용받지 않았다면 다음은 할 수 없어요.</p>
        <ul>
          <li>복제, 수정, 배포, 판매, 재사용 목적의 다운로드</li>
          <li>제품, 서비스, 웹사이트, 앱, 도메인, 소셜 미디어 계정에 사용</li>
          <li>마케팅 자료, 광고, 상품에 사용</li>
          <li>브랜드 자산에 붙은 권리 고지를 지우거나 바꾸는 것</li>
          <li>출처나 제휴 관계를 헷갈리게 하는 비슷한 표장 사용</li>
          <li>브랜드 자산과 같거나 비슷한 상표, 상호, 도메인 등록</li>
        </ul>
        <H3>디자인 시스템 컴포넌트와의 관계</H3>
        <ul>
          <li>컴포넌트, 토큰, 문서는 자유롭게 쓸 수 있어요.</li>
          <li>그 안에 브랜드 자산을 넣어 쓰는 건 별개예요.</li>
          <li>PDS로 만든 제품이 폴라리스오피스 제품처럼 보이면 안 돼요.</li>
        </ul>
        <H3>허용의 종료</H3>
        <ul>
          <li>브랜드 자산 라이선스나 브랜드 가이드라인을 어기면 사용 허가는 즉시 끝나요.</li>
          <li>끝나면 바로 사용을 멈추고, 요청이 있으면 갖고 있는 사본을 지워요.</li>
        </ul>

        <H2>4. 서체와 제3자 자료</H2>
        <ul>
          <li>PDS는 Pretendard 서체를 기준으로 설계했어요.</li>
          <li>서체 파일은 PDS에 들어 있지 않아요. 직접 설치하고, 서체 라이선스를 확인해 주세요.</li>
          <li>폴라리스오피스의 브랜드 서체는 제공하지 않아요.</li>
          <li>PDS에 포함된 제3자 자료는 없어요.</li>
        </ul>

        <H2>5. 기여 가이드라인</H2>
        <H3>기여 방법</H3>
        <ul>
          {/* GitHub 저장소 공개 시 이슈·PR 안내 줄을 여기에 추가한다 */}
          <li>문서 오류, 컴포넌트 개선 제안, 접근성 문제 제보를 환영해요.</li>
          <li>
            {GENERAL_CONTACT.team} <a href={`mailto:${GENERAL_CONTACT.email}`}>{GENERAL_CONTACT.email}</a> 로
            보내 주세요.
          </li>
        </ul>
        <H3>기여자 동의</H3>
        <ul>
          <li>기여한 내용은 PDS의 일부로서 Apache License 2.0에 따라 공개돼요.</li>
          <li>기여한 내용의 저작권은 기여자에게 있어요.</li>
          <li>브랜드 자산은 기여 대상이 아니에요.</li>
        </ul>

        <H2>6. 면책 조항</H2>
        <ul>
          <li>PDS는 있는 그대로 제공해요.</li>
          <li>폴라리스오피스와 기여자는 어떤 보증도 하지 않아요.</li>
          <li>PDS를 써서 생긴 손해에 책임지지 않아요.</li>
          <li>브랜드 자산에도 같은 면책이 적용돼요.</li>
        </ul>

        <H2>7. 개인정보 보호</H2>
        <ul>
          <li>이 문서 사이트는 방문자의 개인정보를 수집하지 않아요.</li>
          <li>분석·추적 도구도 쓰지 않아요.</li>
          {/* 공개 서버(IS_HOSTED)엔 업로드가 없어 이 조항도 뺀다 — 없는 기능을 약관이 언급하지 않게 */}
          {!IS_HOSTED && (
            <li>
              &quot;내 디자인 시스템&quot; 에 올린 파일은 사용자의 컴퓨터에만 저장돼요. 폴라리스오피스로
              전송되지 않아요.
            </li>
          )}
          <li>npm, GitHub 같은 외부 플랫폼에서는 그 플랫폼의 개인정보 처리방침이 적용돼요.</li>
        </ul>

        <H2>8. 약관의 변경</H2>
        <ul>
          <li>이 약관은 필요에 따라 바뀔 수 있어요.</li>
          {/* GitHub 저장소 공개 시 'GitHub Releases 로도 알려요' 를 덧붙인다 */}
          <li>중요한 변경은 이 페이지에서 알려요.</li>
          <li>바뀐 뒤에도 PDS를 계속 쓰면 바뀐 약관에 동의한 것으로 봐요.</li>
        </ul>

        <H2>9. 문의</H2>
        <ul>
          <li>
            브랜드 자산 사용 허가: <a href={`mailto:${BRAND_CONTACT}`}>{BRAND_CONTACT}</a>
          </li>
          <li>
            PDS 일반 문의: {GENERAL_CONTACT.team}{' '}
            <a href={`mailto:${GENERAL_CONTACT.email}`}>{GENERAL_CONTACT.email}</a>
          </li>
        </ul>
      </div>
    </>
  );
}

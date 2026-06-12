// ============================================================
// PARTNER LINKS — 제휴 링크 설정
// ============================================================
// 제휴 계약 체결 시 href 만 트래킹 링크로 교체하면 됨 (UI 수정 불필요).
// 계약 전에는 파트너 공식 페이지로 연결 (수익 미발생, 동선 검증용).
// 표시 화면: docs/monetization-plan.md §3-2 금융 제휴 (CPA) 참고.

export type PartnerSurface = "loan" | "salary";

export interface PartnerLink {
  id: string;
  partner: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

const UTM = "utm_source=dayflow&utm_medium=referral";

function withUtm(href: string, campaign: PartnerSurface): string {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}${UTM}&utm_campaign=${campaign}`;
}

const PARTNER_LINKS: Record<PartnerSurface, PartnerLink[]> = {
  loan: [
    {
      id: "loan-finda",
      partner: "핀다",
      title: "내 조건으로 대출 금리 비교하기",
      desc: "여러 금융사 한도·금리를 한 번에 조회해도 신용점수에 영향 없어요.",
      href: "https://finda.co.kr",
      cta: "금리 비교하기",
    },
    {
      id: "loan-kakaopay",
      partner: "카카오페이",
      title: "대출 갈아타기 알아보기",
      desc: "지금 내는 이자가 아깝다면, 더 낮은 금리로 갈아탈 수 있는지 확인해봐요.",
      href: "https://www.kakaopay.com/loan",
      cta: "갈아타기 조회",
    },
  ],
  salary: [
    {
      id: "salary-irp",
      partner: "IRP·연금저축",
      title: "연말정산 세액공제 챙기기",
      desc: "IRP·연금저축으로 연 최대 148.5만 원까지 세액공제 받을 수 있어요.",
      href: "https://www.fss.or.kr/fss/main/contents.do?menuNo=200652",
      cta: "한도 알아보기",
    },
    {
      id: "salary-credit",
      partner: "신용점수",
      title: "내 신용점수 무료로 확인하기",
      desc: "조회해도 점수에 영향 없어요. 연봉 관리의 시작은 신용 관리부터.",
      href: "https://toss.im",
      cta: "무료 조회",
    },
  ],
};

export function getPartnerLinks(surface: PartnerSurface): PartnerLink[] {
  return PARTNER_LINKS[surface].map((link) => ({
    ...link,
    href: withUtm(link.href, surface),
  }));
}

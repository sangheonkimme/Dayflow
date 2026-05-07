// ============================================================
// TRANSACTION_SEEDS — 데모용 12개월 합성 데이터
// 매월 반복(월급/월세/구독)과 다양한 일회성 거래 혼합.
// 시드는 결정적(deterministic) — 재실행 시 같은 결과.
// ============================================================

import type { Txn } from '@/types';

let _id = 0;
const nextId = () => `seed-${++_id}`;

const out = (
  date: string,
  time: string,
  label: string,
  amount: number,
  cat: string,
  pay = '신한카드',
  note = '',
): Txn => ({
  id: nextId(),
  date,
  time,
  label,
  note,
  amount: -Math.abs(amount),
  type: 'out',
  cat,
  pay,
});

const inn = (
  date: string,
  time: string,
  label: string,
  amount: number,
  cat: string,
  pay = '신한 입금',
  note = '',
  payday = false,
): Txn => ({
  id: nextId(),
  date,
  time,
  label,
  note,
  amount: Math.abs(amount),
  type: 'in',
  cat,
  pay,
  ...(payday ? { payday: true } : {}),
});

// 12개월 합성: 2025-06 ~ 2026-05 (오늘 기준 2026-05-07)
const months: Array<[number, number]> = [
  [2025, 6], [2025, 7], [2025, 8], [2025, 9], [2025, 10], [2025, 11],
  [2025, 12], [2026, 1], [2026, 2], [2026, 3], [2026, 4], [2026, 5],
];

const ymd = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const seeds: Txn[] = [];

for (const [y, m] of months) {
  // 매월 고정
  seeds.push(inn(ymd(y, m, 25), '09:00', '월급 입금', 3650000, '급여', '신한 입금', '(주)디자인하우스', true));
  seeds.push(out(ymd(y, m, 1), '10:00', '월세', 850000, '주거', '자동이체', `${m}월분`));
  seeds.push(out(ymd(y, m, 1), '08:00', '헬스장', 89000, '건강', '자동이체', '월 정기'));
  seeds.push(out(ymd(y, m, 5), '09:00', '넷플릭스', 17000, '구독', '신한카드', '프리미엄'));
  seeds.push(out(ymd(y, m, 7), '10:00', 'ChatGPT Plus', 28000, '구독', '현대카드', ''));
  seeds.push(out(ymd(y, m, 12), '10:00', '스포티파이', 11000, '구독', '신한카드', ''));

  // 식비/외식 — 매주 4-5건
  const day = (d: number) => ymd(y, m, Math.min(d, 28));
  seeds.push(out(day(3),  '12:30', 'GS25',           4800,  '식비', '현대카드', '간식'));
  seeds.push(out(day(4),  '13:00', '김밥천국',        8500,  '식비', '현금', '점심'));
  seeds.push(out(day(8),  '14:32', '스타벅스',        6300,  '식비', '신한카드', '카페'));
  seeds.push(out(day(10), '20:00', '한식주점 도담',   42000, '외식', '신한카드', '팀 회식'));
  seeds.push(out(day(11), '12:10', '이마트',          78400, '식비', '현대카드', '주말 장보기'));
  seeds.push(out(day(15), '13:20', '버거킹',          12500, '식비', '현대카드', ''));
  seeds.push(out(day(18), '19:30', '피자스쿨',        18900, '외식', '신한카드', ''));
  seeds.push(out(day(20), '08:30', '스타벅스',        4900,  '식비', '신한카드', '아메리카노'));
  seeds.push(out(day(22), '12:00', '쿠우쿠우',        16800, '외식', '현대카드', '점심'));

  // 교통
  seeds.push(out(day(2),  '08:00', '지하철',          50000, '교통', '신한카드', '교통카드 충전'));
  seeds.push(out(day(14), '23:14', '택시',            18400, '교통', '신한카드', '심야할증'));

  // 쇼핑
  seeds.push(out(day(6),  '18:22', '올리브영',        56700, '쇼핑', '신한카드', '스킨케어'));
  seeds.push(out(day(13), '12:00', '무신사',          64000, '쇼핑', '현대카드', '셔츠'));
  seeds.push(out(day(16), '21:08', '쿠팡',            34500, '쇼핑', '신한카드', '생필품'));

  // 여가/도서
  seeds.push(out(day(19), '20:00', 'CGV',             28000, '여가', '현대카드', '영화'));
  seeds.push(out(day(24), '19:18', '교보문고',        32400, '도서', '신한카드', '책 2권'));

  // 부수입 (분기별로 한 번)
  if (m % 3 === 0) {
    seeds.push(inn(day(15), '15:32', '프리랜서 수익', 450000, '부수입', '토스 입금', '디자인 프로젝트'));
  }
}

// 이번 달(2026-05) 최근 1주일 — 더 디테일하게 (홈 화면에 잘 보이도록)
seeds.push(out('2026-05-07', '08:30', '스타벅스 강남R점', 5900,  '식비', '신한카드', '아침'));
seeds.push(out('2026-05-07', '12:40', '샐러디',         11500, '식비', '현대카드', '점심'));
seeds.push(out('2026-05-06', '14:32', '스타벅스',       12300, '식비', '신한카드', '팀원과 1:1'));
seeds.push(out('2026-05-06', '21:20', '배달의민족',     23800, '외식', '현대카드', '저녁'));
seeds.push(out('2026-05-05', '11:00', '이마트',         62400, '식비', '현대카드', '주말 장보기'));
seeds.push(out('2026-05-04', '18:00', '올리브영',       38900, '쇼핑', '신한카드', ''));
seeds.push(out('2026-05-03', '13:50', '김밥천국',       8500,  '식비', '현금', ''));
seeds.push(inn('2026-05-02', '14:00', '환불 — 무신사', 32000, '환불', '신한 입금', '사이즈 교환'));

export const TRANSACTION_SEEDS: Txn[] = seeds;

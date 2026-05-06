// ============================================================
// subscriptions mapper — Subscription ↔ public.subscriptions
// ============================================================

import type { Subscription, SubCycle, SubStatus } from '@/types';
import type { TablesInsert, Tables } from '@/shared/data/source/db.types';

type Row = Tables<'subscriptions'>;
type Insert = TablesInsert<'subscriptions'>;

export interface SubJoinedRow extends Row {
  categories?: { name: string; color: string | null } | null;
}

const cycleToDomain: Record<string, SubCycle> = {
  monthly: '월',
  yearly: '년',
  weekly: '월', // 주 단위는 도메인에 없음 — 가장 가까운 '월'로 매핑
};
const cycleToRow: Record<SubCycle, 'monthly' | 'yearly'> = {
  '월': 'monthly',
  '년': 'yearly',
};

export function toDomain(row: SubJoinedRow): Subscription {
  const status: SubStatus = row.active ? 'active' : 'paused';
  const day = row.next_billing_at ? Number(row.next_billing_at.slice(8, 10)) : undefined;
  return {
    id: row.id,
    name: row.name,
    cat: row.categories?.name ?? '기타',
    price: row.amount,
    cycle: cycleToDomain[row.cycle] ?? '월',
    day: day && !isNaN(day) ? day : undefined,
    status,
    color: row.categories?.color ?? undefined, // selector에서 한 번 더 derive
    started: row.created_at.slice(0, 7).replace('-', '.'),
  };
}

export interface SubToRowContext {
  userId: string;
  categoryId?: string | null;
}

export function toRow(input: Partial<Subscription>, ctx: SubToRowContext): Insert {
  // next_billing_at: day가 있으면 이번 달의 해당 일, 아니면 today
  const today = new Date();
  const day = input.day ?? today.getDate();
  const next_billing_at = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    user_id: ctx.userId,
    name: input.name ?? '',
    amount: input.price ?? 0,
    cycle: cycleToRow[input.cycle ?? '월'],
    next_billing_at,
    category_id: ctx.categoryId ?? null,
    active: (input.status ?? 'active') === 'active',
  };
}

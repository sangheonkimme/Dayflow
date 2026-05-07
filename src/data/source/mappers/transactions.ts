// ============================================================
// transactions mapper — Txn ↔ public.transactions
// ============================================================

import type { Txn, TxnType } from '@/types';
import type { TablesInsert, Tables } from '@/data/source/db.types';

type Row = Tables<'transactions'>;
type Insert = TablesInsert<'transactions'>;

/** Joined row shape used when selecting with categories/accounts. */
export interface TxnJoinedRow extends Row {
  categories?: { name: string; color: string | null } | null;
  accounts?: { name: string } | null;
}

/** DB row → 도메인. amount는 항상 양수로 저장되며, kind에서 type을 derive. */
export function toDomain(row: TxnJoinedRow): Txn {
  const date = row.occurred_at.slice(0, 10);
  const time = row.occurred_at.length >= 16 ? row.occurred_at.slice(11, 16) : undefined;
  const type: TxnType = row.kind === 'income' ? 'in' : 'out';
  return {
    id: row.id,
    date,
    time,
    label: row.description ?? '',
    note: row.memo ?? undefined,
    amount: type === 'in' ? row.amount : -Math.abs(row.amount),
    type,
    cat: row.categories?.name ?? undefined,
    pay: row.accounts?.name ?? undefined,
    memo: row.memo ?? undefined,
  };
}

/**
 * 도메인 → DB Insert. category_id/account_id는 caller가 미리 resolve해서 넘김.
 * occurred_at은 date(+time) → ISO timestamp 변환.
 */
export interface TxnToRowContext {
  userId: string;
  categoryId?: string | null;
  accountId?: string | null;
}

export function toRow(
  input: Partial<Txn>,
  ctx: TxnToRowContext,
): Insert {
  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const time = input.time ?? '00:00';
  const occurred_at = new Date(`${date}T${time}:00`).toISOString();
  const kind = input.type === 'in' ? 'income' : 'expense';
  const amount = Math.abs(input.amount ?? 0);
  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    user_id: ctx.userId,
    account_id: ctx.accountId ?? null,
    category_id: ctx.categoryId ?? null,
    kind,
    amount,
    description: input.label ?? null,
    memo: input.note ?? input.memo ?? null,
    occurred_at,
  };
}

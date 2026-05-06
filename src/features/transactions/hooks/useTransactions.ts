// ============================================================
// useTransactions / useTransactionStats — RQ-based
// 낙관적 업데이트 인프라 적용 (수정 케이스 한정 — id가 있는 경우)
// ============================================================

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getDataSource } from '@/shared/data/source';
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from '@/shared/data/hooks/useRepositoryQuery';
import {
  monthlyTotals,
  currentMonthSummary,
  type MonthlyTotals,
  type MonthSummary,
} from '@/features/transactions/selectors/transactions';
import type { Txn, TxnType } from '@/types';

const QUERY_KEY = ['transactions'] as const;

export interface TransactionsFilter {
  /** "YYYY-MM" prefix */
  month?: string;
  type?: TxnType;
  cat?: string;
}

export interface TransactionsView extends Omit<RepositoryQueryView<Txn>, 'data'> {
  data: readonly Txn[];
  all: readonly Txn[];
}

export function useTransactions(filter?: TransactionsFilter): TransactionsView {
  const qc = useQueryClient();
  const repo = getDataSource().transactions;
  const view = useRepositoryQuery(repo, {
    queryKey: QUERY_KEY,
    upsertOptions: {
      // 수정(id 있음)에 대한 낙관적 패치 — 추가는 mutationFn에서 즉시 반영되므로 그대로 둠
      onMutate: async (input) => {
        if (!input.id) return undefined;
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        const existing = prev.find((t) => t.id === input.id);
        if (existing) repo.store.upsert({ ...existing, ...input } as Txn);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx && (ctx as { prev?: readonly Txn[] }).prev) {
          repo.store.setAll(Array.from((ctx as { prev: readonly Txn[] }).prev));
        }
      },
    },
    removeOptions: {
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: QUERY_KEY });
        const prev = repo.store.getSnapshot();
        repo.store.remove(id);
        return { prev };
      },
      onError: (_err, _id, ctx) => {
        if (ctx && (ctx as { prev?: readonly Txn[] }).prev) {
          repo.store.setAll(Array.from((ctx as { prev: readonly Txn[] }).prev));
        }
      },
    },
  });
  const { data: all } = view;

  const data = useMemo(() => {
    if (!filter) return all;
    return all.filter((t) => {
      if (filter.month && !t.date.startsWith(filter.month)) return false;
      if (filter.type && t.type !== filter.type) return false;
      if (filter.cat && t.cat !== filter.cat) return false;
      return true;
    });
  }, [all, filter?.month, filter?.type, filter?.cat]);

  return useMemo(() => ({ ...view, data, all }), [view, data, all]);
}

export interface TransactionStats {
  monthly: MonthlyTotals;
  summary: MonthSummary;
}

export function useTransactionStats(): TransactionStats {
  const { all } = useTransactions();
  return useMemo(
    () => ({ monthly: monthlyTotals(all), summary: currentMonthSummary(all) }),
    [all],
  );
}

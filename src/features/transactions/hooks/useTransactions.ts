// ============================================================
// useTransactions / useTransactionStats
// ============================================================

import { useMemo } from 'react';
import { getDataSource } from '@/shared/data/source';
import { useRepository, type RepositoryView } from '@/shared/data/hooks/useRepository';
import {
  monthlyTotals,
  currentMonthSummary,
  type MonthlyTotals,
  type MonthSummary,
} from '@/features/transactions/selectors/transactions';
import type { Txn, TxnType } from '@/types';

export interface TransactionsFilter {
  /** "YYYY-MM" prefix */
  month?: string;
  type?: TxnType;
  cat?: string;
}

export interface TransactionsView extends Omit<RepositoryView<Txn>, 'data'> {
  /** Filtered (or full) snapshot. */
  data: readonly Txn[];
  /** Always the unfiltered list — useful for stats/selectors. */
  all: readonly Txn[];
}

export function useTransactions(filter?: TransactionsFilter): TransactionsView {
  const repo = getDataSource().transactions;
  const view = useRepository(repo);
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

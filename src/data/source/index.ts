// ============================================================
// DataSource singleton — mode + auth 기반 분기
// ============================================================
//
// 모드 전환 또는 사용자 변경 시 configureDataSource()로 호출 → 캐시 무효화.
// 실제 인스턴스는 다음 getDataSource() 호출 시 lazy 재생성된다.
// 컴포넌트는 App 레벨에서 mode/userId가 바뀌면 React key를 갱신해 트리를 remount한다.

import type { DataSource } from "@/data/source/types";
import { createMockSource } from "@/data/source/mock";
import { createSupabaseSource, disposeSupabaseSource } from "@/data/source/supabase";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { DataMode } from "@/shared/state/dataMode";

let _instance: DataSource | null = null;
let _initPromise: Promise<void> | null = null;
let _mode: DataMode = 'mock';
let _userId: string | null = null;

export interface ConfigureOptions {
  mode: DataMode;
  userId: string | null;
}

export function configureDataSource(opts: ConfigureOptions): boolean {
  const changed = opts.mode !== _mode || opts.userId !== _userId;
  if (!changed) return false;
  _mode = opts.mode;
  _userId = opts.userId;
  _instance = null;
  _initPromise = null;
  disposeSupabaseSource();
  return true;
}

export function getDataSource(): DataSource {
  if (_instance) return _instance;

  // live 모드 + supabase 클라이언트 + 인증된 user 가 모두 있어야 실 데이터
  if (_mode === 'live' && isSupabaseConfigured && supabase && _userId) {
    // createSupabaseSource는 비동기 init이 필요해 placeholder를 만들고 init 시 채움
    // 단순화: 비동기 생성을 동기 진입점에서 처리하기 위해 즉시 mock fallback 후 교체.
    // 실제 createSupabaseSource는 카테고리 캐시 로딩이 await 되어야 하므로
    // _initPromise로 노출.
    const placeholderMock = createMockSource();
    _instance = placeholderMock;
    _initPromise = (async () => {
      const real = await createSupabaseSource(supabase, _userId!);
      _instance = real;
      await Promise.all([
        real.transactions.init(),
        real.events.init(),
        real.memos.init(),
        real.stickyNotes.init(),
        real.checklist.init(),
        real.subscriptions.init(),
        real.pinnedInfo.init(),
        real.dailyLog.init(),
      ]);
    })();
    return _instance;
  }

  // 그 외: mock
  const mock = createMockSource();
  _instance = mock;
  _initPromise = Promise.all([
    mock.transactions.init(),
    mock.events.init(),
    mock.memos.init(),
    mock.stickyNotes.init(),
    mock.checklist.init(),
    mock.subscriptions.init(),
    mock.pinnedInfo.init(),
    mock.dailyLog.init(),
  ]).then(() => undefined);
  return _instance;
}

export function getReadyPromise(): Promise<void> {
  if (!_initPromise) getDataSource();
  return _initPromise!;
}

export function getCurrentMode(): DataMode {
  return _mode;
}

export type { DataSource, Repository } from "@/data/source/types";

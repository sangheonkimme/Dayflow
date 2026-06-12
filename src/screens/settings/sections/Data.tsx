"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/screens/settings/SettingsPage.module.css";
import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";
import { DeleteAccountModal } from "@/screens/settings/DeleteAccountModal";
import {
  buildFullExportJson,
  buildTransactionsCsv,
  exportFilename,
  triggerDownload,
} from "@/screens/settings/exportData";
import { useAuth } from "@/data/auth";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useMemos } from "@/data/memos";
import { useStickyNotes } from "@/data/sticky-notes";
import { useChecklist } from "@/data/checklist";
import { useSubscriptions } from "@/data/subscriptions";
import { usePinnedInfo } from "@/data/pinned-info";

export const DataSection = () => {
  const router = useRouter();
  const { status } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const authed = status === "authed";
  const txns = useTransactions();
  const events = useEvents();
  const memos = useMemos();
  const stickyNotes = useStickyNotes();
  const checklist = useChecklist();
  const subscriptions = useSubscriptions();
  const pinnedInfo = usePinnedInfo();

  // 거래내역(가계부) → CSV 다운로드
  const exportLedgerCsv = () => {
    const csv = buildTransactionsCsv(txns.all);
    triggerDownload(exportFilename("dayflow-ledger", "csv"), csv, "text/csv");
  };

  // 전체 도메인 데이터 → JSON 다운로드
  const exportAllJson = () => {
    const json = buildFullExportJson({
      transactions: txns.all,
      events: events.data,
      memos: memos.all,
      stickyNotes: stickyNotes.data,
      checklist: checklist.data,
      subscriptions: subscriptions.all,
      pinnedInfo: pinnedInfo.data,
    });
    triggerDownload(
      exportFilename("dayflow-export", "json"),
      json,
      "application/json",
    );
  };

  return (
    <>
      <div className={styles.group}>
        <h3>백업 · 내보내기</h3>
        <SettingRow label="자동 백업" sub="매일 자정 클라우드에 저장" comingSoon>
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="가계부 내보내기" sub="CSV 형식">
          <button
            className="timer-btn"
            onClick={exportLedgerCsv}
            disabled={txns.isLoading}
          >
            다운로드
          </button>
        </SettingRow>
        <SettingRow label="전체 데이터 내보내기" sub="JSON 형식">
          <button className="timer-btn" onClick={exportAllJson}>
            다운로드
          </button>
        </SettingRow>
      </div>
      <div className={`${styles.group} ${styles.danger}`}>
        <h3>위험 구역</h3>
        <SettingRow label="모든 메모 삭제" sub="복구할 수 없습니다" comingSoon>
          <button className="timer-btn danger-btn">삭제</button>
        </SettingRow>
        <SettingRow label="계정 삭제" sub="모든 데이터가 영구 삭제됩니다">
          <button
            className="timer-btn danger-btn"
            onClick={() => setDeleteOpen(true)}
            disabled={!authed}
            title={authed ? undefined : "로그인 후 이용할 수 있어요."}
          >
            계정 삭제
          </button>
        </SettingRow>
      </div>

      {deleteOpen && (
        <DeleteAccountModal
          onClose={() => setDeleteOpen(false)}
          onDeleted={() => router.replace("/")}
        />
      )}
    </>
  );
};

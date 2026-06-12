import { useState } from "react";
import { Modal } from "@/components/Modal";
import styles from "@/screens/settings/SettingsPage.module.css";
import { useAuth } from "@/data/auth";

const CONFIRM_WORD = "삭제";

/**
 * 회원 탈퇴 확인 모달.
 * 3중 게이트: 경고 확인 + "삭제" 텍스트 입력 + 현재 비밀번호 재인증.
 * 재인증 통과 시 Edge Function 으로 계정 삭제 후 onDeleted 콜백.
 */
export const DeleteAccountModal = ({
  onClose,
  onDeleted,
}: {
  onClose: () => void;
  onDeleted: () => void;
}) => {
  const { reauthenticate, deleteAccount } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    !busy && confirmText.trim() === CONFIRM_WORD && password.length > 0;

  const submit = async () => {
    setError(null);
    setBusy(true);
    // 1) 현재 비밀번호 재인증
    const reauth = await reauthenticate(password);
    if (!reauth.ok) {
      setBusy(false);
      setError(reauth.message ?? "재인증에 실패했어요.");
      return;
    }
    // 2) 계정 삭제 (Edge Function)
    const res = await deleteAccount();
    setBusy(false);
    if (!res.ok) {
      setError(res.message ?? "탈퇴에 실패했어요.");
      return;
    }
    onDeleted();
  };

  return (
    <Modal open onClose={busy ? undefined : onClose} className="modal-sm">
      <h3 style={{ margin: "0 0 8px", fontSize: 17 }}>
        정말 계정을 삭제할까요?
      </h3>
      <p style={{ color: "var(--ink-mute)", fontSize: 13, lineHeight: 1.6 }}>
        가계부·메모·일정 등 <b>모든 데이터가 영구 삭제</b>되며 복구할 수
        없어요. 계속하려면 아래에 <b>{CONFIRM_WORD}</b> 를 입력하고 현재
        비밀번호로 본인 확인을 해주세요.
      </p>

      <div className="field">
        <label htmlFor="del-confirm-text">확인 문구</label>
        <input
          id="del-confirm-text"
          className={styles.setInput}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={`"${CONFIRM_WORD}" 입력`}
          disabled={busy}
          autoComplete="off"
        />
      </div>
      <div className="field" style={{ marginTop: 10 }}>
        <label htmlFor="del-password">현재 비밀번호</label>
        <input
          id="del-password"
          className={styles.setInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <small style={{ color: "#c0392b", display: "block", marginTop: 10 }}>
          {error}
        </small>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          type="button"
          className="timer-btn"
          onClick={onClose}
          disabled={busy}
        >
          취소
        </button>
        <button
          type="button"
          className="timer-btn danger-btn"
          onClick={submit}
          disabled={!canSubmit}
        >
          {busy ? "삭제 중…" : "영구 삭제"}
        </button>
      </div>
    </Modal>
  );
};

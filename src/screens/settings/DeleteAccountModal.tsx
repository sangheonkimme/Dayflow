import { useState } from "react";
import { Modal } from "@/components/Modal";
import styles from "@/screens/settings/SettingsPage.module.css";
import { useAuth } from "@/data/auth";
import { formatProviderLabel, useAuthMethods } from "@/lib/auth/hasPassword";

const CONFIRM_WORD = "삭제";

/**
 * 회원 탈퇴 확인 모달.
 *
 * 인증 수단에 따라 게이트가 갈린다.
 * - 이메일/비번 유저: 경고 확인 + "삭제" 입력 + 현재 비밀번호 재인증 (3중).
 * - OAuth 전용 유저: 비밀번호가 없어 재인증이 불가능하므로 스킵하고
 *   경고 확인 + "삭제" 입력 (2중). 로그인 세션 자체가 본인 확인 역할.
 *
 * 통과 시 Edge Function 으로 계정 삭제 후 onDeleted 콜백.
 */
export const DeleteAccountModal = ({
  onClose,
  onDeleted,
}: {
  onClose: () => void;
  onDeleted: () => void;
}) => {
  const { reauthenticate, deleteAccount } = useAuth();
  const { hasPassword, providers, loading } = useAuthMethods();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oauthOnly = !loading && !hasPassword;
  const providerLabel = providers.map(formatProviderLabel).join(" · ");

  const canSubmit =
    !busy &&
    !loading &&
    confirmText.trim() === CONFIRM_WORD &&
    (oauthOnly || password.length > 0);

  const submit = async () => {
    setError(null);
    setBusy(true);
    // 1) 비번 유저만 재인증. OAuth 전용은 비번이 없어 스킵.
    if (!oauthOnly) {
      const reauth = await reauthenticate(password);
      if (!reauth.ok) {
        setBusy(false);
        setError(reauth.message ?? "재인증에 실패했어요.");
        return;
      }
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
        없어요. 계속하려면 아래에 <b>{CONFIRM_WORD}</b> 를 입력
        {oauthOnly ? "해주세요." : "하고 현재 비밀번호로 본인 확인을 해주세요."}
      </p>

      {oauthOnly && (
        <p
          style={{
            color: "var(--ink-mute)",
            fontSize: 12,
            lineHeight: 1.6,
            margin: "0 0 4px",
          }}
        >
          {providerLabel || "소셜"} 계정으로 로그인 중이라 비밀번호가 없어요.
          로그인된 상태 자체가 본인 확인이라 확인 문구만 입력하면 바로
          삭제돼요.
        </p>
      )}

      <div className="field">
        <label htmlFor="del-confirm-text">확인 문구</label>
        <input
          id="del-confirm-text"
          className={styles.setInput}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={`"${CONFIRM_WORD}" 입력`}
          disabled={busy || loading}
          autoComplete="off"
        />
      </div>
      {!oauthOnly && (
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="del-password">현재 비밀번호</label>
          <input
            id="del-password"
            className={styles.setInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy || loading}
            autoComplete="current-password"
          />
        </div>
      )}

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
          {busy ? "삭제 중…" : loading ? "확인 중…" : "영구 삭제"}
        </button>
      </div>
    </Modal>
  );
};

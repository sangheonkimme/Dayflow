"use client";

import { useState } from "react";
import styles from "@/screens/settings/SettingsPage.module.css";
import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";
import { useAuth } from "@/data/auth";
import {
  formatProviderLabel,
  providerAccountUrl,
  useAuthMethods,
} from "@/lib/auth/hasPassword";

/**
 * 보안 설정 — 앱 잠금(예정) + 비밀번호 변경.
 *
 * 비밀번호 변경은 이메일/비번 유저만 가능하다. OAuth 전용 유저에게는
 * 애초에 바꿀 비밀번호가 없어서 폼을 채워도 재인증 단계에서 실패한다.
 * DeleteAccountModal 과 같은 useAuthMethods() 로 인증 수단을 판별해
 * 폼을 잠그고 provider 계정 설정으로 안내한다.
 */
export const SecuritySection = () => {
  const { status, updatePassword, reauthenticate } = useAuth();
  const { hasPassword, providers, loading: methodsLoading } = useAuthMethods();
  const [current, setCurrent] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const authed = status === "authed";
  // 조회 전에는 기존 동작(비번 유저)을 가정 — 폼이 깜빡였다 잠기지 않도록.
  const oauthOnly = !methodsLoading && !hasPassword;
  const providerLabel = providers.map(formatProviderLabel).join(" · ");
  // 링크는 URL 을 아는 provider 중 첫 번째 하나만 — 안내가 목적이라 충분하고,
  // 링크 라벨은 providerLabel(전체 나열) 이 아니라 그 provider 로 맞춘다.
  const linkProvider = providers.find((p) => providerAccountUrl(p));
  const accountUrl = linkProvider ? providerAccountUrl(linkProvider) : null;
  const linkLabel = linkProvider ? formatProviderLabel(linkProvider) : "";
  const formDisabled = !authed || busy || oauthOnly;

  const submit = async () => {
    setMsg(null);
    if (pw !== confirm) {
      setMsg({ ok: false, text: "두 비밀번호가 일치하지 않아요." });
      return;
    }
    setBusy(true);
    // 현재 비밀번호로 본인 재인증 후 변경 진행.
    const reauth = await reauthenticate(current);
    if (!reauth.ok) {
      setBusy(false);
      setMsg({ ok: false, text: reauth.message ?? "현재 비밀번호를 확인해주세요." });
      return;
    }
    const res = await updatePassword(pw);
    setBusy(false);
    if (res.ok) {
      setCurrent("");
      setPw("");
      setConfirm("");
      setMsg({ ok: true, text: "비밀번호가 변경되었어요." });
    } else {
      setMsg({ ok: false, text: res.message ?? "변경에 실패했어요." });
    }
  };

  return (
    <>
      <div className={styles.group}>
        <h3>앱 잠금</h3>
        <SettingRow label="앱 진입 시 잠금" sub="시작할 때 인증 요구" comingSoon>
          <ToggleSwitch on={false} />
        </SettingRow>
        <SettingRow label="가계부 잠금" sub="가계부 페이지만 별도 잠금" comingSoon>
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="자동 잠금 시간" comingSoon>
          <select className={styles.setInput} defaultValue="5">
            <option value="0">즉시</option>
            <option value="1">1분 후</option>
            <option value="5">5분 후</option>
            <option value="30">30분 후</option>
          </select>
        </SettingRow>
      </div>
      <div className={styles.group}>
        <h3>인증</h3>
        {oauthOnly && (
          <p className={styles.oauthNote}>
            {providerLabel || "소셜"} 계정으로 로그인 중이라 이 앱에는 비밀번호가
            없어요. 비밀번호는 {providerLabel || "소셜"} 계정 설정에서 관리해주세요.
            {accountUrl && (
              <>
                {" "}
                <a
                  href={accountUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${linkLabel} 계정 설정에서 비밀번호 관리 (새 창에서 열림)`}
                >
                  {linkLabel} 계정 설정 열기 ↗
                </a>
              </>
            )}
          </p>
        )}
        <div className="field">
          <label htmlFor="sec-current-pw">현재 비밀번호</label>
          <input
            id="sec-current-pw"
            className={styles.setInput}
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="변경 전 본인 확인"
            autoComplete="current-password"
            disabled={formDisabled}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="sec-new-pw">새 비밀번호</label>
          <input
            id="sec-new-pw"
            className={styles.setInput}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="6자 이상"
            autoComplete="new-password"
            disabled={formDisabled}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="sec-confirm-pw">새 비밀번호 확인</label>
          <input
            id="sec-confirm-pw"
            className={styles.setInput}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={formDisabled}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <button
            className="timer-btn primary"
            onClick={submit}
            disabled={
              formDisabled || methodsLoading || !current || !pw || !confirm
            }
          >
            {busy ? "변경 중…" : "비밀번호 변경"}
          </button>
          {!authed && (
            <small style={{ color: "var(--ink-soft)" }}>
              로그인 후 변경할 수 있어요.
            </small>
          )}
          {msg && (
            <small
              role="status"
              aria-live="polite"
              style={{ color: msg.ok ? "#4a8d5a" : "#c0392b" }}
            >
              {msg.text}
            </small>
          )}
        </div>
        <SettingRow label="생체 인증" sub="Face ID / 지문" comingSoon>
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="2단계 인증" sub="이메일 OTP" comingSoon>
          <ToggleSwitch on={false} />
        </SettingRow>
      </div>
    </>
  );
};

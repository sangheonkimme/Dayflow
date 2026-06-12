"use client";

import { useState } from "react";
import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";
import { useAuth } from "@/data/auth";

export const SecuritySection = () => {
  const { status, updatePassword, reauthenticate } = useAuth();
  const [current, setCurrent] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const authed = status === "authed";

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
      <div className="settings-group">
        <h3>앱 잠금</h3>
        <SettingRow label="앱 진입 시 잠금" sub="시작할 때 인증 요구" comingSoon>
          <ToggleSwitch on={false} />
        </SettingRow>
        <SettingRow label="가계부 잠금" sub="가계부 페이지만 별도 잠금" comingSoon>
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="자동 잠금 시간" comingSoon>
          <select className="set-input" defaultValue="5">
            <option value="0">즉시</option>
            <option value="1">1분 후</option>
            <option value="5">5분 후</option>
            <option value="30">30분 후</option>
          </select>
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>인증</h3>
        <div className="field">
          <label htmlFor="sec-current-pw">현재 비밀번호</label>
          <input
            id="sec-current-pw"
            className="set-input"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="변경 전 본인 확인"
            autoComplete="current-password"
            disabled={!authed || busy}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="sec-new-pw">새 비밀번호</label>
          <input
            id="sec-new-pw"
            className="set-input"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="6자 이상"
            autoComplete="new-password"
            disabled={!authed || busy}
          />
        </div>
        <div className="field" style={{ marginTop: 10 }}>
          <label htmlFor="sec-confirm-pw">새 비밀번호 확인</label>
          <input
            id="sec-confirm-pw"
            className="set-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            disabled={!authed || busy}
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
            disabled={!authed || busy || !current || !pw || !confirm}
          >
            {busy ? "변경 중…" : "비밀번호 변경"}
          </button>
          {!authed && (
            <small style={{ color: "var(--ink-soft)" }}>
              로그인 후 변경할 수 있어요.
            </small>
          )}
          {msg && (
            <small style={{ color: msg.ok ? "#4a8d5a" : "#c0392b" }}>
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

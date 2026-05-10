import { useEffect, useState } from "react";
import { SettingRow } from "@/screens/settings/SettingRow";
import { useAuth } from "@/data/auth";

export const ProfileSection = () => {
  const { user, updateDisplayName } = useAuth();
  const fallback = user?.email?.split("@")[0] ?? "방문자";
  const current = user?.displayName ?? fallback;

  const [draft, setDraft] = useState(current);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // user 가 늦게 로드되면 draft 도 맞춰준다 (단 사용자가 편집 중이면 덮어쓰지 않음)
  useEffect(() => {
    setDraft((d) => (d === "" || d === fallback ? current : d));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const dirty = draft.trim() !== current && draft.trim().length > 0;

  const onSave = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    setMsg(null);
    const r = await updateDisplayName(draft.trim());
    setSaving(false);
    setMsg({
      ok: r.ok,
      text: r.ok ? "저장됐어요." : r.message ?? "저장에 실패했어요.",
    });
  };

  const avatarChar = (current[0] ?? "N").toUpperCase();

  return (
    <>
      <div className="settings-group">
        <h3>프로필</h3>
        <div className="profile-hero">
          <div
            className="avatar"
            style={{
              width: 64,
              height: 64,
              fontSize: 26,
              background: "var(--pink)",
            }}
          >
            {avatarChar}
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 18 }}>{current}</b>
            <div className="muted" style={{ fontSize: 13 }}>
              {user?.email ?? "비로그인"} · 무료 플랜
            </div>
          </div>
          <button className="timer-btn" disabled>
            사진 변경
          </button>
        </div>
        <SettingRow label="이름" sub="대시보드 인사말과 사이드바에 표시돼요">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="set-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
              }}
              placeholder={fallback}
              style={{ flex: 1 }}
            />
            <button
              className="timer-btn primary"
              onClick={onSave}
              disabled={!dirty || saving}
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
          {msg && (
            <div
              style={{
                fontSize: 12,
                marginTop: 6,
                color: msg.ok ? "var(--green)" : "var(--red)",
              }}
            >
              {msg.text}
            </div>
          )}
        </SettingRow>
        <SettingRow label="이메일">
          <input
            className="set-input"
            value={user?.email ?? ""}
            readOnly
            disabled
          />
        </SettingRow>
      </div>
    </>
  );
};

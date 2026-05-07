// @ts-nocheck
import { useState } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SubHeader } from "@/pages/mobile/shared/SubHeader";
import { useAuth } from "@/data/auth";

export const ProfileScreen = ({ onBack, onUpgrade }) => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.email?.split("@")[0] ?? "나비");
  const [email] = useState(user?.email ?? "");
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const stats = [
    { label: "이번 달 입력", val: "84", unit: "건" },
    { label: "기록 시작",   val: "183", unit: "일째" },
    { label: "연속 사용",   val: "27", unit: "일" },
  ];
  const Row = ({ ico, title, sub, right, last, onClick, danger }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: last ? "none" : "1px dashed var(--line)", cursor: onClick ? "pointer" : "default" }}>
      {ico && <div className="dfm-tool-ico" style={{ width: 32, height: 32 }}><Ico name={ico} size={14} /></div>}
      <div style={{ flex: 1 }}>
        <b style={{ fontSize: 13, display: "block", color: danger ? "#c44a3a" : "var(--ink)" }}>{title}</b>
        {sub && <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{sub}</small>}
      </div>
      {right !== undefined ? right : (onClick && <Ico name="chevR" size={14} />)}
    </div>
  );
  return (
    <div>
      <SubHeader title="프로필" onBack={onBack} action={<button className="dfm-icon-btn" aria-label="편집" onClick={() => setEditOpen(true)}><Ico name="edit" size={18} /></button>} />

      {/* hero card — avatar + name + plan */}
      <div className="dfm-card" style={{ background: "var(--yellow)", borderColor: "var(--yellow-edge)", marginBottom: 14, textAlign: "center", padding: "22px 18px" }}>
        <div style={{ width: 76, height: 76, margin: "0 auto", borderRadius: 24, background: "var(--bg-paper)", border: "2px solid var(--ink)", display: "grid", placeItems: "center", fontFamily: "var(--hand)", fontWeight: 700, fontSize: 36 }}>나</div>
        <b style={{ display: "block", fontSize: 20, marginTop: 12, letterSpacing: "-0.01em" }}>{name}</b>
        <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>{email}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, padding: "4px 10px", background: "var(--bg-paper)", borderRadius: 999, border: "1px solid var(--yellow-edge)", fontSize: 11, fontWeight: 600 }}>
          <Ico name="tag" size={11} /> 무료 플랜
        </div>
      </div>

      {/* stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="dfm-card" style={{ padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {s.val}<span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-mute)", marginLeft: 2 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* upgrade banner */}
      <button onClick={onUpgrade} className="dfm-card" style={{ marginBottom: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #fff5d6 0%, #ffe8b8 100%)", borderColor: "var(--yellow-edge)", width: "100%", textAlign: "left", cursor: "pointer", color: "var(--ink)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--ink)", color: "#ffd84d", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Ico name="coin" size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 13, display: "block" }}>Pro로 업그레이드</b>
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>광고 제거 · 무제한 기록 · ₩3,900 / 월</small>
        </div>
        <Ico name="chevR" size={14} />
      </button>

      {/* account */}
      <SectionHeader title="계정" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row ico="bell" title="이메일" sub={email} onClick={() => setEditOpen(true)} />
        <Row ico="tag"  title="비밀번호 변경" onClick={() => setPwOpen(true)} />
        <Row ico="cloud" title="연결된 계정" sub="Apple · Google" onClick={() => {}} last />
      </div>

      {/* data */}
      <SectionHeader title="데이터" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row ico="cloud" title="iCloud 동기화" right={<DfmSwitch on={true} />} />
        <Row ico="doc"   title="데이터 내보내기" sub="CSV · JSON" onClick={() => {}} />
        <Row ico="refresh" title="백업 및 복원" sub="마지막 백업 · 어제 23:00" onClick={() => {}} last />
      </div>

      {/* about */}
      <SectionHeader title="앱 정보" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row title="버전" right={<span style={{ fontSize: 12, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>2.4.1</span>} />
        <Row title="이용약관" onClick={() => {}} />
        <Row title="개인정보 처리방침" onClick={() => {}} />
        <Row title="문의하기" sub="help@dayflow.app" onClick={() => {}} last />
      </div>

      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <Row title="로그아웃" onClick={() => signOut()} danger last />
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "var(--ink-mute)", padding: "8px 0 24px", letterSpacing: "0.06em" }}>
        Dayflow · Made with ☕ in Seoul
      </div>

      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} initialName={name} email={email} onSave={(v) => { setName(v); setEditOpen(false); }} />
      <ChangePasswordSheet open={pwOpen} onClose={() => setPwOpen(false)} email={email} />
    </div>
  );
}

// reusable switch (matches NotifToggleRow style)

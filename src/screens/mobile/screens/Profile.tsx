import { useEffect, useMemo, useState } from "react";
import styles from "@/screens/mobile/mobile.module.css";
import { EditProfileSheet } from "@/screens/mobile/sheets/EditProfileSheet";
import { ChangePasswordSheet } from "@/screens/mobile/sheets/ChangePasswordSheet";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SubHeader } from "@/screens/mobile/shared/SubHeader";
import { useAuth } from "@/data/auth";
import { useUserPlan } from "@/data/plan/useUserPlan";
import { useTransactions } from "@/data/transactions";
import {
  buildTransactionsCsv,
  triggerDownload,
  exportFilename,
} from "@/screens/settings/exportData";
import { pressable } from "@/lib/a11y";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const DAY_MS = 86_400_000;

export const ProfileScreen = ({
  onBack,
  onUpgrade,
}: {
  onBack: () => void;
  onUpgrade: () => void;
}) => {
  const { user, signOut } = useAuth();
  const { isPro } = useUserPlan();
  const { all: txns } = useTransactions();
  const fallbackName = user?.displayName ?? user?.email?.split("@")[0] ?? "나비";
  const [name, setName] = useState(fallbackName);
  const [email] = useState(user?.email ?? "");
  // user 가 늦게 로드되거나 displayName 갱신될 때 동기화 — 사용자가 편집 중이 아닐 때만.
  useEffect(() => {
    setName((n) => (n === "" || n === "나비" ? fallbackName : n));
  }, [fallbackName]);
  const avatarChar = (fallbackName[0] ?? "나").toUpperCase();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  // 실 거래 데이터 기반 통계 (하드코딩 84/183/27 대체)
  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    let monthCount = 0;
    let first = "";
    for (const t of txns) {
      if (t.date.startsWith(monthKey)) monthCount++;
      if (!first || t.date < first) first = t.date;
    }
    const daysSince = first
      ? Math.floor((now.getTime() - new Date(`${first}T00:00:00`).getTime()) / DAY_MS) + 1
      : 0;
    return [
      { label: "이번 달 입력", val: String(monthCount), unit: "건" },
      { label: "전체 기록", val: String(txns.length), unit: "건" },
      { label: "기록 시작", val: String(daysSince), unit: "일째" },
    ];
  }, [txns]);

  const exportCsv = () =>
    triggerDownload(
      exportFilename("dayflow-transactions", "csv"),
      buildTransactionsCsv(txns),
      "text/csv",
    );
  const Row = ({ ico, title, sub, right, last, onClick, danger }: any) => (
    <div
      {...(onClick ? pressable(onClick) : {})}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 14px",
        borderBottom: last ? "none" : "1px dashed var(--line)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {ico && (
        <div className={styles.dfmToolIco} style={{ width: 32, height: 32 }}>
          <Ico name={ico} size={14} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <b
          style={{
            fontSize: 13,
            display: "block",
            color: danger ? "#c44a3a" : "var(--ink)",
          }}
        >
          {title}
        </b>
        {sub && (
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            {sub}
          </small>
        )}
      </div>
      {right !== undefined ? right : onClick && <Ico name="chevR" size={14} />}
    </div>
  );
  return (
    <div>
      <SubHeader
        title="프로필"
        onBack={onBack}
        action={
          <button
            className={styles.dfmIconBtn}
            aria-label="편집"
            onClick={() => setEditOpen(true)}
          >
            <Ico name="edit" size={18} />
          </button>
        }
      />

      {/* hero card — avatar + name + plan */}
      <div
        className={styles.dfmCard}
        style={{
          background: "var(--yellow)",
          borderColor: "var(--yellow-edge)",
          marginBottom: 14,
          textAlign: "center",
          padding: "22px 18px",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            margin: "0 auto",
            borderRadius: 24,
            background: "var(--bg-paper)",
            border: "2px solid var(--ink)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--hand)",
            fontWeight: 700,
            fontSize: 36,
            overflow: "hidden",
          }}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            avatarChar
          )}
        </div>
        <b
          style={{
            display: "block",
            fontSize: 20,
            marginTop: 12,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </b>
        <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
          {email}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginTop: 10,
            padding: "4px 10px",
            background: "var(--bg-paper)",
            borderRadius: 999,
            border: "1px solid var(--yellow-edge)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <Ico name={isPro ? "coin" : "tag"} size={11} />{" "}
          {isPro ? "Pro 플랜" : "무료 플랜"}
        </div>
      </div>

      {/* stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className={styles.dfmCard}
            style={{ padding: "12px 10px", textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {s.val}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--ink-mute)",
                  marginLeft: 2,
                }}
              >
                {s.unit}
              </span>
            </div>
            <div
              style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* upgrade banner — Pro 사용자에겐 숨김 */}
      {!isPro && (
      <button
        onClick={onUpgrade}
        className={styles.dfmCard}
        style={{
          marginBottom: 14,
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "linear-gradient(135deg, #fff5d6 0%, #ffe8b8 100%)",
          borderColor: "var(--yellow-edge)",
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          color: "var(--ink)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--ink)",
            color: "#ffd84d",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Ico name="coin" size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 13, display: "block" }}>Pro로 업그레이드</b>
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            광고 제거 · 무제한 기록 · ₩3,900 / 월
          </small>
        </div>
        <Ico name="chevR" size={14} />
      </button>
      )}

      {/* account */}
      <SectionHeader title="계정" />
      <div className={styles.dfmCard} style={{ padding: 0, marginBottom: 14 }}>
        <Row
          ico="bell"
          title="이메일"
          sub={email || "로그인 필요"}
          onClick={() => setEditOpen(true)}
        />
        <Row
          ico="tag"
          title="비밀번호 변경"
          onClick={() => setPwOpen(true)}
          last
        />
      </div>

      {/* data */}
      <SectionHeader title="데이터" />
      <div className={styles.dfmCard} style={{ padding: 0, marginBottom: 14 }}>
        <Row
          ico="cloud"
          title="클라우드 동기화"
          sub={user ? "Supabase 계정에 저장돼요" : "로그인하면 자동 저장돼요"}
          right={
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: user ? "var(--ink)" : "var(--ink-mute)",
              }}
            >
              {user ? "동기화됨" : "꺼짐"}
            </span>
          }
        />
        <Row
          ico="doc"
          title="데이터 내보내기"
          sub="거래내역 CSV"
          onClick={exportCsv}
          last
        />
      </div>

      {/* about */}
      <SectionHeader title="앱 정보" />
      <div className={styles.dfmCard} style={{ padding: 0, marginBottom: 14 }}>
        <Row
          title="버전"
          right={
            <span
              style={{
                fontSize: 12,
                color: "var(--ink-mute)",
                fontFamily: "var(--mono)",
              }}
            >
              v{APP_VERSION}
            </span>
          }
        />
        <Row
          title="문의하기"
          sub="help@dayflow.app"
          onClick={() => {
            window.location.href = "mailto:help@dayflow.app";
          }}
          last
        />
      </div>

      <div className={styles.dfmCard} style={{ padding: 0, marginBottom: 14 }}>
        <Row title="로그아웃" onClick={() => signOut()} danger last />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "var(--ink-mute)",
          padding: "8px 0 24px",
          letterSpacing: "0.06em",
        }}
      >
        Dayflow · Made with ☕ in Seoul
      </div>

      <EditProfileSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={name}
        email={email}
        onSave={(v: string) => {
          setName(v);
          setEditOpen(false);
        }}
      />
      <ChangePasswordSheet
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        email={email}
      />
    </div>
  );
};

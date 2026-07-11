import { useMemo, useState } from "react";
import styles from "@/screens/mobile/mobile.module.css";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SubHeader } from "@/screens/mobile/shared/SubHeader";
import { formatWon } from "@/lib/format";
import { SUBS_CATEGORIES } from "@/lib/categories";
import {
  useSubscriptions,
  monthlyTotal,
  subscriptionColor,
  subscriptionInitial,
} from "@/data/subscriptions";
import type { Subscription } from "@/types";

type SubsScreenProps = { onBack: () => void; onAdd: () => void };

// 카테고리 아바타 (initial + 카테고리 컬러) — 데스크톱 SubsPage와 동일 언어
function SubAvatar({ sub, size }: { sub: Subscription; size: number }) {
  return (
    <div
      className={styles.dfmToolIco}
      style={{
        width: size,
        height: size,
        background: subscriptionColor(sub),
        borderColor: "rgba(0,0,0,0.06)",
        color: "#fff",
        fontWeight: 700,
        fontSize: size < 34 ? 12 : 13,
      }}
    >
      {subscriptionInitial(sub)}
    </div>
  );
}

export const SubscriptionsScreen = ({ onBack, onAdd }: SubsScreenProps) => {
  const { all, status } = useSubscriptions();
  const [filter, setFilter] = useState("all");

  // ── 파생값: all 기준으로만 재계산(filter 변경 시 재사용) ──
  const active = useMemo(() => all.filter((s) => s.status === "active"), [all]);
  const total = useMemo(() => monthlyTotal(all), [all]);

  // 카테고리별 월 지출 상위 3개 — 하드코딩 엔터/업무/유틸 대체
  const topCats = useMemo(() => {
    const byCat = new Map<string, number>();
    for (const s of active) {
      if (s.cycle !== "월") continue;
      byCat.set(s.cat, (byCat.get(s.cat) ?? 0) + s.price);
    }
    return [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [active]);

  // 데이터에 실제 존재하는 카테고리만 칩으로 노출(정규 순서 유지)
  const chips = useMemo(
    () =>
      SUBS_CATEGORIES.filter(
        (c) => c.id === "all" || all.some((s) => s.cat === c.id),
      ),
    [all],
  );

  // 다가오는 7일 결제 — 실제 오늘 기준(월 순환 고려)
  const upcoming = useMemo(() => {
    const now = new Date();
    const todayDate = now.getDate();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    return active
      .filter((s) => s.cycle === "월" && typeof s.day === "number")
      .map((s) => {
        const day = s.day as number;
        const daysAway =
          day >= todayDate ? day - todayDate : daysInMonth - todayDate + day;
        return { s, daysAway };
      })
      .filter((x) => x.daysAway <= 7)
      .sort((a, b) => a.daysAway - b.daysAway)
      .slice(0, 3);
  }, [active]);

  const visible = useMemo(() => {
    const list = filter === "all" ? all : all.filter((s) => s.cat === filter);
    return [...list].sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
  }, [all, filter]);

  const addBtn = (
    <button className={styles.dfmIconBtn} aria-label="추가" onClick={onAdd}>
      <Ico name="plus" size={18} />
    </button>
  );

  // 빈 상태 — 로딩이 끝났는데도 구독 0건
  if (status !== "loading" && all.length === 0) {
    return (
      <div>
        <SubHeader title="구독 관리" onBack={onBack} action={addBtn} />
        <div
          className={styles.dfmCard}
          style={{ textAlign: "center", padding: "40px 20px" }}
        >
          <div
            className={styles.dfmToolIco}
            style={{ width: 48, height: 48, margin: "0 auto 12px" }}
          >
            <Ico name="tag" size={20} />
          </div>
          <b style={{ fontSize: 15, display: "block" }}>아직 구독이 없어요</b>
          <small
            style={{
              fontSize: 12,
              color: "var(--ink-mute)",
              display: "block",
              marginTop: 4,
            }}
          >
            매달 빠져나가는 구독을 추가해 관리해보세요
          </small>
          <button
            onClick={onAdd}
            style={{
              marginTop: 16,
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              background: "var(--ink)",
              color: "var(--bg-paper)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + 구독 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SubHeader title="구독 관리" onBack={onBack} action={addBtn} />

      {/* hero summary */}
      <div
        className={styles.dfmCard}
        style={{
          background: "var(--yellow)",
          borderColor: "var(--yellow-edge)",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <small
          style={{
            fontSize: 11,
            color: "var(--ink-mute)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          이번 달 구독료
        </small>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginTop: 4,
          }}
        >
          <b
            style={{
              fontSize: 30,
              fontFamily: "var(--mono)",
              letterSpacing: "-0.02em",
            }}
          >
            {formatWon(total)}
          </b>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
            / 활성 {active.length}개
          </span>
        </div>
        {topCats.length > 0 && (
          <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11 }}>
            {topCats.map(([cat, sum]) => (
              <span key={cat}>
                <b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
                  {formatWon(sum)}
                </b>
                <div style={{ color: "var(--ink-mute)" }}>{cat}</div>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* upcoming */}
      {upcoming.length > 0 && (
        <>
          <SectionHeader title="다가오는 결제" />
          <div
            className={styles.dfmCard}
            style={{ padding: 0, marginBottom: 14 }}
          >
            {upcoming.map(({ s, daysAway }, i) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom:
                    i < upcoming.length - 1 ? "1px dashed var(--line)" : "none",
                }}
              >
                <SubAvatar sub={s} size={32} />
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
                  <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                    {daysAway === 0 ? "오늘" : `${daysAway}일 후`} · 매월 {s.day}
                    일
                  </small>
                </div>
                <b style={{ fontSize: 13, fontFamily: "var(--mono)" }}>
                  {formatWon(s.price)}
                </b>
              </div>
            ))}
          </div>
        </>
      )}

      {/* filter chips */}
      <SectionHeader title="전체 구독" />
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 10,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {chips.map((c) => {
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              aria-pressed={on}
              style={{
                padding: "7px 13px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
                background: on ? "var(--ink)" : "transparent",
                color: on ? "var(--bg-paper)" : "var(--ink)",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* list */}
      <div className={styles.dfmCard} style={{ padding: 0 }}>
        {visible.map((s, i) => {
          const paused = s.status === "paused";
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 14px",
                borderBottom:
                  i < visible.length - 1 ? "1px dashed var(--line)" : "none",
                opacity: paused ? 0.5 : 1,
              }}
            >
              <SubAvatar sub={s} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
                <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                  {s.cat} · 매{s.cycle} {s.day}일
                </small>
              </div>
              <div style={{ textAlign: "right" }}>
                <b
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--mono)",
                    display: "block",
                  }}
                >
                  {formatWon(s.price)}
                </b>
                <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                  {paused ? "일시정지" : s.cycle}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 16 }}></div>
    </div>
  );
};

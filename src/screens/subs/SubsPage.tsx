import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { formatWon } from "@/lib/format";
import { DOW } from "@/lib/date";
import { sumBy } from "@/lib/aggregate";
import { useSubscriptions } from "@/data/subscriptions";
import type { Subscription } from "@/types";
import {
  subscriptionColor,
  subscriptionInitial,
  formatStarted,
} from "@/data/subscriptions";
import styles from "./SubsPage.module.css";

// ============================================================
// SUBSCRIPTIONS PAGE — 정기구독 (simplified)
// ============================================================

const CAT_COLORS = {
  "업무 도구": "#a259ff",
  엔터테인먼트: "#e25c4d",
  음악: "#4a8d5a",
  클라우드: "#3a8dde",
  쇼핑: "#e8c84a",
  독서: "#2c5e8b",
  건강: "#a8d09b",
  기타: "#c9bd9f",
};

const SUB_CATS = Object.keys(CAT_COLORS);
const SUB_PALETTE = [
  "#e25c4d",
  "#4a8d5a",
  "#3a8dde",
  "#a259ff",
  "#e8c84a",
  "#e89aac",
  "#1a1a1a",
  "#a8d09b",
  "#c9bd9f",
  "#ee5a3d",
];

type SortKey = "day" | "price" | "name";
type TipState = { kind: "cancel" | "overlap"; subId?: string | number } | null;
function SubsPage({ onAdd }: { onAdd?: () => void }) {
  const [sortBy, setSortBy] = useState<SortKey>("day");
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [tipOpen, setTipOpen] = useState<TipState>(null);

  const { all: SUBS, usage: USAGE_LIST } = useSubscriptions();
  const SUB_USAGE = useMemo(() => {
    const m = {};
    for (const u of USAGE_LIST) m[u.subscriptionId] = u;
    return m;
  }, [USAGE_LIST]);

  const today = new Date();
  const todayDate = today.getDate();

  const monthlyActive = SUBS.filter(
    (s) => s.status === "active" && s.cycle === "월",
  );
  const yearlyActive = SUBS.filter(
    (s) => s.status === "active" && s.cycle === "년",
  );
  const pausedSubs = SUBS.filter((s) => s.status === "paused");
  const monthlyTotal = sumBy(monthlyActive, "price");
  const annualized = monthlyTotal * 12 + sumBy(yearlyActive, "price");
  const upcoming = monthlyActive
    .filter((s) => (s.day ?? 0) >= todayDate)
    .sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
  const nextOne = upcoming[0];
  const dDay = nextOne?.day != null ? nextOne.day - todayDate : null;

  const fmt = formatWon;

  // sorted list
  const list = useMemo(() => {
    const active = SUBS.filter((s) => s.status === "active");
    const paused = SUBS.filter((s) => s.status === "paused");
    const sorter: (a: Subscription, b: Subscription) => number = {
      day: (a: Subscription, b: Subscription) => (a.day ?? 0) - (b.day ?? 0),
      price: (a: Subscription, b: Subscription) => b.price - a.price,
      name: (a: Subscription, b: Subscription) =>
        a.name.localeCompare(b.name, "ko"),
    }[sortBy];
    return [...active.sort(sorter), ...paused];
  }, [sortBy]);

  // upcoming 7 days strip
  const next7Days = useMemo(() => {
    const arr: { date: Date; day: number; items: Subscription[]; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(today);
      dt.setDate(todayDate + i);
      const day = dt.getDate();
      const items = SUBS.filter(
        (s) => s.status === "active" && s.cycle === "월" && s.day === day,
      );
      arr.push({ date: dt, day, items, isToday: i === 0 });
    }
    return arr;
  }, [todayDate]);

  return (
    <div data-screen-label="06 정기구독">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 정기구독</div>
          <h1 className="page-title">
            정기구독 <span className="hand-sub">— 매달 빠져나가는 돈</span>
          </h1>
          <div className="page-sub">
            활성 <b>{monthlyActive.length + yearlyActive.length}건</b>
            {nextOne && (
              <>
                {" "}
                · 다음 결제 <b>{nextOne.name}</b> ·{" "}
                {dDay === 0 ? (
                  <b className="text-red">오늘</b>
                ) : (
                  <b>D-{dDay}</b>
                )}
              </>
            )}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn primary" onClick={onAdd}>
            + 구독 추가
          </button>
        </div>
      </div>

      {/* HERO: monthly total + upcoming 7 days strip */}
      <div className={styles.subsHero}>
        <div className={styles.subsHeroL}>
          <div className={styles.subsHeroLbl}>이번 달 총 결제</div>
          <div className={styles.subsHeroVal}>{fmt(monthlyTotal)}</div>
          <div className={styles.subsHeroSub}>
            연 환산 <b>{fmt(annualized)}</b>
            {pausedSubs.length > 0 && (
              <>
                {" "}
                · 일시정지 <b>{pausedSubs.length}건</b>
              </>
            )}
          </div>
          <span className={styles.subsHeroStamp}>MONTHLY</span>
        </div>
        <div className={styles.subsHeroR}>
          <div className={styles.subsHeroLbl} style={{ marginBottom: 10 }}>
            다가오는 7일
          </div>
          <div className={styles.next7}>
            {next7Days.map((d, i) => (
              <div
                key={i}
                className={
                  styles.next7Cell +
                  (d.isToday ? ` ${styles.today}` : "") +
                  (d.items.length ? ` ${styles.has}` : "")
                }
              >
                <div className={styles.next7Dow}>{DOW[d.date.getDay()]}</div>
                <div className={styles.next7Num}>{d.day}</div>
                <div className={styles.next7Pills}>
                  {d.items.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className={styles.next7Pill}
                      style={{ background: subscriptionColor(s) }}
                      title={`${s.name} ${fmt(s.price)}`}
                    >
                      {subscriptionInitial(s)}
                    </span>
                  ))}
                  {d.items.length > 3 && (
                    <span className={styles.next7More}>+{d.items.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION LIST */}
      <div className="card card-pad" style={{ marginTop: 18 }}>
        <div className="card-head">
          <div>
            <div className="card-title">
              <Icon name="repeat" size={16} />
              구독 목록
            </div>
            <div className="card-sub">
              총 {SUBS.length}건 · 활성{" "}
              {monthlyActive.length + yearlyActive.length} · 일시정지{" "}
              {pausedSubs.length}
            </div>
          </div>
          <div className="filter-tabs">
            {([
              ["day", "결제일순"],
              ["price", "금액순"],
              ["name", "이름순"],
            ] as const).map(([k, l]) => (
              <span
                key={k}
                className={"filter-tab" + (sortBy === k ? " on" : "")}
                onClick={() => setSortBy(k)}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.subsList}>
          {list.map((s) => {
            const sDay = s.day ?? 0;
            const dleft =
              s.cycle === "월"
                ? sDay >= todayDate
                  ? sDay - todayDate
                  : 30 - todayDate + sDay
                : null;
            const isSoon =
              dleft !== null && dleft <= 3 && s.status === "active";
            return (
              <div
                key={s.id}
                className={
                  styles.subCard + (s.status === "paused" ? ` ${styles.paused}` : "")
                }
                onClick={() => setEditing(s)}
              >
                <div
                  className={styles.subMark}
                  style={{ background: subscriptionColor(s) }}
                >
                  {subscriptionInitial(s)}
                </div>
                <div>
                  <div className={styles.subNameRow}>
                    <h4>{s.name}</h4>
                    {s.status === "paused" && (
                      <span
                        className="tag"
                        style={{
                          background: "#f1e9d3",
                          color: "var(--ink-mute)",
                        }}
                      >
                        일시정지
                      </span>
                    )}
                    {isSoon && (
                      <span
                        className="tag"
                        style={{ background: "var(--red)", color: "#fff" }}
                      >
                        곧 결제
                      </span>
                    )}
                  </div>
                  <div className={styles.subMeta}>
                    <span
                      className={styles.subCat}
                      style={{ color: CAT_COLORS[s.cat] }}
                    >
                      ● {s.cat}
                    </span>
                    <span className="dot-sep">·</span>
                    <span>
                      {s.cycle === "월" ? `매월 ${s.day}일` : `매년 ${s.day}월`}
                    </span>
                    <span className="dot-sep">·</span>
                    <span>가입 {formatStarted(s)}</span>
                  </div>
                </div>
                <div className={styles.subPrice}>
                  <div className={styles.subPriceVal}>{fmt(s.price)}</div>
                  <div className={styles.subPriceCycle}>/ {s.cycle}</div>
                </div>
                <button
                  className={styles.subEdit}
                  title="설정"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(s);
                  }}
                >
                  <Icon name="note" size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* INSIGHT — "새는 돈, 점검해볼까요?" 섹션
          용도/문구 미정 상태로 임시 비활성화. 데이터 모델 정해지면 복구 (2026-05-09).
      {SUBS.length > 0 && (
      <div className={`card card-pad ${styles.insightCard}`} style={{ marginTop: 18 }}>
        <div className={styles.insightStamp}>SAVE TIPS</div>
        <h3>새는 돈, 점검해볼까요?</h3>
        <ul className={styles.insightList}>
          <li>
            <span className={styles.iDot} style={{ background: "#e89aac" }} />
            <div>
              <b>왓챠</b>는 일시정지 중이지만 90일째 사용 안 함.
              <small>
                해지하면 연 <b>{fmt(12900 * 12)}</b> 절약
              </small>
            </div>
            <button
              className="timer-btn"
              onClick={() => setTipOpen({ kind: "cancel", subId: 7 })}
            >
              해지 검토
            </button>
          </li>
          <li>
            <span className={styles.iDot} style={{ background: "#a259ff" }} />
            <div>
              <b>Adobe CC</b>와 <b>Figma Pro</b> — 비슷한 작업에 둘 다 결제 중.
              <small>
                둘 중 하나만 쓰면 월 <b>{fmt(18500)}</b> 절약
              </small>
            </div>
            <button
              className="timer-btn"
              onClick={() => setTipOpen({ kind: "overlap", subId: 3 })}
            >
              자세히
            </button>
          </li>
        </ul>
      </div>
      )}
      */}

      {editing && (
        <SubEditModal
          sub={editing}
          onClose={() => setEditing(null)}
          onAnalyze={() => {
            setTipOpen({ kind: "cancel", subId: editing.id });
            setEditing(null);
          }}
        />
      )}
      {tipOpen && (
        <SaveTipModal
          tip={tipOpen}
          subs={SUBS}
          usage={SUB_USAGE}
          onClose={() => setTipOpen(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// SUB EDIT MODAL — 구독 상세/편집
// ============================================================
function SubEditModal({ sub, onClose, onAnalyze }) {
  const [name, setName] = useState(sub.name);
  const [price, setPrice] = useState(sub.price);
  const [cycle, setCycle] = useState(sub.cycle);
  const [day, setDay] = useState(sub.day);
  const [cat, setCat] = useState(sub.cat);
  const [color, setColor] = useState(subscriptionColor(sub));
  const [status, setStatus] = useState(sub.status);
  const [confirmDel, setConfirmDel] = useState(false);

  const fmt = (n) => formatWon(Number(n || 0));
  const annualSavings = sub.cycle === "월" ? sub.price * 12 : sub.price;

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>구독 수정</h3>
            <span className="badge-edit">✏️ EDIT</span>
          </div>
          <small>
            가입 {formatStarted(sub)} · 누적 결제 약{" "}
            {fmt(sub.price * Math.max(1, monthsBetween(formatStarted(sub))))}
          </small>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>

      <div
        className="modal-body"
        style={{ gap: 14, maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* preview header */}
        <div className={styles.subEditPreview}>
          <div
            className={styles.subMark}
            style={{
              background: color,
              width: 56,
              height: 56,
              fontSize: 20,
              borderRadius: 14,
            }}
          >
            {subscriptionInitial(sub)}
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.subEditName}>{name || "—"}</div>
            <div className={styles.subEditPrice}>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                {fmt(price)}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--ink-mute)",
                  marginLeft: 4,
                }}
              >
                / {cycle}
              </span>
            </div>
          </div>
          {status === "paused" && (
            <span
              className="tag"
              style={{ background: "#f1e9d3", color: "var(--ink-mute)" }}
            >
              일시정지
            </span>
          )}
          {status === "cancelled" && (
            <span
              className="tag"
              style={{ background: "var(--red)", color: "#fff" }}
            >
              해지
            </span>
          )}
        </div>

        <div className="field">
          <label>서비스명</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>금액</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <div className="field">
            <label>주기</label>
            <div className="seg">
              <button
                className={cycle === "월" ? "on" : ""}
                onClick={() => setCycle("월")}
              >
                월
              </button>
              <button
                className={cycle === "년" ? "on" : ""}
                onClick={() => setCycle("년")}
              >
                년
              </button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>{cycle === "월" ? "결제일 (매월)" : "결제월 (매년)"}</label>
          <div className={styles.dayPicker}>
            {Array.from({ length: cycle === "월" ? 31 : 12 }).map((_, i) => {
              const v = i + 1;
              return (
                <button
                  key={v}
                  className={styles.dayCell + (day === v ? " on" : "")}
                  onClick={() => setDay(v)}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label>카테고리</label>
          <div className="cat-chip-row">
            {SUB_CATS.map((c) => (
              <span
                key={c}
                className={"cat-chip" + (cat === c ? " on" : "")}
                onClick={() => setCat(c)}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: CAT_COLORS[c],
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="field">
          <label>색상</label>
          <div className="color-chip-row">
            {SUB_PALETTE.map((c) => (
              <div
                key={c}
                className={"color-chip" + (color === c ? " on" : "")}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="field">
          <label>상태</label>
          <div className={styles.statusSeg}>
            <button
              className={status === "active" ? "on" : ""}
              onClick={() => setStatus("active")}
            >
              <span className={styles.ssDot} style={{ background: "#4a8d5a" }} /> 활성
            </button>
            <button
              className={status === "paused" ? "on" : ""}
              onClick={() => setStatus("paused")}
            >
              <span
                className={styles.ssDot}
                style={{ background: "var(--ink-mute)" }}
              />{" "}
              일시정지
            </button>
            <button
              className={status === "cancelled" ? "on" : ""}
              onClick={() => setStatus("cancelled")}
            >
              <span className={styles.ssDot} style={{ background: "var(--red)" }} />{" "}
              해지
            </button>
          </div>
          {status === "paused" && (
            <small className={styles.statusHint}>
              결제는 멈추지만 목록에는 남아있어요.
            </small>
          )}
          {status === "cancelled" && (
            <small className={styles.statusHint} style={{ color: "var(--red)" }}>
              연 {fmt(annualSavings)} 절약 — 다시 가입할 때 데이터가 보존돼요.
            </small>
          )}
        </div>

        {/* analyze CTA */}
        <button className={styles.analyzeBtn} onClick={onAnalyze}>
          <div>
            <div className={styles.analyzeTtl}>이 구독, 절약 분석</div>
            <div className={styles.analyzeSub}>
              최근 사용 빈도 · 중복 구독 점검 · 절약 시뮬레이션
            </div>
          </div>
          <Icon name="arrowRight" size={14} />
        </button>
      </div>

      <div className="modal-foot edit">
        {confirmDel ? (
          <>
            <span className="del-confirm-label">정말 삭제할까요?</span>
            <button className="timer-btn" onClick={() => setConfirmDel(false)}>
              아니오
            </button>
            <button className="timer-btn danger" onClick={onClose}>
              네, 삭제
            </button>
          </>
        ) : (
          <>
            <button
              className="timer-btn ghost-danger"
              onClick={() => setConfirmDel(true)}
            >
              <Icon name="trash" size={13} /> 삭제
            </button>
            <div style={{ flex: 1 }} />
            <button className="timer-btn" onClick={onClose}>
              취소
            </button>
            <button className="timer-btn primary" onClick={onClose}>
              저장하기
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

function monthsBetween(started) {
  // started "YYYY.MM"
  const [y, m] = started.split(".").map((n) => parseInt(n, 10));
  const start = new Date(y, m - 1, 1);
  const now = new Date();
  return (
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())
  );
}

// ============================================================
// SAVE TIP MODAL — 절약 분석
// ============================================================
function SaveTipModal({ tip, onClose, subs: SUBS, usage: SUB_USAGE }) {
  const sub = SUBS.find((s) => s.id === tip.subId);
  if (!sub) return null;
  const fmt = formatWon;
  const annual = sub.cycle === "월" ? sub.price * 12 : sub.price;
  const usage = SUB_USAGE[sub.id] || {
    lastUsed: "—",
    monthlyMinutes: [0, 0, 0, 0, 0],
    avgPerWeek: 0,
    overlap: [],
  };
  const isOverlap = tip.kind === "overlap";
  const overlapSubs = usage.overlap
    .map((name) => SUBS.find((s) => s.name === name))
    .filter(Boolean);
  const totalSavings = isOverlap ? annual : annual;

  const maxMin = Math.max(...usage.monthlyMinutes, 60);
  const months = ["7월", "8월", "9월", "10월", "11월"];

  return (
    <Modal open={true} onClose={onClose} className={styles.saveTipModal}>
      <div className="modal-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3>{isOverlap ? "중복 구독 분석" : "해지 검토"}</h3>
            <span className={styles.badgeSavings}>💰 SAVE</span>
          </div>
          <small>
            {sub.name}
            {isOverlap &&
              overlapSubs.length > 0 &&
              ` × ${overlapSubs.map((s) => s.name).join(", ")}`}{" "}
            분석
          </small>
        </div>
        <button
          className="icon-btn"
          style={{ width: 32, height: 32 }}
          onClick={onClose}
        >
          <Icon name="x" size={14} />
        </button>
      </div>

      <div
        className="modal-body"
        style={{ gap: 16, maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* Hero — projected savings */}
        <div className={styles.savingsHero}>
          <div className={styles.savingsHeroLbl}>해지 시 연 절약</div>
          <div className={styles.savingsHeroVal}>{fmt(totalSavings)}</div>
          <div className={styles.savingsHeroSub}>
            월{" "}
            {fmt(sub.cycle === "월" ? sub.price : Math.round(sub.price / 12))} ×
            12개월
          </div>
          <span className={styles.savingsHeroStamp}>SAVE</span>
        </div>

        {/* Usage chart */}
        <div className={styles.usageBlock}>
          <div className={styles.blockHead}>
            <div>
              <div className={styles.blockTtl}>최근 5개월 사용량</div>
              <div className={styles.blockSub}>마지막 사용 · {usage.lastUsed}</div>
            </div>
            <div>
              <div className={styles.blockStatVal}>
                {usage.avgPerWeek}
                <span>분/주</span>
              </div>
            </div>
          </div>
          <div className={styles.usageBars}>
            {usage.monthlyMinutes.map((m, i) => (
              <div key={i} className={styles.usageCol}>
                <div className={styles.usageBarWrap}>
                  <div
                    className={
                      styles.usageBar +
                      (m === 0 ? ` ${styles.zero}` : "") +
                      (i === 4 ? ` ${styles.now}` : "")
                    }
                    style={{
                      height: m === 0 ? "4px" : `${(m / maxMin) * 100}%`,
                    }}
                  >
                    <span className={styles.usageVal}>
                      {m === 0 ? "0" : `${Math.round(m / 60)}h`}
                    </span>
                  </div>
                </div>
                <div className={styles.usageLbl}>{months[i]}</div>
              </div>
            ))}
          </div>
          {usage.avgPerWeek === 0 && (
            <div className={styles.usageWarn}>
              <Icon name="alert" size={14} /> 90일 이상 사용하지 않았어요.
              해지하기 좋은 타이밍이에요.
            </div>
          )}
        </div>

        {/* Overlap section (only for overlap kind) */}
        {isOverlap && overlapSubs.length > 0 && (
          <div className={styles.overlapBlock}>
            <div className={styles.blockTtl}>함께 결제 중인 비슷한 구독</div>
            <div className={styles.blockSub} style={{ marginBottom: 10 }}>
              유사한 작업에 쓰이는 도구들이에요
            </div>
            <div className={styles.overlapRow}>
              <div className={styles.overlapCard}>
                <div
                  className={styles.subMark}
                  style={{ background: subscriptionColor(sub) }}
                >
                  {subscriptionInitial(sub)}
                </div>
                <div className={styles.overlapName}>{sub.name}</div>
                <div className={styles.overlapPrice}>
                  {fmt(sub.price)}
                  <span>/{sub.cycle}</span>
                </div>
                <div className={styles.overlapUse}>주 {usage.avgPerWeek}분 사용</div>
              </div>
              <div className={styles.overlapVs}>VS</div>
              {overlapSubs.map((o) => {
                const u = SUB_USAGE[o.id] || { avgPerWeek: 0 };
                return (
                  <div key={o.id} className={styles.overlapCard}>
                    <div
                      className={styles.subMark}
                      style={{ background: subscriptionColor(o) }}
                    >
                      {subscriptionInitial(o)}
                    </div>
                    <div className={styles.overlapName}>{o.name}</div>
                    <div className={styles.overlapPrice}>
                      {fmt(o.price)}
                      <span>/{o.cycle}</span>
                    </div>
                    <div className={styles.overlapUse}>주 {u.avgPerWeek}분 사용</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.overlapRec}>
              <Icon name="target" size={14} />
              <div>
                <b>
                  {usage.avgPerWeek <
                  (SUB_USAGE[overlapSubs[0]?.id]?.avgPerWeek || 0)
                    ? sub.name
                    : overlapSubs[0].name}
                </b>
                를(을) 해지하면 연 <b>{fmt(annual)}</b> 절약
              </div>
            </div>
          </div>
        )}

        {/* Action breakdown */}
        <div className={styles.actionList}>
          <div className={styles.blockTtl} style={{ marginBottom: 8 }}>
            이렇게 할 수 있어요
          </div>

          <div className={styles.actionRow}>
            <div
              className={styles.actionIcon}
              style={{ background: "#f1e9d3", color: "var(--ink)" }}
            >
              ⏸
            </div>
            <div>
              <div className={styles.actionTtl}>일시정지</div>
              <div className={styles.actionSub}>
                최대 3개월. 데이터는 그대로 남아있어요.
              </div>
            </div>
            <div className={styles.actionSavings}>
              <div className={styles.actionAmt}>
                {fmt(
                  sub.cycle === "월"
                    ? sub.price * 3
                    : Math.round(sub.price / 4),
                )}
              </div>
              <div className={styles.actionAmtSub}>3개월 절약</div>
            </div>
            <button className="timer-btn">선택</button>
          </div>

          <div className={`${styles.actionRow} ${styles.recommended}`}>
            <div
              className={styles.actionIcon}
              style={{ background: "var(--red)", color: "#fff" }}
            >
              ✕
            </div>
            <div>
              <div className={styles.actionTtl}>
                해지 <span className={styles.recTag}>추천</span>
              </div>
              <div className={styles.actionSub}>
                바로 해지. 다음 결제일부터 청구 안 됨.
              </div>
            </div>
            <div className={styles.actionSavings}>
              <div className={styles.actionAmt}>{fmt(annual)}</div>
              <div className={styles.actionAmtSub}>연 절약</div>
            </div>
            <button className="timer-btn primary">해지하기</button>
          </div>

          {!isOverlap && (
            <div className={styles.actionRow}>
              <div
                className={styles.actionIcon}
                style={{ background: "var(--yellow)", color: "var(--ink)" }}
              >
                ↓
              </div>
              <div>
                <div className={styles.actionTtl}>하위 요금제로 변경</div>
                <div className={styles.actionSub}>
                  광고 포함 · 화질 제한이 있을 수 있어요.
                </div>
              </div>
              <div className={styles.actionSavings}>
                <div className={styles.actionAmt}>
                  {fmt(Math.round(sub.price * 0.4) * 12)}
                </div>
                <div className={styles.actionAmtSub}>연 절약 (예상)</div>
              </div>
              <button className="timer-btn">선택</button>
            </div>
          )}
        </div>
      </div>

      <div className="modal-foot">
        <button className="timer-btn" onClick={onClose}>
          나중에
        </button>
        <button className="timer-btn primary" onClick={onClose}>
          30일 후 다시 알려주기
        </button>
      </div>
    </Modal>
  );
}

export { SubsPage };

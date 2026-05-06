// @ts-nocheck
import { useState, useMemo } from "react";
import { Icon } from "@/components/icons";
import { formatSignedWon, formatWon } from "@/lib/format";
import { DOW } from "@/lib/date";
import {
  EVENT_CATEGORY_COLORS,
  TRANSACTION_CATEGORIES,
} from "@/lib/categories";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { inferIcon } from "@/features/transactions/selectors/derived";
import { useEvents } from "@/features/events/hooks/useEvents";
import {
  monthlyTotals,
  currentMonthSummary,
  categoryShare,
  groupByDay,
} from "@/features/transactions/selectors/transactions";

// ============================================================
// LEDGER PAGE — 가계부 detail
// ============================================================
function LedgerPage({ onAdd, onEditTxn }) {
  const [filter, setFilter] = useState("all");
  const { all: txnsAll } = useTransactions();

  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const trend = useMemo(() => monthlyTotals(txnsAll), [txnsAll]);
  const catShares = useMemo(() => categoryShare(txnsAll, "expense"), [txnsAll]);
  const grouped = useMemo(() => groupByDay(txnsAll), [txnsAll]);

  const won = formatWon;
  const stats = [
    {
      lbl: "이번 달 수입",
      val: won(summary.income),
      delta: "이번 달 누적",
      up: true,
      color: "#2d7a3a",
    },
    {
      lbl: "이번 달 지출",
      val: won(summary.expense),
      delta: "이번 달 누적",
      up: false,
      color: "var(--red)",
    },
    {
      lbl: "잔액",
      val: won(summary.net),
      delta: "수입 - 지출",
      up: summary.net >= 0,
      color: "var(--ink)",
    },
    {
      lbl: "거래 건수",
      val: `${txnsAll.length}건`,
      delta: "전체 데이터",
      up: null,
      color: "var(--ink-soft)",
    },
  ];

  // Top 6 categories with TRANSACTION_CATEGORIES color mapping.
  const cats = catShares.slice(0, 6).map((c) => ({
    name: c.cat,
    amount: c.amount,
    color: TRANSACTION_CATEGORIES[c.cat] || "#c9bd9f",
    pct: c.pct.toFixed(1),
  }));

  // Transform grouped Map → array shape used by render below.
  const txns = useMemo(() => {
    const out = [];
    for (const [date, items] of grouped) {
      const md = date.slice(5).replace("-", ".");
      const dt = new Date(date);
      const dow = DOW[dt.getDay()];
      out.push({ d: `${md} ${dow}`, items });
      if (out.length >= 5) break;
    }
    return out;
  }, [grouped]);

  const fmt = formatSignedWon;

  return (
    <div data-screen-label="02 가계부">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 가계부</div>
          <h1 className="page-title">
            가계부 <span className="hand-sub">— 돈의 흐름을 한눈에</span>
          </h1>
          <div className="page-sub">2026년 11월 · 4주차</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">내보내기</button>
          <button className="timer-btn primary" onClick={onAdd}>
            + 내역 추가
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.lbl} className="stat-card">
            <div className="lbl">{s.lbl}</div>
            <div className="val" style={{ color: s.color }}>
              {s.val}
            </div>
            <div
              className={
                "delta " + (s.up === true ? "up" : s.up === false ? "down" : "")
              }
            >
              {s.up === true && <Icon name="arrowUp" size={11} />}
              {s.up === false && <Icon name="arrowDown" size={11} />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card card-pad col-7">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="wallet" size={16} />
                월별 추이
              </div>
              <div className="card-sub">최근 11개월간 수입 vs 지출</div>
            </div>
            <div className="row" style={{ gap: 8, fontSize: 11 }}>
              <span className="row" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "#4a8d5a",
                    borderRadius: 2,
                  }}
                />
                수입
              </span>
              <span className="row" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "var(--red)",
                    opacity: 0.7,
                    borderRadius: 2,
                  }}
                />
                지출
              </span>
            </div>
          </div>
          <div className="bars" style={{ height: 180 }}>
            {trend.in.map((inV, i) => {
              const maxV = Math.max(90, ...trend.in, ...trend.out);
              const o = trend.out[i] ?? 0;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    alignItems: "stretch",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    className="bar in"
                    style={{ height: `${(inV / maxV) * 60}%` }}
                  />
                  <div
                    className="bar out"
                    style={{ height: `${(o / maxV) * 40}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="bars-axis">
            {trend.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="card card-pad col-5">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="target" size={16} />
                카테고리별 지출
              </div>
              <div className="card-sub">
                이번 달 · 총 {won(summary.expense)}
              </div>
            </div>
          </div>
          <div className="cat-bar-stack">
            {cats.map((c) => (
              <div
                key={c.name}
                style={{ width: c.pct + "%", background: c.color }}
                title={`${c.name} ${c.pct}%`}
              />
            ))}
          </div>
          <div className="cats">
            {cats.map((c) => (
              <div key={c.name} className="cat-row">
                <span className="cat-dot" style={{ background: c.color }} />
                <span className="cat-name">{c.name}</span>
                <span className="cat-pct">{c.pct}%</span>
                <span className="cat-amount">₩{c.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 18 }}>
        <div className="card-head">
          <div>
            <div className="card-title">
              <Icon name="cash" size={16} />
              최근 거래내역
            </div>
            <div className="card-sub">최근 7일</div>
          </div>
          <div className="filter-tabs">
            {[
              ["all", "전체"],
              ["in", "수입"],
              ["out", "지출"],
            ].map(([k, l]) => (
              <span
                key={k}
                className={"filter-tab" + (filter === k ? " on" : "")}
                onClick={() => setFilter(k)}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="txn-groups">
          {txns.map((g) => (
            <div key={g.d} className="txn-group">
              <div className="txn-date">{g.d}</div>
              <div>
                {g.items
                  .filter((t) => filter === "all" || t.type === filter)
                  .map((t, i) => (
                    <div key={i} className="txn">
                      <div className="txn-ico">
                        <Icon name={inferIcon(t)} size={14} />
                      </div>
                      <div className="txn-label">
                        {t.label}
                        <small>{t.note}</small>
                      </div>
                      <span className="tag" style={{ marginRight: 8 }}>
                        {t.cat}
                      </span>
                      <div className={"txn-amount " + t.type}>
                        {fmt(t.amount)}
                      </div>
                      <button
                        className="txn-edit-btn"
                        onClick={() => onEditTxn && onEditTxn(t)}
                        title="수정"
                      >
                        <Icon name="note" size={12} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CALENDAR PAGE — 캘린더 detail
// ============================================================
function CalendarPage({ onAdd, onEditEvent }) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  // selected day-of-month (within current cursor month). default = today if same month
  const [selDay, setSelDay] = useState(
    cursor.getMonth() === today.getMonth() &&
      cursor.getFullYear() === today.getFullYear()
      ? today.getDate()
      : 1,
  );

  const yr = cursor.getFullYear(),
    mo = cursor.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const daysPrev = new Date(yr, mo, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ d: daysPrev - i, muted: true, mo: mo - 1 });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i, mo });
  while (cells.length < 42)
    cells.push({
      d: cells.length - daysInMonth - firstDay + 1,
      muted: true,
      mo: mo + 1,
    });

  const { data: rawEvents } = useEvents();
  // Group events into a day-of-month → adapted-shape map for the cursor month.
  const events = useMemo(() => {
    const monthPrefix = `${yr}-${String(mo + 1).padStart(2, "0")}-`;
    const map = {};
    for (const ev of rawEvents) {
      if (!ev.date.startsWith(monthPrefix)) continue;
      const day = parseInt(ev.date.slice(8, 10), 10);
      const adapted = {
        id: ev.id,
        t: ev.title,
        color: ev.color || "var(--ink)",
        time: ev.allDay ? "종일" : ev.startTime || "",
        dur: ev.startTime && ev.endTime ? `${ev.startTime}—${ev.endTime}` : "",
        place: ev.place || "",
        _orig: ev,
      };
      (map[day] ||= []).push(adapted);
    }
    return map;
  }, [rawEvents, yr, mo]);

  const dow = DOW;
  const selEvents = events[selDay] || [];
  const isSelToday =
    selDay === today.getDate() &&
    mo === today.getMonth() &&
    yr === today.getFullYear();
  // compute weekday for selected day
  const selDate = new Date(yr, mo, selDay);
  const selDow = dow[selDate.getDay()];

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <div data-screen-label="03 캘린더">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 캘린더</div>
          <h1 className="page-title">
            {yr}년 {monthNames[mo]}{" "}
            <span className="hand-sub">— 이달의 일정</span>
          </h1>
          <div className="page-sub">
            총 {Object.values(events).flat().length}개의 일정 ·{" "}
            {Object.keys(events).length}일에 분포
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div
            className="row"
            style={{
              gap: 0,
              border: "1px solid var(--line)",
              borderRadius: 8,
              overflow: "hidden",
              background: "var(--card)",
            }}
          >
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(yr, mo - 1, 1));
                setSelDay(1);
              }}
            >
              ‹
            </button>
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelDay(today.getDate());
              }}
            >
              오늘
            </button>
            <button
              className="cal-nav"
              onClick={() => {
                setCursor(new Date(yr, mo + 1, 1));
                setSelDay(1);
              }}
            >
              ›
            </button>
          </div>
          <button className="timer-btn primary" onClick={onAdd}>
            + 일정 추가
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card card-pad col-8">
          <div className="big-cal">
            <div className="big-cal-head">
              {dow.map((d, i) => (
                <div
                  key={d}
                  className={
                    "big-dow" + (i === 0 ? " sun" : i === 6 ? " sat" : "")
                  }
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="big-cal-grid">
              {cells.map((c, i) => {
                const isToday =
                  !c.muted &&
                  c.d === today.getDate() &&
                  mo === today.getMonth() &&
                  yr === today.getFullYear();
                const dayEvents = !c.muted ? events[c.d] || [] : [];
                const dow_i = i % 7;
                return (
                  <div
                    key={i}
                    className={
                      "big-cell" +
                      (c.muted ? " muted" : "") +
                      (isToday ? " today" : "") +
                      (!c.muted && c.d === selDay ? " selected" : "")
                    }
                    onClick={() => !c.muted && setSelDay(c.d)}
                  >
                    <div
                      className={
                        "big-cell-num" +
                        (dow_i === 0 ? " sun" : dow_i === 6 ? " sat" : "")
                      }
                    >
                      {c.d}
                      {isToday && <span className="today-pill">TODAY</span>}
                    </div>
                    <div className="big-cell-events">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <div
                          key={j}
                          className="big-event"
                          style={{ background: e.color }}
                        >
                          {e.time && (
                            <span className="big-event-time">{e.time}</span>
                          )}
                          {e.t}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="big-event-more">
                          +{dayEvents.length - 3}개
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card card-pad col-4">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="cal" size={16} />
                {monthNames[mo]} {selDay}일{" "}
                <span
                  style={{
                    color: "var(--ink-mute)",
                    fontWeight: 500,
                    marginLeft: 6,
                  }}
                >
                  {selDow}요일
                </span>
              </div>
              <div className="card-sub">
                {isSelToday ? "오늘" : `${selEvents.length}건의 일정`}
              </div>
            </div>
            {isSelToday && <span className="tag">오늘</span>}
            {!isSelToday && <span className="tag">{selEvents.length}</span>}
          </div>
          <div className="upcoming">
            {selEvents.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "32px 16px",
                  gap: 8,
                  textAlign: "center",
                  color: "var(--ink-mute)",
                }}
              >
                <div style={{ fontSize: 32, opacity: 0.4 }}>○</div>
                <b style={{ fontSize: 14, color: "var(--ink)" }}>
                  일정이 없어요
                </b>
                <small style={{ fontSize: 12 }}>여유로운 하루를 보내세요</small>
                <button
                  className="timer-btn"
                  style={{ marginTop: 6 }}
                  onClick={onAdd}
                >
                  + 일정 추가
                </button>
              </div>
            ) : (
              selEvents.map((e, i) => (
                <div key={i} className="upc">
                  <span className="upc-bar" style={{ background: e.color }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="upc-day">
                      {e.time}
                      {e.dur ? ` · ${e.dur}` : ""}
                    </div>
                    <div className="upc-title">{e.t}</div>
                    {e.place && <div className="upc-time">{e.place}</div>}
                  </div>
                  <button
                    className="upc-edit-btn"
                    onClick={() => onEditEvent && onEditEvent(e._orig || e)}
                    title="수정"
                  >
                    <Icon name="note" size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px dashed var(--line)",
            }}
          >
            <div
              className="card-title"
              style={{ fontSize: 13, marginBottom: 10 }}
            >
              일정 카테고리
            </div>
            <div className="legend">
              {EVENT_CATEGORY_COLORS.map(([n, c]) => (
                <span key={n} className="legend-item">
                  <span className="legend-dot" style={{ background: c }} />
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS PAGE — 환경설정 detail
// ============================================================
function SettingsPage({ tweaks, setTweak }) {
  const [section, setSection] = useState("profile");
  const sections = [
    {
      id: "profile",
      icon: "home",
      label: "프로필",
      sub: "이름 · 이메일 · 사진",
    },
    {
      id: "appearance",
      icon: "sparkle",
      label: "테마 · 외관",
      sub: "다크 모드 · 색상",
    },
    {
      id: "ledger",
      icon: "wallet",
      label: "가계부 설정",
      sub: "월급일 · 카테고리 · 통화",
    },
    {
      id: "notifications",
      icon: "bell",
      label: "알림",
      sub: "푸시 · 이메일 · 사운드",
    },
    {
      id: "tools",
      icon: "settings",
      label: "도구 설정",
      sub: "타이머 · 메모 기본값",
    },
    {
      id: "security",
      icon: "settings",
      label: "보안 · 잠금",
      sub: "비밀번호 · 생체 인증",
    },
    {
      id: "data",
      icon: "wallet",
      label: "데이터",
      sub: "백업 · 내보내기 · 삭제",
    },
    { id: "account", icon: "coin", label: "계정 · 결제", sub: "플랜 · 청구" },
  ];

  return (
    <div data-screen-label="04 환경설정">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 환경설정</div>
          <h1 className="page-title">
            환경설정 <span className="hand-sub">— 내 입맛에 맞게</span>
          </h1>
          <div className="page-sub">앱 동작과 모양을 자유롭게 바꿔보세요</div>
        </div>
        <button className="timer-btn primary">변경 저장</button>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav">
          {sections.map((s) => (
            <div
              key={s.id}
              className={"settings-nav-item" + (section === s.id ? " on" : "")}
              onClick={() => setSection(s.id)}
            >
              <Icon name={s.icon} size={16} />
              <div>
                <b>{s.label}</b>
                <small>{s.sub}</small>
              </div>
            </div>
          ))}
        </aside>

        <div className="settings-main">
          {section === "profile" && <ProfileSection />}
          {section === "appearance" && (
            <AppearanceSection tweaks={tweaks} setTweak={setTweak} />
          )}
          {section === "ledger" && (
            <LedgerSettingsSection tweaks={tweaks} setTweak={setTweak} />
          )}
          {section === "notifications" && <NotificationsSection />}
          {section === "tools" && <ToolsSection />}
          {section === "security" && <SecuritySection />}
          {section === "data" && <DataSection />}
          {section === "account" && <AccountSection />}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="setting-row">
      <div className="setting-label">
        <b>{label}</b>
        {sub && <small>{sub}</small>}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}

function ProfileSection() {
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
            N
          </div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 18 }}>나비</b>
            <div className="muted" style={{ fontSize: 13 }}>
              nabi@dayflow.app · 무료 플랜
            </div>
          </div>
          <button className="timer-btn">사진 변경</button>
        </div>
        <SettingRow label="이름">
          <input className="set-input" defaultValue="나비" />
        </SettingRow>
        <SettingRow label="이메일">
          <input className="set-input" defaultValue="nabi@dayflow.app" />
        </SettingRow>
        <SettingRow label="자기소개" sub="대시보드 상단에 표시됩니다">
          <textarea
            className="set-input"
            rows="2"
            defaultValue="디자이너 / 일과 삶의 균형을 추구합니다."
          />
        </SettingRow>
        <SettingRow label="시간대">
          <select className="set-input" defaultValue="seoul">
            <option value="seoul">(GMT+9) 서울</option>
            <option>도쿄</option>
            <option>뉴욕</option>
          </select>
        </SettingRow>
      </div>
    </>
  );
}

function AppearanceSection({ tweaks, setTweak }) {
  const accents = [
    { id: "yellow", c: "#ffe27a", label: "노랑" },
    { id: "coral", c: "#ffb38a", label: "코랄" },
    { id: "mint", c: "#b9e7c9", label: "민트" },
    { id: "lilac", c: "#d4c1f0", label: "라일락" },
  ];
  return (
    <>
      <div className="settings-group">
        <h3>테마</h3>
        <SettingRow label="다크 모드" sub="저녁 작업에 편한 어두운 테마">
          <Switch on={!!tweaks.dark} onChange={(v) => setTweak("dark", v)} />
        </SettingRow>
        <SettingRow label="포인트 컬러" sub="브랜드 색상과 강조 요소에 적용">
          <div className="row" style={{ gap: 8 }}>
            {accents.map((a) => (
              <div
                key={a.id}
                className={"acc-swatch" + (tweaks.accent === a.id ? " on" : "")}
                style={{ background: a.c }}
                onClick={() => setTweak("accent", a.id)}
                title={a.label}
              >
                {tweaks.accent === a.id && <Icon name="check" size={14} />}
              </div>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="달력 표시" sub="대시보드에 미니 달력 노출">
          <Switch
            on={tweaks.showCalendar !== false}
            onChange={(v) => setTweak("showCalendar", v)}
          />
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>글꼴 · 타이포그래피</h3>
        <SettingRow label="기본 글꼴">
          <select className="set-input" defaultValue="jakarta">
            <option value="jakarta">Plus Jakarta Sans</option>
            <option>Pretendard</option>
            <option>Noto Sans KR</option>
          </select>
        </SettingRow>
        <SettingRow label="글자 크기" sub="앱 전체 기준">
          <select className="set-input" defaultValue="m">
            <option value="s">작게</option>
            <option value="m">보통</option>
            <option value="l">크게</option>
          </select>
        </SettingRow>
      </div>
    </>
  );
}

function LedgerSettingsSection({ tweaks, setTweak }) {
  const payday = tweaks.payday || 25;
  const paydayType = tweaks.paydayType || "fixed"; // fixed / lastDay / firstDay
  const currency = tweaks.currency || "KRW";
  const startDay = tweaks.cycleStart || "payday"; // payday / 1st / custom
  return (
    <>
      <div className="settings-group">
        <h3>월급일 · 가계부 주기</h3>
        <SettingRow label="월급일 유형" sub="실제 입금 패턴에 맞춰 선택하세요">
          <select
            className="set-input"
            value={paydayType}
            onChange={(e) => setTweak("paydayType", e.target.value)}
          >
            <option value="fixed">매월 고정일</option>
            <option value="lastDay">매월 말일</option>
            <option value="firstDay">매월 1일</option>
            <option value="custom">사용자 지정</option>
          </select>
        </SettingRow>
        {paydayType === "fixed" && (
          <SettingRow
            label="월급일 (매월)"
            sub="이 날짜를 기준으로 D-day와 가계부 주기가 계산돼요"
          >
            <div className="payday-pick">
              <input
                type="number"
                min="1"
                max="31"
                className="set-input"
                style={{
                  minWidth: 80,
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                }}
                value={payday}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 1 && v <= 31) setTweak("payday", v);
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  fontWeight: 600,
                }}
              >
                일
              </span>
            </div>
          </SettingRow>
        )}
        <SettingRow label="가계부 주기 시작일" sub="한 달 통계의 시작점">
          <select
            className="set-input"
            value={startDay}
            onChange={(e) => setTweak("cycleStart", e.target.value)}
          >
            <option value="payday">월급일 기준</option>
            <option value="1st">매월 1일</option>
            <option value="custom">사용자 지정</option>
          </select>
        </SettingRow>
        <SettingRow label="주말일 때 처리" sub="월급일이 주말/공휴일이면">
          <select className="set-input" defaultValue="prev">
            <option value="prev">앞당겨서 입금</option>
            <option value="next">뒤로 미뤄서 입금</option>
            <option value="exact">그대로 표시</option>
          </select>
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>예산 · 한도</h3>
        <SettingRow label="월 예산 알림" sub="예산의 80% 도달 시 알림">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="기본 통화">
          <select
            className="set-input"
            value={currency}
            onChange={(e) => setTweak("currency", e.target.value)}
          >
            <option value="KRW">원 (₩)</option>
            <option value="USD">달러 ($)</option>
            <option value="JPY">엔 (¥)</option>
            <option value="EUR">유로 (€)</option>
          </select>
        </SettingRow>
        <SettingRow label="천 단위 표기" sub="₩1,000,000 vs 1백만">
          <select className="set-input" defaultValue="comma">
            <option value="comma">콤마 (1,000,000)</option>
            <option value="korean">한글 (1백만)</option>
            <option value="short">단축 (1M)</option>
          </select>
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>카테고리 · 자동 분류</h3>
        <SettingRow
          label="자동 카테고리 인식"
          sub="가맹점명으로 카테고리 자동 분류"
        >
          <Switch on={true} />
        </SettingRow>
        <SettingRow
          label="정기 결제 자동 등록"
          sub="동일 금액 반복 시 구독으로 추정"
        >
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="카테고리 관리">
          <button className="timer-btn">편집</button>
        </SettingRow>
      </div>
    </>
  );
}

function SecuritySection() {
  return (
    <>
      <div className="settings-group">
        <h3>앱 잠금</h3>
        <SettingRow label="앱 진입 시 잠금" sub="시작할 때 인증 요구">
          <Switch on={false} />
        </SettingRow>
        <SettingRow label="가계부 잠금" sub="가계부 페이지만 별도 잠금">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="자동 잠금 시간">
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
        <SettingRow label="비밀번호 변경">
          <button className="timer-btn">변경</button>
        </SettingRow>
        <SettingRow label="생체 인증" sub="Face ID / 지문">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="2단계 인증" sub="이메일 OTP">
          <Switch on={false} />
        </SettingRow>
      </div>
    </>
  );
}

function NotificationsSection() {
  return (
    <>
      <div className="settings-group">
        <h3>알림</h3>
        <SettingRow label="포모도로 종료" sub="집중 / 휴식 끝났을 때 알림">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="할 일 마감 임박" sub="마감 1시간 전 알림">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="일정 시작 전" sub="일정 15분 전 미리 알림">
          <Switch on={false} />
        </SettingRow>
        <SettingRow label="정기 구독 결제" sub="결제 3일 전 알림">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="이메일 요약" sub="주간 활동 요약 메일">
          <Switch on={false} />
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>방해 금지 시간</h3>
        <SettingRow label="시작 시간">
          <input className="set-input" type="time" defaultValue="22:00" />
        </SettingRow>
        <SettingRow label="종료 시간">
          <input className="set-input" type="time" defaultValue="07:00" />
        </SettingRow>
      </div>
    </>
  );
}

function ToolsSection() {
  return (
    <>
      <div className="settings-group">
        <h3>포모도로 기본값</h3>
        <SettingRow label="집중 시간 (분)">
          <input className="set-input" type="number" defaultValue="25" />
        </SettingRow>
        <SettingRow label="짧은 휴식 (분)">
          <input className="set-input" type="number" defaultValue="5" />
        </SettingRow>
        <SettingRow label="긴 휴식 (분)">
          <input className="set-input" type="number" defaultValue="15" />
        </SettingRow>
        <SettingRow label="자동으로 다음 세션 시작">
          <Switch on={false} />
        </SettingRow>
      </div>
      <div className="settings-group">
        <h3>스티커 메모</h3>
        <SettingRow label="새 메모 기본 색상">
          <select className="set-input" defaultValue="yellow">
            <option value="yellow">노랑</option>
            <option>분홍</option>
            <option>파랑</option>
          </select>
        </SettingRow>
        <SettingRow label="최대 메모 개수">
          <input className="set-input" type="number" defaultValue="3" />
        </SettingRow>
      </div>
    </>
  );
}

function DataSection() {
  return (
    <>
      <div className="settings-group">
        <h3>백업 · 내보내기</h3>
        <SettingRow label="자동 백업" sub="매일 자정 클라우드에 저장">
          <Switch on={true} />
        </SettingRow>
        <SettingRow label="가계부 내보내기" sub="CSV / Excel 형식">
          <button className="timer-btn">다운로드</button>
        </SettingRow>
        <SettingRow label="전체 데이터 내보내기" sub="JSON 형식">
          <button className="timer-btn">다운로드</button>
        </SettingRow>
      </div>
      <div className="settings-group danger">
        <h3>위험 구역</h3>
        <SettingRow label="모든 메모 삭제" sub="복구할 수 없습니다">
          <button className="timer-btn danger-btn">삭제</button>
        </SettingRow>
        <SettingRow label="계정 삭제" sub="모든 데이터가 영구 삭제됩니다">
          <button className="timer-btn danger-btn">계정 삭제</button>
        </SettingRow>
      </div>
    </>
  );
}

function AccountSection() {
  return (
    <>
      <div className="settings-group">
        <h3>현재 플랜</h3>
        <div className="plan-card">
          <div>
            <b style={{ fontSize: 18 }}>무료 플랜</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              스티커 3개 · 기본 도구 · 광고 없음
            </div>
          </div>
          <button className="timer-btn primary">Pro로 업그레이드</button>
        </div>
        <div className="plan-card pro">
          <div>
            <b style={{ fontSize: 18 }}>Pro 플랜 — ₩4,900/월</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              무제한 메모 · 클라우드 백업 · 우선 지원 · 가족 공유
            </div>
          </div>
          <span className="tag">추천</span>
        </div>
      </div>
    </>
  );
}

function Switch({ on, onChange }) {
  const [val, setVal] = useState(on);
  const v = onChange ? on : val;
  const toggle = () => {
    if (onChange) onChange(!on);
    else setVal(!val);
  };
  return (
    <button className={"switch" + (v ? " on" : "")} onClick={toggle}>
      <span className="switch-thumb" />
    </button>
  );
}

export { LedgerPage, CalendarPage, SettingsPage };

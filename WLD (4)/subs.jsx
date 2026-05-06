/* global React, Icon */
const { useState, useMemo } = React;

// ============================================================
// SUBSCRIPTIONS PAGE — 정기구독 (simplified)
// ============================================================

const SUBS = [
  { id: 1, name: "Netflix",       cat: "엔터테인먼트", price: 17000, cycle: "월", day: 7,  color: "#e25c4d", initial: "N",  status: "active",  started: "2023.05" },
  { id: 2, name: "Spotify",       cat: "음악",         price: 13900, cycle: "월", day: 12, color: "#4a8d5a", initial: "S",  status: "active",  started: "2022.11" },
  { id: 3, name: "Adobe CC",      cat: "업무 도구",    price: 24000, cycle: "월", day: 15, color: "#ee5a3d", initial: "Ai", status: "active",  started: "2024.01" },
  { id: 4, name: "Figma Pro",     cat: "업무 도구",    price: 18500, cycle: "월", day: 21, color: "#a259ff", initial: "F",  status: "active",  started: "2023.09" },
  { id: 5, name: "iCloud+ 200GB", cat: "클라우드",     price: 3300,  cycle: "월", day: 3,  color: "#3a8dde", initial: "iC", status: "active",  started: "2021.04" },
  { id: 6, name: "쿠팡 와우",      cat: "쇼핑",        price: 7890,  cycle: "월", day: 8,  color: "#e8c84a", initial: "쿠", status: "active",  started: "2022.06" },
  { id: 7, name: "왓챠",           cat: "엔터테인먼트", price: 12900, cycle: "월", day: 18, color: "#e89aac", initial: "W",  status: "paused",  started: "2024.06" },
  { id: 8, name: "ChatGPT Plus",  cat: "업무 도구",    price: 28000, cycle: "월", day: 25, color: "#1a1a1a", initial: "G",  status: "active",  started: "2024.03" },
  { id: 9, name: "노션 패밀리",    cat: "업무 도구",    price: 12000, cycle: "월", day: 6,  color: "#000000", initial: "N",  status: "active",  started: "2023.02" },
  { id: 10,name: "교보문고 sam",   cat: "독서",         price: 9900,  cycle: "월", day: 14, color: "#2c5e8b", initial: "사", status: "active",  started: "2024.07" },
  { id: 11,name: "헬스장",         cat: "건강",         price: 89000, cycle: "월", day: 1,  color: "#a8d09b", initial: "헬", status: "active",  started: "2025.04" },
  { id: 12,name: "도메인 갱신",    cat: "기타",         price: 22000, cycle: "년", day: 4,  color: "#c9bd9f", initial: "D",  status: "active",  started: "2020.04" },
];

const CAT_COLORS = {
  "업무 도구":    "#a259ff",
  "엔터테인먼트": "#e25c4d",
  "음악":         "#4a8d5a",
  "클라우드":     "#3a8dde",
  "쇼핑":         "#e8c84a",
  "독서":         "#2c5e8b",
  "건강":         "#a8d09b",
  "기타":         "#c9bd9f",
};

const SUB_CATS = Object.keys(CAT_COLORS);
const SUB_PALETTE = ["#e25c4d", "#4a8d5a", "#3a8dde", "#a259ff", "#e8c84a", "#e89aac", "#1a1a1a", "#a8d09b", "#c9bd9f", "#ee5a3d"];

// usage data for save-tip detail (last 30 days)
const SUB_USAGE = {
  7: { // 왓챠
    lastUsed: "2025.08.12 (90일 전)",
    monthlyMinutes: [240, 180, 60, 0, 0],
    avgPerWeek: 0,
    overlap: ["Netflix"],
  },
  3: { // Adobe CC
    lastUsed: "2025.11.04 (어제)",
    monthlyMinutes: [1820, 1640, 1500, 980, 760],
    avgPerWeek: 12,
    overlap: ["Figma Pro"],
  },
  4: { // Figma Pro
    lastUsed: "2025.11.05 (오늘)",
    monthlyMinutes: [2200, 2400, 2600, 2800, 3000],
    avgPerWeek: 28,
    overlap: ["Adobe CC"],
  },
};

function SubsPage({ onAdd }) {
  const [sortBy, setSortBy] = useState("day"); // day | price | name
  const [editing, setEditing] = useState(null);
  const [tipOpen, setTipOpen] = useState(null); // { kind: "cancel"|"overlap", subId? }

  const today = new Date();
  const todayDate = today.getDate();

  const monthlyActive = SUBS.filter(s => s.status === "active" && s.cycle === "월");
  const yearlyActive  = SUBS.filter(s => s.status === "active" && s.cycle === "년");
  const pausedSubs    = SUBS.filter(s => s.status === "paused");
  const monthlyTotal  = monthlyActive.reduce((a, s) => a + s.price, 0);
  const annualized    = monthlyTotal * 12 + yearlyActive.reduce((a, s) => a + s.price, 0);
  const upcoming      = monthlyActive.filter(s => s.day >= todayDate).sort((a,b)=>a.day-b.day);
  const nextOne       = upcoming[0];
  const dDay          = nextOne ? nextOne.day - todayDate : null;

  const fmt = (n) => "₩" + n.toLocaleString();

  // sorted list
  const list = useMemo(() => {
    const active = SUBS.filter(s => s.status === "active");
    const paused = SUBS.filter(s => s.status === "paused");
    const sorter = {
      day:   (a, b) => a.day - b.day,
      price: (a, b) => b.price - a.price,
      name:  (a, b) => a.name.localeCompare(b.name, "ko"),
    }[sortBy];
    return [...active.sort(sorter), ...paused];
  }, [sortBy]);

  // upcoming 7 days strip
  const next7Days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(today);
      dt.setDate(todayDate + i);
      const day = dt.getDate();
      const items = SUBS.filter(s => s.status === "active" && s.cycle === "월" && s.day === day);
      arr.push({ date: dt, day, items, isToday: i === 0 });
    }
    return arr;
  }, [todayDate]);

  return (
    <div data-screen-label="06 정기구독">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 정기구독</div>
          <h1 className="page-title">정기구독 <span className="hand-sub">— 매달 빠져나가는 돈</span></h1>
          <div className="page-sub">
            활성 <b>{monthlyActive.length + yearlyActive.length}건</b>
            {nextOne && <> · 다음 결제 <b>{nextOne.name}</b> · {dDay === 0 ? <b className="text-red">오늘</b> : <b>D-{dDay}</b>}</>}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn primary" onClick={onAdd}>+ 구독 추가</button>
        </div>
      </div>

      {/* HERO: monthly total + upcoming 7 days strip */}
      <div className="subs-hero">
        <div className="subs-hero-l">
          <div className="subs-hero-lbl">이번 달 총 결제</div>
          <div className="subs-hero-val">{fmt(monthlyTotal)}</div>
          <div className="subs-hero-sub">
            연 환산 <b>{fmt(annualized)}</b>
            {pausedSubs.length > 0 && <> · 일시정지 <b>{pausedSubs.length}건</b></>}
          </div>
          <span className="subs-hero-stamp">MONTHLY</span>
        </div>
        <div className="subs-hero-r">
          <div className="subs-hero-lbl" style={{ marginBottom: 10 }}>다가오는 7일</div>
          <div className="next7">
            {next7Days.map((d, i) => (
              <div key={i} className={"next7-cell" + (d.isToday ? " today" : "") + (d.items.length ? " has" : "")}>
                <div className="next7-dow">{["일","월","화","수","목","금","토"][d.date.getDay()]}</div>
                <div className="next7-num">{d.day}</div>
                <div className="next7-pills">
                  {d.items.slice(0, 3).map(s => (
                    <span key={s.id} className="next7-pill" style={{ background: s.color }} title={`${s.name} ${fmt(s.price)}`}>
                      {s.initial}
                    </span>
                  ))}
                  {d.items.length > 3 && <span className="next7-more">+{d.items.length - 3}</span>}
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
            <div className="card-title"><Icon name="repeat" size={16} />구독 목록</div>
            <div className="card-sub">총 {SUBS.length}건 · 활성 {monthlyActive.length + yearlyActive.length} · 일시정지 {pausedSubs.length}</div>
          </div>
          <div className="filter-tabs">
            {[["day","결제일순"],["price","금액순"],["name","이름순"]].map(([k,l]) => (
              <span key={k} className={"filter-tab" + (sortBy === k ? " on" : "")} onClick={() => setSortBy(k)}>{l}</span>
            ))}
          </div>
        </div>

        <div className="subs-list">
          {list.map(s => {
            const dleft = s.cycle === "월"
              ? (s.day >= todayDate ? s.day - todayDate : (30 - todayDate + s.day))
              : null;
            const isSoon = dleft !== null && dleft <= 3 && s.status === "active";
            return (
              <div key={s.id} className={"sub-card" + (s.status === "paused" ? " paused" : "")} onClick={() => setEditing(s)}>
                <div className="sub-mark" style={{ background: s.color }}>{s.initial}</div>
                <div className="sub-main">
                  <div className="sub-name-row">
                    <h4>{s.name}</h4>
                    {s.status === "paused" && <span className="tag" style={{ background: "#f1e9d3", color: "var(--ink-mute)" }}>일시정지</span>}
                    {isSoon && <span className="tag" style={{ background: "var(--red)", color: "#fff" }}>곧 결제</span>}
                  </div>
                  <div className="sub-meta">
                    <span className="sub-cat" style={{ color: CAT_COLORS[s.cat] }}>● {s.cat}</span>
                    <span className="dot-sep">·</span>
                    <span>{s.cycle === "월" ? `매월 ${s.day}일` : `매년 ${s.day}월`}</span>
                    <span className="dot-sep">·</span>
                    <span>가입 {s.started}</span>
                  </div>
                </div>
                <div className="sub-price">
                  <div className="sub-price-val">{fmt(s.price)}</div>
                  <div className="sub-price-cycle">/ {s.cycle}</div>
                </div>
                <button className="sub-edit" title="설정" onClick={(e) => { e.stopPropagation(); setEditing(s); }}><Icon name="note" size={13} /></button>
              </div>
            );
          })}
        </div>
      </div>

      {/* INSIGHT — single compact strip */}
      <div className="card card-pad insight-card" style={{ marginTop: 18 }}>
        <div className="insight-stamp">SAVE TIPS</div>
        <h3>새는 돈, 점검해볼까요?</h3>
        <ul className="insight-list">
          <li>
            <span className="i-dot" style={{ background: "#e89aac" }} />
            <div>
              <b>왓챠</b>는 일시정지 중이지만 90일째 사용 안 함.
              <small>해지하면 연 <b>{fmt(12900*12)}</b> 절약</small>
            </div>
            <button className="timer-btn" onClick={() => setTipOpen({ kind: "cancel", subId: 7 })}>해지 검토</button>
          </li>
          <li>
            <span className="i-dot" style={{ background: "#a259ff" }} />
            <div>
              <b>Adobe CC</b>와 <b>Figma Pro</b> — 비슷한 작업에 둘 다 결제 중.
              <small>둘 중 하나만 쓰면 월 <b>{fmt(18500)}</b> 절약</small>
            </div>
            <button className="timer-btn" onClick={() => setTipOpen({ kind: "overlap", subId: 3 })}>자세히</button>
          </li>
        </ul>
      </div>

      {editing && <SubEditModal sub={editing} onClose={() => setEditing(null)} onAnalyze={() => { setTipOpen({ kind: "cancel", subId: editing.id }); setEditing(null); }} />}
      {tipOpen && <SaveTipModal tip={tipOpen} onClose={() => setTipOpen(null)} />}
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
  const [color, setColor] = useState(sub.color);
  const [status, setStatus] = useState(sub.status);
  const [confirmDel, setConfirmDel] = useState(false);

  const fmt = (n) => "₩" + Number(n || 0).toLocaleString();
  const annualSavings = (sub.cycle === "월" ? sub.price * 12 : sub.price);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3>구독 수정</h3>
              <span className="badge-edit">✏️ EDIT</span>
            </div>
            <small>가입 {sub.started} · 누적 결제 약 {fmt(sub.price * Math.max(1, monthsBetween(sub.started)))}</small>
          </div>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
          {/* preview header */}
          <div className="sub-edit-preview">
            <div className="sub-mark" style={{ background: color, width: 56, height: 56, fontSize: 20, borderRadius: 14 }}>
              {sub.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div className="sub-edit-name">{name || "—"}</div>
              <div className="sub-edit-price">
                <span style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: 22 }}>{fmt(price)}</span>
                <span style={{ fontSize: 12, color: "var(--ink-mute)", marginLeft: 4 }}>/ {cycle}</span>
              </div>
            </div>
            {status === "paused" && <span className="tag" style={{ background: "#f1e9d3", color: "var(--ink-mute)" }}>일시정지</span>}
            {status === "cancelled" && <span className="tag" style={{ background: "var(--red)", color: "#fff" }}>해지</span>}
          </div>

          <div className="field">
            <label>서비스명</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field-row">
            <div className="field">
              <label>금액</label>
              <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value || "0", 10))} />
            </div>
            <div className="field">
              <label>주기</label>
              <div className="seg">
                <button className={cycle === "월" ? "on" : ""} onClick={() => setCycle("월")}>월</button>
                <button className={cycle === "년" ? "on" : ""} onClick={() => setCycle("년")}>년</button>
              </div>
            </div>
          </div>

          <div className="field">
            <label>{cycle === "월" ? "결제일 (매월)" : "결제월 (매년)"}</label>
            <div className="day-picker">
              {Array.from({ length: cycle === "월" ? 31 : 12 }).map((_, i) => {
                const v = i + 1;
                return (
                  <button key={v} className={"day-cell" + (day === v ? " on" : "")} onClick={() => setDay(v)}>
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label>카테고리</label>
            <div className="cat-chip-row">
              {SUB_CATS.map(c => (
                <span key={c} className={"cat-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: CAT_COLORS[c], marginRight: 6, verticalAlign: "middle" }} />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="field">
            <label>색상</label>
            <div className="color-chip-row">
              {SUB_PALETTE.map(c => (
                <div key={c} className={"color-chip" + (color === c ? " on" : "")}
                  style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>

          <div className="field">
            <label>상태</label>
            <div className="status-seg">
              <button className={status === "active" ? "on" : ""} onClick={() => setStatus("active")}>
                <span className="ss-dot" style={{ background: "#4a8d5a" }} /> 활성
              </button>
              <button className={status === "paused" ? "on" : ""} onClick={() => setStatus("paused")}>
                <span className="ss-dot" style={{ background: "var(--ink-mute)" }} /> 일시정지
              </button>
              <button className={status === "cancelled" ? "on" : ""} onClick={() => setStatus("cancelled")}>
                <span className="ss-dot" style={{ background: "var(--red)" }} /> 해지
              </button>
            </div>
            {status === "paused" && <small className="status-hint">결제는 멈추지만 목록에는 남아있어요.</small>}
            {status === "cancelled" && <small className="status-hint" style={{ color: "var(--red)" }}>연 {fmt(annualSavings)} 절약 — 다시 가입할 때 데이터가 보존돼요.</small>}
          </div>

          {/* analyze CTA */}
          <button className="analyze-btn" onClick={onAnalyze}>
            <div>
              <div className="analyze-ttl">이 구독, 절약 분석</div>
              <div className="analyze-sub">최근 사용 빈도 · 중복 구독 점검 · 절약 시뮬레이션</div>
            </div>
            <Icon name="arrowRight" size={14} />
          </button>
        </div>

        <div className="modal-foot edit">
          {confirmDel ? (
            <>
              <span className="del-confirm-label">정말 삭제할까요?</span>
              <button className="timer-btn" onClick={() => setConfirmDel(false)}>아니오</button>
              <button className="timer-btn danger" onClick={onClose}>네, 삭제</button>
            </>
          ) : (
            <>
              <button className="timer-btn ghost-danger" onClick={() => setConfirmDel(true)}>
                <Icon name="trash" size={13} /> 삭제
              </button>
              <div style={{ flex: 1 }} />
              <button className="timer-btn" onClick={onClose}>취소</button>
              <button className="timer-btn primary" onClick={onClose}>저장하기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function monthsBetween(started) {
  // started "YYYY.MM"
  const [y, m] = started.split(".").map(n => parseInt(n, 10));
  const start = new Date(y, m - 1, 1);
  const now = new Date();
  return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

// ============================================================
// SAVE TIP MODAL — 절약 분석
// ============================================================
function SaveTipModal({ tip, onClose }) {
  const sub = SUBS.find(s => s.id === tip.subId);
  if (!sub) return null;
  const fmt = (n) => "₩" + n.toLocaleString();
  const annual = sub.cycle === "월" ? sub.price * 12 : sub.price;
  const usage = SUB_USAGE[sub.id] || { lastUsed: "—", monthlyMinutes: [0,0,0,0,0], avgPerWeek: 0, overlap: [] };
  const isOverlap = tip.kind === "overlap";
  const overlapSubs = usage.overlap.map(name => SUBS.find(s => s.name === name)).filter(Boolean);
  const totalSavings = isOverlap ? annual : annual;

  const maxMin = Math.max(...usage.monthlyMinutes, 60);
  const months = ["7월","8월","9월","10월","11월"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal save-tip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3>{isOverlap ? "중복 구독 분석" : "해지 검토"}</h3>
              <span className="badge-savings">💰 SAVE</span>
            </div>
            <small>{sub.name}{isOverlap && overlapSubs.length > 0 && ` × ${overlapSubs.map(s => s.name).join(", ")}`} 분석</small>
          </div>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: 16, maxHeight: "70vh", overflowY: "auto" }}>
          {/* Hero — projected savings */}
          <div className="savings-hero">
            <div className="savings-hero-lbl">해지 시 연 절약</div>
            <div className="savings-hero-val">{fmt(totalSavings)}</div>
            <div className="savings-hero-sub">
              월 {fmt(sub.cycle === "월" ? sub.price : Math.round(sub.price / 12))} × 12개월
            </div>
            <span className="savings-hero-stamp">SAVE</span>
          </div>

          {/* Usage chart */}
          <div className="usage-block">
            <div className="block-head">
              <div>
                <div className="block-ttl">최근 5개월 사용량</div>
                <div className="block-sub">마지막 사용 · {usage.lastUsed}</div>
              </div>
              <div className="block-stat">
                <div className="block-stat-val">{usage.avgPerWeek}<span>분/주</span></div>
              </div>
            </div>
            <div className="usage-bars">
              {usage.monthlyMinutes.map((m, i) => (
                <div key={i} className="usage-col">
                  <div className="usage-bar-wrap">
                    <div
                      className={"usage-bar" + (m === 0 ? " zero" : "") + (i === 4 ? " now" : "")}
                      style={{ height: m === 0 ? "4px" : `${(m / maxMin) * 100}%` }}
                    >
                      <span className="usage-val">{m === 0 ? "0" : `${Math.round(m/60)}h`}</span>
                    </div>
                  </div>
                  <div className="usage-lbl">{months[i]}</div>
                </div>
              ))}
            </div>
            {usage.avgPerWeek === 0 && (
              <div className="usage-warn">
                <Icon name="alert" size={14} /> 90일 이상 사용하지 않았어요. 해지하기 좋은 타이밍이에요.
              </div>
            )}
          </div>

          {/* Overlap section (only for overlap kind) */}
          {isOverlap && overlapSubs.length > 0 && (
            <div className="overlap-block">
              <div className="block-ttl">함께 결제 중인 비슷한 구독</div>
              <div className="block-sub" style={{ marginBottom: 10 }}>유사한 작업에 쓰이는 도구들이에요</div>
              <div className="overlap-row">
                <div className="overlap-card">
                  <div className="sub-mark" style={{ background: sub.color }}>{sub.initial}</div>
                  <div className="overlap-name">{sub.name}</div>
                  <div className="overlap-price">{fmt(sub.price)}<span>/{sub.cycle}</span></div>
                  <div className="overlap-use">주 {usage.avgPerWeek}분 사용</div>
                </div>
                <div className="overlap-vs">VS</div>
                {overlapSubs.map(o => {
                  const u = SUB_USAGE[o.id] || { avgPerWeek: 0 };
                  return (
                    <div key={o.id} className="overlap-card">
                      <div className="sub-mark" style={{ background: o.color }}>{o.initial}</div>
                      <div className="overlap-name">{o.name}</div>
                      <div className="overlap-price">{fmt(o.price)}<span>/{o.cycle}</span></div>
                      <div className="overlap-use">주 {u.avgPerWeek}분 사용</div>
                    </div>
                  );
                })}
              </div>
              <div className="overlap-rec">
                <Icon name="target" size={14} />
                <div>
                  <b>{usage.avgPerWeek < (SUB_USAGE[overlapSubs[0]?.id]?.avgPerWeek || 0) ? sub.name : overlapSubs[0].name}</b>를(을) 해지하면 연 <b>{fmt(annual)}</b> 절약
                </div>
              </div>
            </div>
          )}

          {/* Action breakdown */}
          <div className="action-list">
            <div className="block-ttl" style={{ marginBottom: 8 }}>이렇게 할 수 있어요</div>

            <div className="action-row">
              <div className="action-icon" style={{ background: "#f1e9d3", color: "var(--ink)" }}>⏸</div>
              <div className="action-main">
                <div className="action-ttl">일시정지</div>
                <div className="action-sub">최대 3개월. 데이터는 그대로 남아있어요.</div>
              </div>
              <div className="action-savings">
                <div className="action-amt">{fmt(sub.cycle === "월" ? sub.price * 3 : Math.round(sub.price / 4))}</div>
                <div className="action-amt-sub">3개월 절약</div>
              </div>
              <button className="timer-btn">선택</button>
            </div>

            <div className="action-row recommended">
              <div className="action-icon" style={{ background: "var(--red)", color: "#fff" }}>✕</div>
              <div className="action-main">
                <div className="action-ttl">해지 <span className="rec-tag">추천</span></div>
                <div className="action-sub">바로 해지. 다음 결제일부터 청구 안 됨.</div>
              </div>
              <div className="action-savings">
                <div className="action-amt">{fmt(annual)}</div>
                <div className="action-amt-sub">연 절약</div>
              </div>
              <button className="timer-btn primary">해지하기</button>
            </div>

            {!isOverlap && (
              <div className="action-row">
                <div className="action-icon" style={{ background: "var(--yellow)", color: "var(--ink)" }}>↓</div>
                <div className="action-main">
                  <div className="action-ttl">하위 요금제로 변경</div>
                  <div className="action-sub">광고 포함 · 화질 제한이 있을 수 있어요.</div>
                </div>
                <div className="action-savings">
                  <div className="action-amt">{fmt(Math.round(sub.price * 0.4) * 12)}</div>
                  <div className="action-amt-sub">연 절약 (예상)</div>
                </div>
                <button className="timer-btn">선택</button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-foot">
          <button className="timer-btn" onClick={onClose}>나중에</button>
          <button className="timer-btn primary" onClick={onClose}>30일 후 다시 알려주기</button>
        </div>
      </div>
    </div>
  );
}

window.SubsPage = SubsPage;
